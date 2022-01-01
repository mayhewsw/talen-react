# this will read all documents from mongo, annotate the doc, and write back again.

from typing import List
from conllu import parse_incr
from numpy import e
from talen.dal.mongo_dal import MongoDAL
from talen.models.annotation import Annotation
from talen.models.document import Document
from talen.models.token import Token
from talen.config import Config
import argparse
import spacy
from spacy.tokens import Doc

DEFAULT_ANNOTATION_USERNAME: str = "default_anno"

SPACY_LABEL_MAP = {
    "CARDINAL": "O",
    "DATE": "O",
    "EVENT": "O",
    "FAC": "LOC",
    "GPE": "LOC", 
    "LANGUAGE": "O", 
    "LAW": "O", 
    "LOC": "LOC", 
    "MONEY": "O", 
    "NORP": "O", # American, Greek.
    "ORDINAL": "O", 
    "ORG": "ORG", 
    "PERCENT": "O", 
    "PERSON": "PER", 
    "PRODUCT": "O",  # Possibly MISC?
    "QUANTITY": "O", 
    "TIME": "O", 
    "WORK_OF_ART": "O"
}


def make_default_annotations(dataset_name: str, environment: str) -> None:
    """
    This adds default annotations, which are created by Spacy
    """

    config = Config(environment)
    mongo_dal = MongoDAL(config.mongo_url)
    
    # consider using en_core_web_trf for better accuracy
    # python -m spacy download en_core_web_md
    nlp = spacy.load("en_core_web_md", exclude=["tokenizer", "tagger", "parser", "lemmatizer"])

    document_list = mongo_dal.get_document_list(dataset_name)

    if len(document_list) == 0:
        print("Warning: no documents in this dataset!")
        return

    print(f"Found {len(document_list)} documents")

    for document_name in document_list:
        # First, check to see if there are default annotations for this document
        default_annotations = mongo_dal.get_annotations(dataset_name, document_name, DEFAULT_ANNOTATION_USERNAME)
        if len(default_annotations) > 0:
            print(f"Warning: {document_name} already has default annotations! Skipping...")
            continue

        print(document_name)
        document = mongo_dal.get_document(document_name, dataset_name)  

        default_annotations: List[Annotation] = []
    
        for sent_ind, sentence in enumerate(document.sentences):
            words = [token.text for token in sentence]
            spaces = [token.space_after for token in sentence]
            doc = Doc(nlp.vocab, words=words, spaces=spaces)

            doc = nlp(doc)

            for ent in doc.ents:
                start_span = ent.start
                end_span = ent.end
                label = SPACY_LABEL_MAP[ent.label_]
                anno_tokens = sentence[start_span:end_span]
                if label != "O":
                    default_annotations.append(Annotation(dataset_name, document_name, sent_ind, DEFAULT_ANNOTATION_USERNAME, label, anno_tokens, start_span, end_span))
      
        if len(default_annotations) > 0:
            # FIXME: will this complain if it's already happened?
            mongo_dal.add_annotations(default_annotations)


if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-name", help="This is often the name of the file without the .conllu ending", type=str)
    parser.add_argument("--environment", help="Which environment to use", choices=["dev", "test", "prod"], default="dev")

    args = parser.parse_args()

    make_default_annotations(args.dataset_name, args.environment)