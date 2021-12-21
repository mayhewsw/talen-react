from typing import List
from pymongo import MongoClient
from talen.models.annotation import Annotation
from talen.models.user import LoginStatus
from talen.models.document import Document
from talen.models.user import User
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
        response = self.datasets.find_one({"name": id, "dataset_id": dataset_id})
        # parse this into a document object
        return Document.deserialize(response) if response else None

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

    def add_user(self, user: User) -> None:
        self.logins.insert_one(user.serialize())

    def load_user(self, username: str) -> User:
        # TODO: include a warning or something if user isn't found
        return User.deserialize(self.logins.find_one({"id": username}))

    def check_user(self, user_id: str, password: str) -> LoginStatus:
        result = self.logins.find_one({"id" : user_id})
        if result == None:
            return LoginStatus.USER_NOT_FOUND
        user = User.deserialize(result)
        return LoginStatus.SUCCESS if user.check_password(password) else LoginStatus.PASSWORD_INCORRECT
            
    def add_annotation(self, annotation: Annotation) -> None:
        self.annotations.insert_one(annotation.serialize())

    def delete_annotation(self, annotation: Annotation) -> None:
        self.annotations.delete_one(annotation.serialize())    

    def get_annotations(self, dataset_id: str, doc_id: str, user_id: str) -> List[Annotation]:
        return [Annotation.deserialize(a) for a in self.annotations.find({"dataset_id": dataset_id, "doc_id": doc_id, "user_id" : user_id})]
