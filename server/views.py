from flask import request, jsonify, Blueprint, session
from flask_login import login_required, login_user, current_user, logout_user
import datetime

bp = Blueprint('blueprint', __name__, template_folder='templates')

@bp.route("/", methods=["GET"])
def index():
    return jsonify(message="Hello World!"), 200

@bp.route("/login", methods=["POST"])
def login():
    print("logging in")
    from models import User
    json_payload = request.get_json()
    user: User = User.query.filter_by(username=json_payload['username']).first()
    if (user and user.check_password(json_payload['password'])):
            login_user(user, remember=True, duration=datetime.timedelta(1))
            return jsonify(isLoggedIn=current_user.is_authenticated), 200

    return jsonify(authorization=False), 403

@bp.route('/getsentence', methods=['GET', 'POST'])
def getsentence():
    return "this is a tokenized sentence , and it came from the server !"

@bp.route('/setlabels', methods=['POST'])
def setlabels():
    data = request.get_json()
    words = data["words"]
    labels = data["labels"]
    print(words)
    print(labels)
    return "OK"

@bp.route("/protected", methods=["GET"])
@login_required
def protected():
    return jsonify(message="Hello Protected World!"), 200


@bp.route("/me", methods=["GET"])
def me():
    print(session)
    print(request.headers)
    print(request)
    print(current_user)
    print(current_user.is_authenticated)
    return jsonify(isLoggedIn=current_user.is_authenticated)


@bp.route("/logout", methods=["GET"])
def logout():
    logout_user()
    return jsonify(isLoggedIn=current_user.is_authenticated)
