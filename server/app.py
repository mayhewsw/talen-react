from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from talen.dal.github_dal import GithubDAL
from talen.dal.mongo_dal import MongoDAL
from talen.models.user import LoginStatus
from talen.models.user import User
from talen.logger import get_logger, setup_logger
from talen.views import bp
import os

from talen.config import BUILD_DIR, Config

setup_logger()
LOG = get_logger()

app = Flask(__name__, static_folder=BUILD_DIR, static_url_path="/")

app.config.from_object(Config)  # FYI: it's ok to use Config statically here
config = Config(os.environ.get("ENV") or "dev")
app.mongo_dal = MongoDAL(config.mongo_url)
app.github_dal = GithubDAL(config)

jwt = JWTManager(app)

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return app.mongo_dal.load_user(identity)

CORS(app)

app.register_blueprint(bp, url_prefix="/")

# This doesn't run with gunicorn, so we put dev options in here.
if __name__ == "__main__":

    app.debug = True

    # This only happens at development time
    if app.mongo_dal.check_user("a", "a") == LoginStatus.USER_NOT_FOUND:
        user = User("a", "user@user.com", None, True, False)
        user.set_password("a")
        app.mongo_dal.add_user(user)

    # This only happens at development time
    if app.mongo_dal.check_user("b", "b") == LoginStatus.USER_NOT_FOUND:
        user = User("b", "user@user.com", None, True, False)
        user.set_password("b")
        app.mongo_dal.add_user(user)

    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
