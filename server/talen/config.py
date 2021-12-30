import os
from datetime import timedelta

import yaml

basedir = os.path.abspath(os.path.dirname(__file__))

CONFIG_BASE_FILE = os.path.join(basedir, "../../config/base.yml")
BUILD_DIR = os.path.join(basedir, "../../client/build")


class Config(object):

    # These are used by app.config. IT requires upper case, class-level variables
    SECRET_KEY = os.environ.get("SECRET_KEY") or b'_5#y2L"F4Qhhh8z\n\xec]/'
    SESSION_TYPE = "filesystem"
    JWT_AUTH_URL_RULE = "/users/authenticate"
    JWT_EXPIRATION_DELTA = timedelta(seconds=3000)  # 1 minute, for testing.

    def __init__(self):
        config_data = {}
        if os.path.exists(CONFIG_BASE_FILE):
            with open(CONFIG_BASE_FILE) as f:
                config_data = yaml.load(f, Loader=yaml.Loader)
        else:
            print(f"File not found: {CONFIG_BASE_FILE}")

        self.mongo_database_name: str = config_data["mongo_database_name"]
        self.mongo_url: str = config_data["mongo_url"]