import argparse 
from talen.scores import get_interannotator_agreement
from talen.config import Config
from talen.dal.mongo_dal import MongoDAL
import json

if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--environment", "-e", help="Which environment to use", choices=["dev", "test", "prod"], default="dev")
    parser.add_argument("--dataset_id", "-d", help="Which dataset to use (example: en_ewt-ud-dev)", default=None)

    args = parser.parse_args()

    config = Config(args.environment)
    mongo_dal = MongoDAL(config.mongo_url)

    pairwise_f1 = get_interannotator_agreement(mongo_dal, args.dataset_id)
    print(json.dumps(pairwise_f1, indent=2))
