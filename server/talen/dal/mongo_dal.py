from typing import List
from pymongo import MongoClient
from talen.models.document import Document
import mongomock

# FIXME: consider making this subclass IODAL
class MongoDAL():
    
    def __init__(self, url: str) -> None:
        self.client = mongomock.MongoClient() if url == "test"  else MongoClient(f"mongodb://{url}")
        # TODO: can we test the client connection here?

        db = self.client.talen

        # these are the names of the collections: (roughly equivalent to SQL tables)
        self.logins = db.logins
        self.datasets = db.datasets
        self.annotations = db.annotations

    def add_document(self, document: Document) -> None:
        self.datasets.insert_one(document.serialize())

    def get_document(self, id: str, dataset_id: str) -> Document:
        response = self.datasets.find_one({"id": id, "dataset_id": dataset_id})
        # parse this into a document object
        return Document.deserialize(response)

    def get_document_list(self, dataset_id: str) -> List[Document]:
        # TODO: would it be faster to just get the unique doc names?
        cursor = self.datasets.find({"dataset_id": dataset_id})
        return [Document.deserialize(d) for d in cursor]

    def get_dataset_list(self) -> List[str]:
        """
        Order is not guaranteed in this function!
        """
        # get unique attribute from database
        return self.datasets.distinct("dataset_id")

