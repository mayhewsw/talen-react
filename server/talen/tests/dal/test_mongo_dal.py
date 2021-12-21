
from talen.dal.mongo_dal import MongoDAL
from talen.models.user import LoginStatus


def test_add_get_document(mongo_dal, document):
    mongo_dal.add_document(document)
    returned_doc = mongo_dal.get_document(document.name, document.dataset_id)
    assert document == returned_doc

def test_add_get_document_multiple(mongo_dal, document_list):
    dataset_id = document_list[0].dataset_id

    for doc in document_list:
        mongo_dal.add_document(doc)

    returned_docs = mongo_dal.get_document_list(dataset_id)
    assert returned_docs[0] == document_list[0]
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
    
def test_annotation(mongo_dal: MongoDAL, annotation):
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
