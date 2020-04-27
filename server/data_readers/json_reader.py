import os
import json

class JsonReader:

    @staticmethod
    def read_doc(dataset: str, docid: str, path):
        with open(path) as f:
            doc = json.load(f)
        return doc

    @staticmethod
    def write_doc(doc, path):
        with open(path, "w") as out:
            json.dump(doc, out, sort_keys=True, indent=2)
