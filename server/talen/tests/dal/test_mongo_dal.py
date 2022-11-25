
from talen.dal.mongo_dal import MongoDAL
from talen.models.user import LoginStatus
from pymongo.errors import DuplicateKeyError
import pytest

def test_add_get_document(mongo_dal, document):
    mongo_dal.add_document(document)
    with pytest.raises(DuplicateKeyError):
        mongo_dal.add_document(document)

    returned_doc = mongo_dal.get_document(document.name, document.dataset_id)
    assert document == returned_doc

def test_add_get_document_multiple(mongo_dal, document_list):
    dataset_id = document_list[0].dataset_id

    mongo_dal.add_documents(document_list)

    returned_docs = mongo_dal.get_document_list(dataset_id)
    assert returned_docs[0] == document_list[0].name
    assert len(returned_docs) == len(document_list)

def test_get_datasets(mongo_dal, document_list):
    for doc in document_list:
        mongo_dal.add_document(doc)

    assert set(mongo_dal.get_dataset_list()) == {"dataset1"}

def test_get_user(mongo_dal, user):
    mongo_dal.add_user(user)
    # this should pass
    assert mongo_dal.check_user("coolUser", "passw0rd") == LoginStatus.SUCCESS
    # this should fail b/c wrong password
    assert mongo_dal.check_user("coolUser", "not_a_real_password") == LoginStatus.PASSWORD_INCORRECT
    # this should fail b/c no user
    mongo_dal.check_user("noMan", "who_cares") == LoginStatus.USER_NOT_FOUND
    
def test_annotation(mongo_dal: MongoDAL, initial_annotation, annotation, final_span_annotation):
    mongo_dal.add_annotation(annotation)

    annotations = mongo_dal.get_annotations("dataset1", "doc1", "coolUser")
    assert len(annotations) == 1
    assert annotations[0].label == "PERSON"

    # Ugly to modify this object, but oh well!
    annotation.label = "ORG"
    mongo_dal.add_annotation(annotation)

    annotations = mongo_dal.get_annotations("dataset1", "doc1", "coolUser")
    assert len(annotations) == 1
    assert annotations[0].label == "ORG"

    # start from a clean slate
    mongo_dal.delete_annotations("dataset1", "doc1", "coolUser")

    # Test add_new_annotations
    # Modify it back again
    annotation.label = "PERSON"
    input_annotations = [initial_annotation, annotation, final_span_annotation]
    mongo_dal.add_new_annotations(input_annotations)
    annotations = mongo_dal.get_annotations("dataset1", "doc1", "coolUser")
    assert len(annotations) == 3
    sorted_annotations = sorted(annotations, key=lambda a: a.start_span)
    assert sorted_annotations[0] == initial_annotation
    assert sorted_annotations[1] == annotation
    assert sorted_annotations[2] == final_span_annotation


def test_delete_annotation(mongo_dal: MongoDAL, annotation):
    mongo_dal.add_annotation(annotation)

    annotations = mongo_dal.get_annotations("dataset1", "doc1", "coolUser")
    assert len(annotations) == 1
    assert annotations[0].label == "PERSON"

    mongo_dal.delete_annotations("dataset1", "doc1", "coolUser")
    annotations = mongo_dal.get_annotations("dataset1", "doc1", "coolUser")
    assert len(annotations) == 0

def test_get_annotated_doc_ids(mongo_dal: MongoDAL, document, annotation):
    mongo_dal.add_document(document)

    # no annotated doc ids before we've added anything
    annotated_doc_ids = mongo_dal.get_annotated_doc_ids("dataset1", "coolUser")
    assert annotated_doc_ids == []

    mongo_dal.add_annotation(annotation)

    # check that the doc is included
    annotated_doc_ids = mongo_dal.get_annotated_doc_ids("dataset1", "coolUser")
    assert annotated_doc_ids == [annotation.doc_id]

    # make sure that a different user gets no docs
    annotated_doc_ids = mongo_dal.get_annotated_doc_ids("dataset1", "notCoolUser")
    assert annotated_doc_ids == []

    # make sure that a different dataset gets no docs
    annotated_doc_ids = mongo_dal.get_annotated_doc_ids("dataset1billion", "coolUser")
    assert annotated_doc_ids == []