from typing import List
from talen.dal.mongo_dal import MongoDAL
from talen.config import Config
import argparse


def delete_dataset(mongo_dal: MongoDAL, dataset: str):
    all_datasets = mongo_dal.get_dataset_list()
    if dataset not in all_datasets:
        print(f"Dataset {dataset} not found!")
        return

    document_list = mongo_dal.get_document_list(dataset)
    print(f"Found {len(document_list)} documents in dataset {dataset}")    

    annotation_list = mongo_dal.get_all_annotations_for_dataset(dataset)
    if len(annotation_list) > 0:
        print(f"Found {len(annotation_list)} annotations in dataset {dataset}")

    if input(f"Are you sure you want to delete dataset {dataset} (this will not delete annotations): [y/n]: ") == "y":
        for doc_id in document_list:
            print(doc_id)
            mongo_dal.delete_document(f"{dataset}_{doc_id}")


if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", "-d", help="Dataset", required=True, type=str)
    parser.add_argument("--environment", "-e", help="Which environment to use", choices=["dev", "prod"], default="dev")

    args = parser.parse_args()

    config = Config(args.environment)
    mongo_dal = MongoDAL(config.mongo_url)

    delete_dataset(mongo_dal, args.dataset)