from typing import List
import os
import shutil

from git import Repo
from flask import Blueprint, current_app, jsonify, request, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, current_user
from talen.dal.github_dal import GithubDAL
from talen.models.annotation import Annotation, Token
from talen.dal.mongo_dal import MongoDAL
from talen.logger import get_logger
from talen.models.user import User
from talen.models.user import LoginStatus
from talen.util import get_annotations_from_client, make_client_doc
from talen.schemas import (
    UserAuthSchema, UserRegisterSchema, SaveDocSchema, CopyToGithubSchema, validate_request
)
from talen.services.user_service import UserService
from talen.services.annotation_service import AnnotationService
from talen.services.github_service import GitHubService
from collections import defaultdict
from talen.controller.file_downloader import download_data

LOG = get_logger()
bp = Blueprint("blueprint", __name__, template_folder="templates")

@bp.route("/")
def hello():
    return redirect("/index.html")

@bp.route("/users/authenticate", methods=["POST"])
def authenticate():
    """Login endpoint that returns JWT token"""
    json_payload = request.get_json()
    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate request data
    validated_data, errors = validate_request(UserAuthSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    # Use service for authentication
    user_service = UserService(current_app.mongo_dal)
    result = user_service.authenticate(
        validated_data["username"],
        validated_data["password"]
    )

    return jsonify(result), 200

@bp.route("/users/me")
@jwt_required()
def protected():
    return jsonify(current_user.serialize()), 200

@bp.route("/users/register", methods=["POST"])
def register():
    json_payload = request.get_json()
    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate request data
    validated_data, errors = validate_request(UserRegisterSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    username = validated_data["username"]
    email = validated_data["email"]
    password = validated_data["password"]

    mongo_dal: MongoDAL = current_app.mongo_dal

    # Check if user already exists
    if mongo_dal.check_user(username, password) == LoginStatus.SUCCESS:
        return jsonify({"msg": "User already exists"}), 400

    password_hash = None
    user = User(username, email, password_hash, False, False)
    LOG.info(f"Registering new user: {username}, {email}")
    user.set_password(password)
    mongo_dal.add_user(user)

    return jsonify({"msg": "User registered successfully"}), 201

@bp.route("/datasetlist")
def datasetlist():
    LOG.info("Requesting datasets")
    mongo_dal: MongoDAL = current_app.mongo_dal
    dataset_dict = defaultdict(list)
    dataset_stats = mongo_dal.get_stats()
    dataset_ids = sorted(list(dataset_stats.keys()))

    for dataset_id in dataset_ids:
        parent_dataset = dataset_id.split("-")[0]
        dataset_dict[parent_dataset].append(dataset_id)

    response = {
        # dataset_dict looks like: {"en_ewt" : ["en_ewt-ud-dev", "en_ewt-ud-test"], ...}
        "datasetDict": dataset_dict,
        # dataset_ids looks like: ["en_ewt-ud-dev", ...]
        # why do we have this...?
        "datasetIDs": dataset_ids,
        # dataset_stats looks like: {"en_ewt-ud-dev": {"numFiles": 9, "numAnnotated": 4, "annotators": ["a", "b"]}, ...}
        "datasetStats" : dataset_stats
    }
    return jsonify(response)


@bp.route("/loaddataset")
@jwt_required()
def loaddataset():
    dataset_id = request.args.get("dataset")
    if not dataset_id:
        return jsonify({"msg": "Missing dataset parameter"}), 400

    username = get_jwt_identity()
    if username == "guest":
        username = "stephen"

    mongo_dal: MongoDAL = current_app.mongo_dal

    # TODO: it's wasteful to grab the whole document, then just get the name
    fnames = mongo_dal.get_document_list(dataset_id)
    annotated_fnames = mongo_dal.get_annotated_doc_ids(dataset_id, username)
    assigned_fnames = mongo_dal.get_assigned_doc_ids(dataset_id, username)

    dataset = {
        "documentIDs": fnames,
        "annotatedDocumentIDs": annotated_fnames,
        "assignedDocumentIDs": assigned_fnames,
        "datasetID": dataset_id,
    }

    return jsonify(dataset), 200

@bp.route("/datasetstats")
@jwt_required()
def datasetstats():
    dataset_id = request.args.get("dataset")
    if not dataset_id:
        return jsonify({"msg": "Missing dataset parameter"}), 400

    username = get_jwt_identity()
    if username == "guest":
        username = "stephen"

    mongo_dal: MongoDAL = current_app.mongo_dal

    # TODO: it's wasteful to grab the whole document, then just get the name
    files = [d.name for d in mongo_dal.get_document_list(dataset_id)]
    annotated_files = mongo_dal.get_annotated_doc_ids(dataset_id, username)

    dataset = {
        "numDocuments": len(files),
        "numAnnotated": len(annotated_files),
        "datasetID": dataset_id,
    }

    return jsonify(dataset), 200


@bp.route("/loaddoc")
@jwt_required()
def loaddoc():
    docid = request.args.get("docid")
    dataset = request.args.get("dataset")

    if not docid or not dataset:
        return jsonify({"msg": "Missing docid or dataset parameter"}), 400

    username = get_jwt_identity()
    if username == "guest":
        username = "stephen"

    mongo_dal: MongoDAL = current_app.mongo_dal

    document = mongo_dal.get_document(docid, dataset)
    annotations: List[Annotation] = mongo_dal.get_annotations(dataset, docid, username)
    default_annotations: List[Annotation] = []

    client_doc = make_client_doc(document, annotations, default_annotations)
    if document is None or client_doc is None:
        LOG.warn(f"Document or client doc is None, {docid}, {dataset}")
        return jsonify({"msg": "Document not found"}), 404

    # Check if document has been reviewed/annotated by this user
    client_doc["isAnnotated"] = mongo_dal.is_document_annotated(dataset, docid, username)

    # TODO: Make labelsets configurable per dataset
    # For now, using a default NER labelset with RGB colors
    client_doc["labelset"] = {
        "O": "transparent",
        "PER": "#EADA48",  # Person - Yellow
        "ORG": "#37C4E3",  # Organization - Blue
        "LOC": "#4AC300",  # Location - Green
        "OTH": "#dc9e8c"   # Other - Light brown
    }

    return jsonify(client_doc), 200


@bp.route("/savedoc", methods=["POST"])
@jwt_required()
def savedoc():
    mongo_dal: MongoDAL = current_app.mongo_dal
    github_dal: GithubDAL = current_app.github_dal
    username = get_jwt_identity()
    user: User = mongo_dal.load_user(username)

    if user.readonly:
        return jsonify({"msg": "User is read-only"}), 403

    json_payload = request.get_json()
    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate request data
    validated_data, errors = validate_request(SaveDocSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    client_doc = {
        "sentences": validated_data["sentences"],
        "labels": validated_data["labels"],
        "docid": validated_data["docid"],
        "dataset": validated_data["dataset"],
        "isAnnotated": True,
    }

    # Retrieve original document to get Token objects (client doesn't send complete token info)
    original_doc = mongo_dal.get_document(client_doc["docid"], client_doc["dataset"])
    new_annotations = get_annotations_from_client(original_doc, client_doc, username)

    # Atomically replace all annotations for this document/user
    # This handles delete + insert + status update as a single logical operation
    LOG.info(f"Saving {len(new_annotations)} annotations for {client_doc['docid']}")
    mongo_dal.replace_annotations(
        client_doc["dataset"],
        client_doc["docid"],
        username,
        new_annotations
    )

    return jsonify({"msg": "Document saved successfully"}), 200

@bp.route("/copy_to_github", methods=["POST"])
@jwt_required()
def copy_to_github():
    mongo_dal: MongoDAL = current_app.mongo_dal
    github_dal: GithubDAL = current_app.github_dal
    json_payload = request.get_json()

    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate request data
    validated_data, errors = validate_request(CopyToGithubSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    github_repo_name = validated_data["repo_name"]
    dataset_key = validated_data["dataset_key"]

    try:
        cloned_repo = github_dal.clone_repo(github_repo_name)

        # Download annotations and statistics
        fname, stats_fname = download_data(dataset_key, mongo_dal)

        # Push both files to GitHub
        github_dal.push_files([fname, stats_fname], cloned_repo)
        return jsonify({"msg": "Successfully pushed to GitHub"}), 200
    except Exception as e:
        LOG.error(f"Error pushing to GitHub: {e}")
        return jsonify({"msg": f"Error pushing to GitHub: {str(e)}"}), 500
