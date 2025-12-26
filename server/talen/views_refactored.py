"""
Refactored views using service layer (Phase 3).
This is a reference implementation showing the improved architecture.

To use this: rename views.py to views_old.py and rename this file to views.py
"""
from flask import Blueprint, current_app, jsonify, request, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user

from talen.schemas import (
    UserAuthSchema, UserRegisterSchema, SaveDocSchema, CopyToGithubSchema, validate_request
)
from talen.services.user_service import UserService
from talen.services.annotation_service import AnnotationService
from talen.services.github_service import GitHubService
from talen.logger import get_logger

LOG = get_logger()
bp = Blueprint("blueprint", __name__, template_folder="templates")


@bp.route("/")
def hello():
    """Redirect to index page"""
    return redirect("/index.html")


@bp.route("/users/authenticate", methods=["POST"])
def authenticate():
    """
    Authenticate user and return JWT token.

    Request:
        {
            "username": str,
            "password": str
        }

    Returns:
        {
            "access_token": str,
            "username": str,
            "readOnly": bool,
            "admin": bool
        }
    """
    json_payload = request.get_json()
    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate input
    validated_data, errors = validate_request(UserAuthSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    # Use service - exceptions are handled by global error handlers
    user_service = UserService(current_app.mongo_dal)
    result = user_service.authenticate(
        validated_data["username"],
        validated_data["password"]
    )

    return jsonify(result), 200


@bp.route("/users/me")
@jwt_required()
def get_current_user():
    """
    Get current authenticated user information.

    Returns:
        User object serialized to JSON
    """
    return jsonify(current_user.serialize()), 200


@bp.route("/users/register", methods=["POST"])
def register():
    """
    Register a new user.

    Request:
        {
            "username": str,
            "email": str,
            "password": str
        }

    Returns:
        {"msg": "User registered successfully"}
    """
    json_payload = request.get_json()
    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate input
    validated_data, errors = validate_request(UserRegisterSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    # Use service - raises UserAlreadyExistsError if user exists
    user_service = UserService(current_app.mongo_dal)
    user_service.register(
        validated_data["username"],
        validated_data["email"],
        validated_data["password"]
    )

    return jsonify({"msg": "User registered successfully"}), 201


@bp.route("/datasetlist")
def datasetlist():
    """
    Get list of all datasets with statistics.

    Returns:
        {
            "datasetDict": dict,  # Grouped by parent dataset
            "datasetIDs": list,
            "datasetStats": dict
        }
    """
    LOG.info("Requesting datasets")

    # Use service
    annotation_service = AnnotationService(current_app.mongo_dal)
    response = annotation_service.get_all_dataset_stats()

    return jsonify(response), 200


@bp.route("/loaddataset")
@jwt_required()
def loaddataset():
    """
    Load dataset information for a user.

    Query params:
        dataset: Dataset ID

    Returns:
        {
            "documentIDs": list,
            "annotatedDocumentIDs": list,
            "assignedDocumentIDs": list,
            "datasetID": str
        }
    """
    dataset_id = request.args.get("dataset")
    if not dataset_id:
        return jsonify({"msg": "Missing dataset parameter"}), 400

    username = get_jwt_identity()
    if username == "guest":
        username = "stephen"

    # Use service
    annotation_service = AnnotationService(current_app.mongo_dal)
    dataset = annotation_service.get_dataset_info(dataset_id, username)

    return jsonify(dataset), 200


@bp.route("/datasetstats")
@jwt_required()
def datasetstats():
    """
    Get statistics for a specific dataset and user.

    Query params:
        dataset: Dataset ID

    Returns:
        {
            "numDocuments": int,
            "numAnnotated": int,
            "datasetID": str
        }
    """
    dataset_id = request.args.get("dataset")
    if not dataset_id:
        return jsonify({"msg": "Missing dataset parameter"}), 400

    username = get_jwt_identity()
    if username == "guest":
        username = "stephen"

    # Use service
    annotation_service = AnnotationService(current_app.mongo_dal)
    stats = annotation_service.get_dataset_stats(dataset_id, username)

    return jsonify(stats), 200


@bp.route("/loaddoc")
@jwt_required()
def loaddoc():
    """
    Load a document with user annotations.

    Query params:
        docid: Document ID
        dataset: Dataset ID

    Returns:
        Document object with annotations and labelset
    """
    docid = request.args.get("docid")
    dataset = request.args.get("dataset")

    if not docid or not dataset:
        return jsonify({"msg": "Missing docid or dataset parameter"}), 400

    username = get_jwt_identity()
    if username == "guest":
        username = "stephen"

    # Use service - raises DocumentNotFoundError if not found
    annotation_service = AnnotationService(current_app.mongo_dal)
    client_doc = annotation_service.get_document_with_annotations(
        dataset, docid, username
    )

    return jsonify(client_doc), 200


@bp.route("/savedoc", methods=["POST"])
@jwt_required()
def savedoc():
    """
    Save user annotations for a document.

    Request:
        {
            "sentences": list,
            "labels": list,
            "docid": str,
            "dataset": str
        }

    Returns:
        {"msg": "Document saved successfully"}
    """
    username = get_jwt_identity()

    # Check permission
    user_service = UserService(current_app.mongo_dal)
    user_service.check_permission(username, "write")

    json_payload = request.get_json()
    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate input
    validated_data, errors = validate_request(SaveDocSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    # Prepare client document data
    client_doc = {
        "sentences": validated_data["sentences"],
        "labels": validated_data["labels"],
        "docid": validated_data["docid"],
        "dataset": validated_data["dataset"],
        "isAnnotated": True,
    }

    # Use service to save
    annotation_service = AnnotationService(current_app.mongo_dal)
    num_saved = annotation_service.save_document_annotations(
        client_doc["dataset"],
        client_doc["docid"],
        username,
        client_doc
    )

    LOG.info(f"Saved {num_saved} annotations for document {client_doc['docid']}")
    return jsonify({"msg": "Document saved successfully"}), 200


@bp.route("/copy_to_github", methods=["POST"])
@jwt_required()
def copy_to_github():
    """
    Export dataset annotations to GitHub repository.

    Request:
        {
            "repo_name": str,
            "dataset_key": str
        }

    Returns:
        {"msg": "Successfully pushed to GitHub"}
    """
    json_payload = request.get_json()

    if not json_payload:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Validate input
    validated_data, errors = validate_request(CopyToGithubSchema(), json_payload)
    if errors:
        return jsonify({"msg": "Validation error", "errors": errors}), 400

    # Use service
    github_service = GitHubService(
        current_app.mongo_dal,
        current_app.github_dal
    )
    github_service.export_to_github(
        validated_data["repo_name"],
        validated_data["dataset_key"]
    )

    return jsonify({"msg": "Successfully pushed to GitHub"}), 200
