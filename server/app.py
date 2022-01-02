from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt import JWT
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

app.debug = True
app.config.from_object(Config)  # FYI: it's ok to use Config statically here
config = Config(os.environ.get("ENV") or "dev")
app.mongo_dal = MongoDAL(config.mongo_url)

# FIXME: remove this boilerplate code
if app.mongo_dal.check_user("a", "a") == LoginStatus.USER_NOT_FOUND:
    user = User("a", "user@user.com", None, True, False)
    user.set_password("a")
    app.mongo_dal.add_user(user)

if __name__ == "__main__":

    def authenticate(username: str, password: str) -> User:
        # TODO: what about failures?
        # TODO: also, this is inefficient, checking twice
        if app.mongo_dal.check_user(username, password) == LoginStatus.SUCCESS:
            return app.mongo_dal.load_user(username)

    def identity(payload):
        username = payload["identity"]
        return app.mongo_dal.load_user(username)

    jwt = JWT(app, authenticate, identity)

    @jwt.auth_response_handler
    def _default_auth_response_handler(access_token, identity):
        return jsonify(
            {
                "access_token": access_token.decode("utf-8"),
                "username": identity.id,
            }
        )

    CORS(app)

    app.register_blueprint(bp, url_prefix="/")

    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
