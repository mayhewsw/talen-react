from typing import List
from talen.dal.mongo_dal import MongoDAL
from talen.models.user import User
from talen.config import Config
import argparse
from pymongo.errors import DuplicateKeyError


def delete_annotations(mongo_dal: MongoDAL, username: str, dataset: str, doc_id: str = None):
    all_datasets = mongo_dal.get_dataset_list()
    if dataset not in all_datasets:
        print(f"Dataset {dataset} not found!")
        return

    if doc_id is not None:
        annotation_list = mongo_dal.get_annotations(dataset, username, doc_id)
        print(f"Found {len(annotation_list)} annotations for {doc_id} in {dataset} by {username}")
    else:
        annotation_list = mongo_dal.get_all_annotations(dataset, username)
        print(f"Found {len(annotation_list)} annotations for user {username} in dataset {dataset}")


    if input(f"Please confirm deletion of these annotations: [y/n]: ") == "y":
        if doc_id is not None:
            mongo_dal.delete_annotations(dataset, username, doc_id)
        else:
            mongo_dal.delete_user_annotations(dataset, username)


if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("--username", "-u", help="Username", required=True, type=str)
    parser.add_argument("--dataset", "-d", help="Dataset", required=True, type=str)
    parser.add_argument("--doc_id", "-i", help="Docid", required=False, type=str)
    parser.add_argument("--environment", "-e", help="Which environment to use", choices=["dev", "prod"], default="dev")

    args = parser.parse_args()

    config = Config(args.environment)
    mongo_dal = MongoDAL(config.mongo_url)

    delete_annotations(mongo_dal, args.username, args.dataset)