from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from talen.dal.github_dal import GithubDAL
from talen.dal.mongo_dal import MongoDAL
from talen.models.user import LoginStatus
from talen.models.user import User
from talen.logger import get_logger, setup_logger
from talen.views import bp
from talen.exceptions import TALENException, ValidationError
from marshmallow import ValidationError as MarshmallowValidationError
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

# Global error handlers
@app.errorhandler(TALENException)
def handle_talen_exception(error: TALENException):
    """Handle all custom TALEN exceptions"""
    LOG.error(f"{error.__class__.__name__}: {error.message}")
    response = {
        "error": error.__class__.__name__,
        "message": error.message
    }
    return jsonify(response), error.status_code


@app.errorhandler(MarshmallowValidationError)
def handle_validation_error(error: MarshmallowValidationError):
    """Handle Marshmallow validation errors"""
    LOG.warning(f"Validation error: {error.messages}")
    response = {
        "error": "ValidationError",
        "message": "Request validation failed",
        "details": error.messages
    }
    return jsonify(response), 400


@app.errorhandler(404)
def handle_not_found(error):
    """Handle 404 errors"""
    response = {
        "error": "NotFound",
        "message": "The requested resource was not found"
    }
    return jsonify(response), 404


@app.errorhandler(500)
def handle_internal_error(error):
    """Handle unexpected internal errors"""
    LOG.error(f"Internal server error: {error}", exc_info=True)
    response = {
        "error": "InternalServerError",
        "message": "An unexpected error occurred"
    }
    return jsonify(response), 500


CORS(app)

app.register_blueprint(bp, url_prefix="/")

# This doesn't run with gunicorn, so we put dev options in here.
if __name__ == "__main__":
    app.debug = True

    # Note: Test users should be created using scripts/init_dev_users.py
    # Don't create users in production code

    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
