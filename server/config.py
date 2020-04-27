import os
import yaml
basedir = os.path.abspath(os.path.dirname(__file__))

CONFIG_BASE_FILE = os.path.join(basedir, "../config/base.yml")
DATASET_CONFIG_FILE_PATH = os.path.join(basedir, "../config/datasets")

class Config(object):

    if os.path.exists(CONFIG_BASE_FILE):
        with open(CONFIG_BASE_FILE) as f:
            config_data = yaml.load(f, Loader=yaml.Loader)
    else:
        print(f"File not found: {CONFIG_BASE_FILE}")

    config_fnames = filter(lambda p: p.endswith("yml"), os.listdir(DATASET_CONFIG_FILE_PATH))

    dataset_configs = {}
    for fname in config_fnames:
        with open(os.path.join(DATASET_CONFIG_FILE_PATH, fname)) as f:
            cfg = yaml.load(f, Loader=yaml.Loader)
            dataset_configs[cfg["name"]] = cfg

    # Some other stuff that doesn't really fit into a config file
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, config_data["DATABASE_FILE"])
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.environ.get('SECRET_KEY') or b'_5#y2L"F4Qhhh8z\n\xec]/'
    SESSION_TYPE = 'filesystem'
    JWT_AUTH_URL_RULE = "/users/authenticate"