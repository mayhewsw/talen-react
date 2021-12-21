import importlib
import os

import yaml
from flask import Blueprint, current_app, jsonify, request, redirect
from flask_jwt import current_identity, jwt_required
from talen.dal.mongo_dal import MongoDAL
from talen.logger import get_logger

from talen.config import Config

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

    # cfg = Config.dataset_configs[datasetID]
    # datapath = cfg["path"]

    # files = sorted(os.listdir(datapath))

    # current_app.suggestion_engine.update_model(datasetID, current_identity.username)
    # LOG.debug(
    #     f"IN LOADDATASET, loaded {len(current_app.suggestion_engine.tag_rules)} rules"
    # )

    # annotated_datapath = datapath + "-anno-" + current_identity.username
    # if os.path.exists(annotated_datapath):
    #     annotated_files = sorted(
    #         [p for p in os.listdir(annotated_datapath) if p[0] != "."]
    #     )
    # else:
    #     annotated_files = []
    mongo_dal: MongoDAL = current_app.mongo_dal

    files = mongo_dal.get_document_list(dataset_id)
    # annotated_ids = mongo_dal.get_annotated_doc_ids()
    annotated_files = []

    dataset = {
        "documentIDs": files,
        "annotatedDocumentIDs": annotated_files,
        "datasetID": dataset_id,
    }

    return jsonify(dataset)


# def get_reader(dataset):
#     cfg = Config.dataset_configs[dataset]
#     module_name, class_name = cfg["reader"].split(".")
#     module = importlib.import_module(f"data_readers.{module_name}")
#     reader = getattr(module, class_name)
#     return reader


@bp.route("/loaddoc")
@jwt_required()
def loaddoc():
    docid = request.args.get("docid")
    dataset = request.args.get("dataset")

    cfg = Config.dataset_configs[dataset]

    datapath = cfg["path"]

    reader = get_reader(dataset)

    path = os.path.join(datapath, docid)
    doc = reader.read_doc(dataset, docid, path)

    path = datapath + "-anno-" + current_identity.username
    filepath = os.path.join(path, doc["docid"])

    doc["labelset"] = cfg["labelset"]
    doc["isAnnotated"] = False

    if os.path.exists(filepath):
        anno_doc = reader.read_doc(dataset, docid, filepath)

        # TODO: ideally, here we compare the tokens, etc. etc.
        # but for now we just overwrite the labels.
        doc["labels"] = anno_doc["labels"]
        doc["isAnnotated"] = True

    # suggestions = current_app.suggestion_engine.make_suggestions(doc["sentences"])
    # LOG.debug(f"suggestions {suggestions}")
    # doc["suggestions"] = suggestions

    return jsonify(doc)


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

    datapath = Config.dataset_configs[doc["dataset"]]["path"]
    outpath = datapath + "-anno-" + current_identity.username

    if not os.path.exists(outpath):
        os.mkdir(outpath)

    reader = get_reader(doc["dataset"])
    reader.write_doc(doc, os.path.join(outpath, doc["docid"]))

    current_app.suggestion_engine.update_model(
        json_payload["dataset"], current_identity.username
    )

    return jsonify(200)
