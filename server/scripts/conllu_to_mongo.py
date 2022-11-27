from typing import List
from talen.dal.mongo_dal import MongoDAL
from talen.models.document import Document
from talen.models.token import Token
from talen.data_readers.ud_reader import UDReader
from talen.config import Config
import argparse
from pymongo.errors import DuplicateKeyError
import tqdm

def write_to_mongo(path_to_udfile: str, dataset_name: str, environment: str) -> None:
    """
    This reads the conllu Universal Dependencies file, and writes out each individual
    document to the Mongo DB. 
    """

    config = Config(environment)
    mongo_dal = MongoDAL(config.mongo_url)

    documents: List[Document] = UDReader.read_docs(path_to_udfile, dataset_name)
    try:
        mongo_dal.add_documents(documents)
        print(f"Wrote out {len(documents)} docs to Mongo")
    except DuplicateKeyError:
        print("At least one document already exists in the collection!")


if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-file", help="This should have a .conllu ending", type=str, required=True)
    parser.add_argument("--dataset-name", help="This is often the name of the file without the .conllu ending", type=str, required=True)
    parser.add_argument("--environment", help="Which environment to use", choices=["dev", "prod"], default="dev")

    args = parser.parse_args()

    write_to_mongo(args.input_file, args.dataset_name, args.environment)