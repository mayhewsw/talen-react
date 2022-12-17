from typing import List

from flask import Blueprint, current_app, jsonify, request, redirect
from flask_jwt import current_identity, jwt_required
from talen.models.annotation import Annotation, Token
from talen.dal.mongo_dal import MongoDAL
from talen.logger import get_logger
from talen.models.user import User
from talen.util import get_annotations_from_client, make_client_doc
from collections import defaultdict

LOG = get_logger()
bp = Blueprint("blueprint", __name__, template_folder="templates")

@bp.route("/")
def hello():
    return redirect("/index.html")

@bp.route("/users/me")
@jwt_required()
def protected():
    return current_identity

@bp.route("/datasetlist")
def datasetlist():
    LOG.info("Requesting datasets")
    mongo_dal: MongoDAL = current_app.mongo_dal
    dataset_dict = defaultdict(list)
    dataset_stats = mongo_dal.get_stats()
    dataset_ids = sorted(list(dataset_stats.keys()))

    for dataset_id in dataset_ids:
        parent_dataset, _, _ = dataset_id.split("-")
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
    username = current_identity.id
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

    return jsonify(dataset)

@bp.route("/datasetstats")
@jwt_required()
def datasetstats():
    dataset_id = request.args.get("dataset")
    username = current_identity.id

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

    return jsonify(dataset)


@bp.route("/loaddoc")
@jwt_required()
def loaddoc():
    docid = request.args.get("docid")
    dataset = request.args.get("dataset")
    username = current_identity.id

    if username == "guest":
        username = "stephen"

    mongo_dal: MongoDAL = current_app.mongo_dal

    document = mongo_dal.get_document(docid, dataset)
    annotations: List[Annotation] = mongo_dal.get_annotations(dataset, docid, username)
    default_annotations: List[Annotation] = []  #mongo_dal.get_annotations(dataset, docid, "default_anno")

    client_doc = make_client_doc(document, annotations, default_annotations)
    # this works because of the dummy annotation we add in savedoc()
    client_doc["isAnnotated"] = len(annotations) > 0

    # FIXME: how do we associate labelsets with datasets?
    # These have to be RGB!!!!
    client_doc["labelset"] = {
        "O": "transparent",
        "PER": "#EADA48",
        "ORG": "#37C4E3",
        "LOC": "#4AC300",
        "OTH": "#dc9e8c"
    }

    return jsonify(client_doc)


@bp.route("/savedoc", methods=["POST"])
@jwt_required()
def savedoc():
    mongo_dal: MongoDAL = current_app.mongo_dal
    user: User = mongo_dal.load_user(current_identity.id)

    if user.readonly: 
        # forbidden
        return jsonify(403)

    json_payload = request.get_json()
    # TODO: important that the doc that comes back is the same as the doc up above
    client_doc = {
        "sentences": json_payload["sentences"],
        "labels": json_payload["labels"],
        "docid": json_payload["docid"],
        "dataset": json_payload["dataset"],
        "isAnnotated": True,
    }

    # we have to get this because we need Token objects, and the client doesn't have enough info to create them    
    original_doc = mongo_dal.get_document(client_doc["docid"], client_doc["dataset"])
    new_annotations = get_annotations_from_client(original_doc, client_doc, current_identity.id)

    if len(new_annotations) > 0:
        # simple: just delete all annotations from this document and user.
        mongo_dal.delete_annotations(client_doc["dataset"], client_doc["docid"], current_identity.id)
        print(len(new_annotations))
        mongo_dal.add_new_annotations(new_annotations)

    # we also add a dummy annotation that marks that the document has been annotated!
    # since we delete all annotations, we need to do this every time
    dummy_token = Token(client_doc["docid"], "dummy", -1, False)
    dummy_annotation = Annotation(client_doc["dataset"], client_doc["docid"], 0, current_identity.id, "O", [dummy_token], -1,0)
    mongo_dal.add_annotation(dummy_annotation)

    return jsonify(200)
