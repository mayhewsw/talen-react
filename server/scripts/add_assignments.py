from typing import List
from talen.dal.mongo_dal import MongoDAL
from talen.config import Config
import random

if __name__ == "__main__":    
    environment = "prod"

    config = Config(environment)
    mongo_dal = MongoDAL(config.mongo_url)

    d = {}
    with open("en_ewt_assignments.csv") as f:
        for line in f:
            line = line.strip()
            dataset_id, user_id, doc_id = line.split(",")
            key = f"{dataset_id}|||{user_id}"
            if key not in d:
                d[key] = []
            d[key].append(doc_id)
    
    for key in d:
        dataset_id, user_id = key.split("|||")
        assigned_doc_ids = d[key]
        mongo_dal.add_assignments(dataset_id, user_id, assigned_doc_ids)    