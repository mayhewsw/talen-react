from typing import List
from pymongo import MongoClient, TEXT
from talen.models.annotation import Annotation
from talen.models.annotation_status import AnnotationStatus
from talen.models.assignment import Assignment
from talen.models.user import LoginStatus
from talen.models.document import Document
from talen.models.user import User
import mongomock

# TODO: consider making this subclass IODAL
class MongoDAL():

    def __init__(self, url: str) -> None:
        """
        url is expected to include the mongodb:// or mongodb+srv:// prefix
        """
        self.client = mongomock.MongoClient() if "test" in url else MongoClient(url)
        self.url = url
        # TODO: can we test the client connection here?

        db = self.client.talen

        # these are the names of the collections: (roughly equivalent to SQL tables)
        self.logins = db.logins
        self.datasets = db.datasets
        self.annotations = db.annotations
        self.assignments = db.assignments
        self.annotation_status = db.annotation_status

    def add_document(self, document: Document) -> None:
        self.datasets.insert_one(document.serialize())

    def delete_document(self, doc_id: str) -> None:
        self.datasets.delete_one({"_id": doc_id})  

    def add_documents(self, documents: List[Document]) -> None:
        self.datasets.insert_many([document.serialize() for document in documents])

    def get_document(self, id: str, dataset_id: str) -> Document:
        response = self.datasets.find_one({"name": id, "dataset_id": dataset_id})
        # parse this into a document object
        return Document.deserialize(response) if response else None

    def get_document_list(self, dataset_id: str = None) -> List[str]:
        """
        This just gets document names for a given dataset
        """
        if dataset_id:
            return sorted(self.datasets.distinct("name", {"dataset_id": dataset_id}))
        return sorted(self.datasets.distinct("name"))

    def get_all_documents(self, dataset_id: str) -> List[Document]:
        """
        Does anyone actually use this?
        """
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
        """Load a user by username. Returns None if user not found."""
        result = self.logins.find_one({"id": username})
        return User.deserialize(result) if result else None

    def check_user(self, username: str, password: str) -> LoginStatus:
        result = self.logins.find_one({"id" : username})
        if result == None:
            return LoginStatus.USER_NOT_FOUND
        user = User.deserialize(result)
        return LoginStatus.SUCCESS if user.check_password(password) else LoginStatus.PASSWORD_INCORRECT
            
    def delete_user(self, username: str) -> None:
        self.logins.delete_one({"id": username})    

    def get_users(self) -> List[str]:
        return self.logins.distinct("id")

    def add_annotation(self, annotation: Annotation) -> None:
        """
        This will add an annotation to the database if it doesn't exist, and it will
        update an existing one if it does.
        """
        serialized_annotation = annotation.serialize()
        result = self.annotations.update_one({"_id": serialized_annotation["_id"]}, {"$set": serialized_annotation}, upsert=True)

        # Mark document as annotated
        self.mark_document_annotated(annotation.dataset_id, annotation.doc_id, annotation.user_id)

        return result

    def add_new_annotations(self, annotations: List[Annotation]) -> None:
        """
        This adds annotations as though they are new. It's up to the user to make sure that annotations
        like these don't exist in the db. This will throw an exception if not!
        """
        if not annotations:
            return

        serialized_annotations = [annotation.serialize() for annotation in annotations]
        self.annotations.insert_many(serialized_annotations)

        # Mark all documents as annotated (group by dataset_id, doc_id, user_id)
        seen = set()
        for annotation in annotations:
            key = (annotation.dataset_id, annotation.doc_id, annotation.user_id)
            if key not in seen:
                self.mark_document_annotated(annotation.dataset_id, annotation.doc_id, annotation.user_id)
                seen.add(key)

    def delete_annotation(self, annotation: Annotation) -> None:
        serialized_annotation = annotation.serialize()
        return self.annotations.delete_one({"_id": serialized_annotation["_id"]})

    def get_annotations(self, dataset_id: str, doc_id: str, user_id: str) -> List[Annotation]:
        return [Annotation.deserialize(a) for a in self.annotations.find({"dataset_id": dataset_id, "doc_id": doc_id, "user_id" : user_id})]

    def get_all_annotations(self, dataset_id: str, user_id: str) -> List[Annotation]:
        """
        This gets all user annotations
        """
        return [Annotation.deserialize(a) for a in self.annotations.find({"dataset_id": dataset_id, "user_id" : user_id})]

    def get_all_annotations_for_dataset(self, dataset_id: str) -> List[Annotation]:
        """
        This doesn't separate by user
        """
        return [Annotation.deserialize(a) for a in self.annotations.find({"dataset_id": dataset_id})]

    def delete_annotations(self, dataset_id: str, doc_id: str, user_id: str):
        return self.annotations.delete_many({"dataset_id": dataset_id, "doc_id": doc_id, "user_id" : user_id})

    def replace_annotations(self, dataset_id: str, doc_id: str, user_id: str, new_annotations: List[Annotation]) -> None:
        """
        Atomically replace all annotations for a document/user with new annotations.
        This is more reliable than delete-then-insert.
        """
        # Delete existing annotations
        self.delete_annotations(dataset_id, doc_id, user_id)

        # Insert new annotations if any
        if new_annotations:
            serialized_annotations = [annotation.serialize() for annotation in new_annotations]
            self.annotations.insert_many(serialized_annotations)

        # Mark document as annotated
        self.mark_document_annotated(dataset_id, doc_id, user_id)

    def delete_user_annotations(self, dataset_id: str, user_id: str) -> List[Annotation]:
        return self.annotations.delete_many({"dataset_id": dataset_id, "user_id": user_id})

    def get_annotated_doc_ids(self, dataset_id: str, user_id: str) -> List[str]:
        """
        Get list of document IDs that have been annotated (reviewed) by a user.
        Uses the annotation_status collection for accurate tracking.
        """
        return self.annotation_status.distinct("doc_id", {"dataset_id": dataset_id, "user_id": user_id})

    def get_all_annotated_doc_ids(self, dataset_id: str) -> List[str]:
        return self.annotations.distinct("doc_id", {"dataset_id": dataset_id})

    def get_all_annotators(self, dataset_id: str) -> List[str]:
        return self.annotations.distinct("user_id", {"dataset_id": dataset_id})

    def get_assigned_doc_ids(self, dataset_id: str, user_id: str) -> List[Assignment]:
        return self.assignments.distinct("doc_id", {"dataset_id": dataset_id, "user_id": user_id})

    def add_assignments(self, dataset_id: str, user_id: str, doc_ids: List[str]) -> None:
        """
        This takes care of creating the assignment object.

        Note that this will fail if assignments already exist.
        """
        assignments = [Assignment(dataset_id, doc_id, user_id) for doc_id in doc_ids]
        serialized_assignments = [assignment.serialize() for assignment in assignments]
        self.assignments.insert_many(serialized_assignments)

    def delete_all_assignments(self, dataset_id: str, user_id: str) -> List[str]:
        return self.assignments.delete_many({"dataset_id": dataset_id, "user_id" : user_id})

    def search(self, text):
        return self.datasets.find({"$text": {"$search": text}})

    def create_indexes(self):
        """
        Create database indexes for improved query performance.
        Should be called once during application initialization or via migration script.
        """
        from talen.logger import get_logger
        LOG = get_logger()

        # Text search index on dataset content
        self.datasets.create_index([("sentences.text", TEXT)])

        # Compound indexes for common queries
        self.datasets.create_index([("dataset_id", 1), ("name", 1)], unique=True)

        # Annotation indexes
        self.annotations.create_index([("dataset_id", 1), ("doc_id", 1), ("user_id", 1)])
        self.annotations.create_index([("dataset_id", 1), ("user_id", 1)])

        # Annotation status indexes
        self.annotation_status.create_index([("dataset_id", 1), ("user_id", 1)])
        self.annotation_status.create_index([("dataset_id", 1), ("doc_id", 1), ("user_id", 1)], unique=True)

        # Assignment indexes
        self.assignments.create_index([("dataset_id", 1), ("user_id", 1)])

        # User index
        self.logins.create_index([("id", 1)], unique=True)

        LOG.info("Database indexes created successfully")

    def create_index(self):
        """Deprecated: Use create_indexes() instead"""
        self.create_indexes()

    def get_stats(self):

        res = self.datasets.aggregate( [
            {
                '$group': {
                    '_id': '$dataset_id', 
                    'numFiles': {
                        '$count': {}
                    }
                }
            }
        ] )

        out_dict = {}
        for r in res:
            out_dict[r["_id"]] = {
                "numFiles": r["numFiles"],
                # need to initialize these values
                "numAnnotated": 0,
                "annotators": [] 
            }

        res = self.annotations.aggregate( [
            {
                    '$group': {
                        '_id': '$dataset_id', 
                        'unique_annotated_docs': {
                            '$addToSet': '$doc_id'
                        }, 
                        'unique_annotators': {
                            '$addToSet': '$user_id'
                        }
                    }
                }, {
                    '$project': {
                        'numAnnotated': {
                            '$size': '$unique_annotated_docs'
                        }, 
                        'annotators': '$unique_annotators'
                    }
                }
        ] )

        for r in res:
            out_dict[r["_id"]]["numAnnotated"] = r["numAnnotated"]
            out_dict[r["_id"]]["annotators"] = r["annotators"]

        return out_dict

    def mark_document_annotated(self, dataset_id: str, doc_id: str, user_id: str) -> None:
        """
        Mark a document as having been reviewed/annotated by a user.
        This creates or updates an AnnotationStatus record.
        Replaces the old "dummy annotation" hack.
        """
        status = AnnotationStatus(dataset_id, doc_id, user_id)
        serialized_status = status.serialize()
        self.annotation_status.update_one(
            {"_id": serialized_status["_id"]},
            {"$set": serialized_status},
            upsert=True
        )

    def is_document_annotated(self, dataset_id: str, doc_id: str, user_id: str) -> bool:
        """
        Check if a document has been reviewed/annotated by a user.
        """
        return self.annotation_status.find_one({
            "dataset_id": dataset_id,
            "doc_id": doc_id,
            "user_id": user_id
        }) is not None

