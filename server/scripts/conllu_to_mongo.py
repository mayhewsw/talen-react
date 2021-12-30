from io import open
from conllu import parse_incr
import sys
from talen.data_readers.ud_reader import UDReader
from talen.dal.mongo_dal import MongoDAL
from talen.models.document import Document
from talen.models.token import Token
import argparse

def write_to_mongo(path_to_udfile: str, dataset_name: str, use_local: bool) -> None:
    """
    This reads the conllu Universal Dependencies file, and writes out each individual
    document to the Mongo DB. 
    """

    if use_local:
        url = "mongodb://localhost:27017/"
    else:
        # FIXME: read these values from config
        username= "mayhewsw"
        password = "HAU-kgy!dqw8hur2fek"
        databaseName = "talen-annotation"
        url=f"mongodb+srv://{username}:{password}@talen-cluster.ieagz.mongodb.net/{databaseName}"
        # TODO: do I want this? ?retryWrites=true&w=majority"

    mongo_dal = MongoDAL(url)

    numdocs = 0
    sentences = []
    docid = None

    with open(path_to_udfile, "r", encoding="utf-8") as data_file:

        for sentence in parse_incr(data_file):
            md = sentence.metadata
            if "newdoc id" in md:
                # upload the last one
                if docid is not None:
                    document = Document(docid, dataset_name, sentences)
                    mongo_dal.add_document(document)
                    numdocs += 1

                # start a new one
                docid = md["newdoc id"]
                sentences = []


            # save the current sentence
            sentence_toks = []
            for tok in sentence:
                try:
                    tok["id"][0]
                    # that means it's a tuple, so we ignore
                    continue
                except:
                    # if we get here, it's an int
                    pass
                
                index = tok["id"]-1
                sentence_toks.append(Token(docid, tok["form"], index))
            sentences.append(sentence_toks)

    print(f"Wrote out {numdocs} docs to Mongo")


if __name__ == "__main__":
     
    # TODO: Might want to change this?
    path = "data/en_ewt-ud-train/"

    parser = argparse.ArgumentParser()
    parser.add_argument("--input-file", help="This should have a .conllu ending", type=str)
    parser.add_argument("--dataset-name", help="This is often the name of the file without the .conllu ending", type=str)
    parser.add_argument("--local", help="Write locally", action="store_true", default=True)

    args = parser.parse_args()

    write_to_mongo(args.input_file, args.dataset_name, args.local)