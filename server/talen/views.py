import importlib
import os
from typing import List

import yaml
from flask import Blueprint, current_app, jsonify, request, redirect
from flask_jwt import current_identity, jwt_required
from talen.models.document import Document
from talen.models.annotation import Annotation
from talen.dal.mongo_dal import MongoDAL
from talen.logger import get_logger

from talen.config import Config
from talen.util import make_client_doc

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
@jwt_required()
def datasetlist():
    LOG.info("Requesting datasets")
    mongo_dal: MongoDAL = current_app.mongo_dal
    datasetIDs = {"datasetIDs": mongo_dal.get_dataset_list()}
    return jsonify(datasetIDs)


@bp.route("/loaddataset")
@jwt_required()
def loaddataset():
    dataset_id = request.args.get("dataset")

    mongo_dal: MongoDAL = current_app.mongo_dal

    # FIXME: it's wasteful to grab the whole document, then just get the name
    files = [d.name for d in mongo_dal.get_document_list(dataset_id)]
    # FIXME: figure out a way to determine which docs are annotated
    # annotated_ids = mongo_dal.get_annotated_doc_ids()
    annotated_files = []

    dataset = {
        "documentIDs": files,
        "annotatedDocumentIDs": annotated_files,
        "datasetID": dataset_id,
    }

    return jsonify(dataset)


def get_reader(dataset):
    cfg = Config.dataset_configs[dataset]
    module_name, class_name = cfg["reader"].split(".")
    module = importlib.import_module(f"data_readers.{module_name}")
    reader = getattr(module, class_name)
    return reader

@bp.route("/loaddoc")
@jwt_required()
def loaddoc():
    docid = request.args.get("docid")
    dataset = request.args.get("dataset")
    username = current_identity.id

    mongo_dal: MongoDAL = current_app.mongo_dal

    document = mongo_dal.get_document(docid, dataset)
    annotations: List[Annotation] = mongo_dal.get_annotations(dataset, docid, username)

    client_doc = make_client_doc(document, annotations)
    client_doc["isAnnotated"] = len(annotations) > 0
    # FIXME: how do we associate labelsets with datasets?
    client_doc["labelset"] = {
        "O": "transparent",
        "PER": "yellow",
        "ORG": "lightblue",
        "LOC": "yellowgreen"
    }

    return jsonify(client_doc)


@bp.route("/savedoc", methods=["POST"])
@jwt_required()
def savedoc():
    json_payload = request.get_json()
    # TODO: important that the doc that comes back is the same as the doc up above. Because it will be saved to file.
    doc = {
        "sentences": json_payload["sentences"],
        "labels": json_payload["labels"],
        "docid": json_payload["docid"],
        "dataset": json_payload["dataset"],
        "path": json_payload["path"],
        "isAnnotated": True,
    }
    LOG.info("Have received doc!")

    return jsonify(200)
