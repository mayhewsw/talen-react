from typing import Dict, List
from talen.models.document import Document
from talen.models.annotation import Annotation
import argparse 
from talen.scores import get_interannotator_agreement

if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--environment", "-e", help="Which environment to use", choices=["dev", "test", "prod"], default="dev")

    args = parser.parse_args()

    get_interannotator_agreement(args.environment)