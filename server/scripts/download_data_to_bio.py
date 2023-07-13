from typing import Dict, Set, List
from talen.dal.mongo_dal import MongoDAL
from talen.config import Config
from talen.controller.file_downloader import download_data
import argparse


if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-name", help="This is often the name of the file without the .conllu ending", type=str, required=True)
    parser.add_argument("--environment", help="Which environment to use", choices=["dev", "prod"], default="dev")

    args = parser.parse_args()

    config = Config(args.environment)
    mongo_dal = MongoDAL(config.mongo_url)

    fname = download_data(args.dataset_name, mongo_dal)
    print(f"Downloaded data to {fname}")