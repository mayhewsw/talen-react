from flask import request, jsonify, Blueprint
from flask_jwt import jwt_required, current_identity
import json
import os

bp = Blueprint('blueprint', __name__, template_folder='templates')

@bp.route('/users/me')
@jwt_required()
def protected():
    return current_identity

@bp.route('/datasetlist')
@jwt_required()
def datasetlist():
    # TODO: load only folders.
    dir_list = os.listdir("data")
    datasetIDs = {"datasetIDs" : dir_list}
    return jsonify(datasetIDs)

@bp.route('/loaddataset')
@jwt_required()
def loaddataset():
    datasetID = request.args.get('dataset')

    files = os.listdir(os.path.join("data", datasetID))
    # TODO: load dataset
    dataset = {"documentIDs" : files, 
            "datasetID" : datasetID}
    return jsonify(dataset)

@bp.route('/loaddoc')
@jwt_required()
def loaddoc():
    docid = request.args.get('docid')
    dataset = request.args.get('dataset')

    print(dataset, docid)

    path = os.path.join("data", dataset, docid)
    with open(path) as f:
        doc = json.load(f)

    foldername = doc["dataset"] + "-anno-" + current_identity.username
    path = os.path.join("data-anno", foldername, docid)
    if os.path.exists(path):
        with open(path) as f:
            anno_doc = json.load(f)
    
        # TODO: ideally, here we compare the tokens, etc. etc.
        # but for now we just overwrite the labels.
        doc["labels"] = anno_doc["labels"]

    return jsonify(doc)

@bp.route('/savedoc', methods=["POST"])
@jwt_required()
def savedoc():
    json_payload = request.get_json()
    # TODO: important that the doc that comes back is the same as the doc up above. Because it will be saved to file.
    doc = {
        "sentences":json_payload["sentences"],
        "labels":json_payload["labels"],
        "docid" : json_payload["docid"],
        "dataset" : json_payload["dataset"]
    }

    foldername = doc["dataset"] + "-anno-" + current_identity.username
    outpath = os.path.join("data-anno", foldername, doc["docid"])
    
    if not os.path.exists(os.path.join("data-anno", foldername)):
        os.mkdir(os.path.join("data-anno", foldername))
    
    with open(outpath, "w") as out:
        json.dump(doc, out, sort_keys=True, indent=2)
    
    return jsonify(200)
