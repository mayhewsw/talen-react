from flask import Flask, jsonify, request
from flask_jwt import JWT, jwt_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config, BUILD_DIR

from views import bp
from logger import setup_logger, get_logger

setup_logger()
LOG = get_logger()

if Config.SERVE_STATIC:
    # in order for this to work, you need to run npm react-scripts build in the client folder.
    app = Flask(__name__, static_folder=BUILD_DIR, static_url_path='/')
else:
    app = Flask(__name__)
app.debug = True
app.config.from_object(Config)
db = SQLAlchemy(app)

if __name__ == "__main__":
    from models import User

    def load_user(user_id: int) -> User:
        LOG.debug(f"load_user happening, with id: {user_id}")
        user = User.query.filter_by(id=user_id).first()
        return user

    def authenticate(username: str, password: str) -> User:
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            return user

    def identity(payload):
        user_id = payload['identity']
        return load_user(user_id)

    jwt = JWT(app, authenticate, identity)

    @jwt.auth_response_handler
    def _default_auth_response_handler(access_token, identity):
        return jsonify({
            'access_token': access_token.decode('utf-8'),
            'username' : identity.username})

    CORS(app)

    app.register_blueprint(bp, url_prefix='/')

    app.run()
