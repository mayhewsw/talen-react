from flask import request, jsonify, Blueprint
from flask_jwt import jwt_required, current_identity

bp = Blueprint('blueprint', __name__, template_folder='templates')

@bp.route('/users/me')
@jwt_required()
def protected():
    return current_identity

@bp.route('/datasetlist')
@jwt_required()
def datasetlist():
    # TODO: load dataset
    datasetIDs = {"datasetIDs" : ["CoNLL", "English_EWT", "OntoNotes"]}
    return jsonify(datasetIDs)

@bp.route('/loaddataset')
@jwt_required()
def loaddataset():
    data = request.get_json()
    datasetID = data["datasetID"]
    # TODO: load dataset
    dataset = {"docids" : ["doc1", "doc2", "doc3"], 
            "datasetID" : datasetID}
    return jsonify(dataset)

@bp.route('/loaddoc')
@jwt_required()
def loaddoc():
    data = request.get_json()
    docid = data["docid"]
    dataset = data["dataset"]
    # TODO: in a different world, this should also have a bunch of metadata associated with it, like at least doc name and annotations.
    doc = {"sentences" : [["This is the first sentence.", "This is the second sentence."]],
        "docid" : docid, "dataset" : dataset }
    return jsonify(doc)

@bp.route('/savedoc', methods=["POST"])
@jwt_required()
def savedoc():
    json_payload = request.get_json()
    # TODO: important that the doc that comes back is the same as the doc up above. Because it will be saved to file.
    doc = json_payload["doc"] 
    print("beep boop saving doc to file...")
    print(doc)
    print(current_identity)
    return 200
