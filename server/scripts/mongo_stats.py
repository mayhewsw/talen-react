import argparse
from talen.dal.mongo_dal import MongoDAL
from talen.config import Config

def get_mongo_stats(environment: str) -> None:

    config = Config(environment)
    print(config.mongo_url)
    mongo_dal = MongoDAL(config.mongo_url)

    datasets = mongo_dal.get_dataset_list()
    print(f"there are {len(datasets)} datasets: {datasets}")

    users = mongo_dal.get_users()
    print(f"Users: {users}")

    for dataset_id in datasets:
        print(f"dataset: {dataset_id}")
        doc_list = mongo_dal.get_document_list(dataset_id)
        overall_annotated = set()
        user_annotations = {}
        for user in users:
            annotated_doc_list = mongo_dal.get_annotated_doc_ids(dataset_id, user)
            user_annotations[user] = annotated_doc_list
            overall_annotated.update(annotated_doc_list)

        print(f"  Num docs: {len(doc_list)}")
        print(f"  Overall annotated: {len(overall_annotated)}")
        for k,v in user_annotations.items():
            print(f"  {k}: {len(v)}")


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--environment", "-e", help="Which environment to use", choices=["dev", "test", "prod"], default="dev")

    args = parser.parse_args()

    get_mongo_stats(args.environment)