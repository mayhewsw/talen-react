import importlib
import os

import yaml
from flask import Blueprint, jsonify, request
from flask_jwt import current_identity, jwt_required

from config import DATASET_CONFIG_FILE_PATH, Config

bp = Blueprint("blueprint", __name__, template_folder="templates")


@bp.route("/users/me")
@jwt_required()
def protected():
    return current_identity


@bp.route("/datasetlist")
@jwt_required()
def datasetlist():

    keys = sorted(Config.dataset_configs.keys())
    datasetIDs = {"datasetIDs": keys}
    return jsonify(datasetIDs)


@bp.route("/loaddataset")
@jwt_required()
def loaddataset():
    datasetID = request.args.get("dataset")
    cfg = Config.dataset_configs[datasetID]
    datapath = cfg["path"]

    files = sorted(os.listdir(datapath))

    annotated_datapath = datapath + "-anno-" + current_identity.username
    if os.path.exists(annotated_datapath):
        annotated_files = sorted(
            [p for p in os.listdir(annotated_datapath) if p[0] != "."]
        )
    else:
        annotated_files = []

    dataset = {
        "documentIDs": files,
        "annotatedDocumentIDs": annotated_files,
        "datasetID": datasetID,
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

    return jsonify(200)
