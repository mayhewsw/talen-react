from io import open
from conllu import parse_incr
import os
import sys
from talen.data_readers.ud_reader import UDReader
from talen.dal.mongo_dal import MongoDAL
from talen.models.document import Document
from talen.models.token import Token

path = "data/en_ewt-ud-train/"
dataset = "en_ewt"

if len(sys.argv) != 3:
    print("Usage: python conllu_to_mongo.py UD-conllu-file.conllu")

mongo_dal = MongoDAL("localhost:27017/")

numdocs = 0
sentences = []

docid = None
path_to_udfile = sys.argv[1]

with open(path_to_udfile, "r", encoding="utf-8") as data_file:

    for sentence in parse_incr(data_file):
        md = sentence.metadata
        if "newdoc id" in md:
            # upload the last one
            if docid is not None:
                document = Document(docid, dataset, sentences)
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
                print(tok)
                continue
            except:
                # if we get here, it's an int
                pass
            
            index = tok["id"]-1
            sentence_toks.append(Token(docid, tok["form"], index))
        print(sentence_toks)
        sentences.append(sentence_toks)

print(f"Wrote out {numdocs} docs to Mongo")
