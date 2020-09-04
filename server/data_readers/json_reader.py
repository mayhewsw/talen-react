import json

class JsonReader:

    @staticmethod
    def read_doc(dataset: str, docid: str, path):
        with open(path) as f:
            doc = json.load(f)
        doc["path"] = path
        return doc

    @staticmethod
    def write_doc(doc: dict, path: str):
        with open(path, "w") as out:
            json.dump(doc, out, sort_keys=True, indent=2)
