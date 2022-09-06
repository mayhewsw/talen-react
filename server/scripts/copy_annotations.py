from typing import List
from talen.dal.mongo_dal import MongoDAL
from talen.models.document import Document
from talen.models.token import Token
from talen.data_readers.ud_reader import UDReader
from talen.config import Config
import argparse
from pymongo.errors import DuplicateKeyError
import tqdm
import sys

def copy_annotations(dataset_name: str, src_environment: str, tgt_environment: str, user_id: str) -> None:
    """
    """

    src_config = Config(src_environment)
    src_mongo_dal = MongoDAL(src_config.mongo_url)

    tgt_config = Config(tgt_environment)
    tgt_mongo_dal = MongoDAL(tgt_config.mongo_url)

    src_annotations = src_mongo_dal.get_all_annotations(dataset_name, user_id)
    print(f"found {len(src_annotations)} annotations from {src_environment}")

    for annotation in src_annotations:
        tgt_mongo_dal.add_annotation(annotation)


if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-name", help="This is often the name of the file without the .conllu ending", type=str)
    parser.add_argument("--source", help="Which environment to use", choices=["dev", "prod"], default="dev")
    parser.add_argument("--target", help="Which environment to use", choices=["dev", "prod"], default="dev")
    parser.add_argument("--user-id", help="Which user to copy", type=str)

    args = parser.parse_args()

    if args.source == args.target:
        print(f"source and target must be different!")
        sys.exit(-1)

    copy_annotations(args.dataset_name, args.source, args.target, args.user_id)