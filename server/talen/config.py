from typing import Dict
import os
from datetime import timedelta

import yaml
import sys

from talen.logger import get_logger, setup_logger

setup_logger()
LOG = get_logger()

basedir = os.path.abspath(os.path.dirname(__file__))

CONFIG_BASE_FILE = os.path.join(basedir, "../../config/base.yml")
BUILD_DIR = os.path.join(basedir, "../../client/build")


class Config(object):

    # These are used by app.config. It requires upper case, class-level variables
    SECRET_KEY = os.environ.get("SECRET_KEY") or b'_5#y2L"F4Qhhh8z\n\xec]/'
    SESSION_TYPE = "filesystem"
    JWT_AUTH_URL_RULE = "/users/authenticate"
    JWT_EXPIRATION_DELTA = timedelta(seconds=3000)  # 1 minute, for testing.

    def load_config_file(self, fname: str) -> Dict[str, str]:
        """
        Check to see if config file exists before opening it
        """
        config_data = {}
        if os.path.exists(fname):
            with open(fname) as f:
                config_data = yaml.load(f, Loader=yaml.Loader)
        else:
            print(f"File not found: {fname}")
        return config_data


    def __init__(self, environment: str = None):

        config_data = self.load_config_file(CONFIG_BASE_FILE)

        if environment:
            env_config = self.load_config_file(CONFIG_BASE_FILE.replace("base", environment)) or {}

            # merge the two dicts together
            for key,value in env_config.items():
                config_data[key] = value

        self.mongo_database_name: str = config_data["mongo_database_name"]
        mongo_stub_url: str = config_data["mongo_stub_url"]

        # this means we are running locally
        if "localhost" in mongo_stub_url:
            self.mongo_url = f"mongodb://{mongo_stub_url}/"
        else:
            self.mongo_username = os.environ.get("MONGO_USERNAME")
            self.mongo_password = os.environ.get("MONGO_PASSWORD")

            if not self.mongo_username or not self.mongo_password:
                LOG.error(f"Missing either mongo username: {self.mongo_username} or mongo_password: {self.mongo_password}. Perhaps you forgot to source .env?")
                sys.exit(-1)

            # TODO: do I want this also? "?retryWrites=true&w=majority"
            self.mongo_url = f"mongodb+srv://{self.mongo_username}:{self.mongo_password}@{mongo_stub_url}/{self.mongo_database_name}"
