from typing import List
from talen.dal.mongo_dal import MongoDAL
from talen.config import Config
import random

if __name__ == "__main__":
    
    environment = "dev"
    user_id = "a"

    config = Config(environment)
    mongo_dal = MongoDAL(config.mongo_url)

    datasets = mongo_dal.get_dataset_list()

    dataset_id = datasets[0]

    print(dataset_id)
    print(user_id)

    all_doc_ids = mongo_dal.get_document_list(dataset_id)
    random.shuffle(all_doc_ids)

    assigned_doc_ids = all_doc_ids[:5]
    mongo_dal.add_assignments(dataset_id, user_id, assigned_doc_ids)