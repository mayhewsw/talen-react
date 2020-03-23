from flask import Flask, jsonify, request
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp
from flask_cors import CORS

class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

users = [
    User(1, 'user1', 'abcxyz'),
    User(2, 'user2', 'abcxyz'),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}

def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user

def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret-transformer-key-swm'

app.config["JWT_AUTH_URL_RULE"] = "/users/authenticate"
jwt = JWT(app, authenticate, identity)
CORS(app)

@jwt.auth_response_handler
def _default_auth_response_handler(access_token, identity):
    return jsonify({
        'access_token': access_token.decode('utf-8'), 
        'username' : identity.username})

@app.route('/users/me')
@jwt_required()
def protected():
    return current_identity

@app.route('/datasetlist')
@jwt_required()
def datasetlist():
    # TODO: load dataset
    datasetIDs = {"datasetIDs" : ["CoNLL", "English_EWT", "OntoNotes"]}
    return jsonify(datasetIDs)

@app.route('/loaddataset')
@jwt_required()
def loaddataset():
    data = request.get_json()
    datasetID = data["datasetID"]
    # TODO: load dataset
    dataset = {"docids" : ["doc1", "doc2", "doc3"], 
            "datasetID" : datasetID}
    return jsonify(dataset)

@app.route('/loaddoc')
@jwt_required()
def loaddoc():
    data = request.get_json()
    docid = data["docid"]
    dataset = data["dataset"]
    # TODO: in a different world, this should also have a bunch of metadata associated with it, like at least doc name and annotations.
    doc = {"sentences" : [["This is the first sentence.", "This is the second sentence."]],
        "docid" : docid, "dataset" : dataset }
    return jsonify(doc)

@app.route('/savedoc', methods=["POST"])
@jwt_required()
def savedoc():
    json_payload = request.get_json()
    # TODO: important that the doc that comes back is the same as the doc up above. Because it will be saved to file.
    doc = json_payload["doc"] 
    print("beep boop saving doc to file...")
    print(doc)
    print(current_identity)
    return 200


if __name__ == '__main__':
    app.run()