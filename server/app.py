from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt import JWT
from flask_sqlalchemy import SQLAlchemy
from talen.logger import get_logger, setup_logger
from talen.views import bp

from talen.config import BUILD_DIR, Config

setup_logger()
LOG = get_logger()

app = Flask(__name__, static_folder=BUILD_DIR, static_url_path="/")

app.debug = True
app.config.from_object(Config)
db = SQLAlchemy(app)

# app.suggestion_engine = RuleSuggestionEngine()


if __name__ == "__main__":
    from talen.models import User

    def load_user(user_id: int) -> User:
        LOG.debug(f"load_user happening, with id: {user_id}")
        user = User.query.filter_by(id=user_id).first()
        return user

    def authenticate(username: str, password: str) -> User:
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            return user

    def identity(payload):
        user_id = payload["identity"]
        return load_user(user_id)

    jwt = JWT(app, authenticate, identity)

    @jwt.auth_response_handler
    def _default_auth_response_handler(access_token, identity):
        return jsonify(
            {
                "access_token": access_token.decode("utf-8"),
                "username": identity.username,
            }
        )

    CORS(app)

    app.register_blueprint(bp, url_prefix="/")

    app.run()
