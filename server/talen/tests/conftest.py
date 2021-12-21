import pytest
from talen.dal.mongo_dal import MongoDAL
from talen.models.document import Document
from talen.models.token import Token
from talen.models.user import User
from talen.models.annotation import Annotation

def make_document(doc_name):
    """
    A little helper function
    """
    dataset_id = "dataset1"
    words = "These are some words .".split()
    sentences = [[Token(doc_name, w, i) for i,w in enumerate(words)]]

    return Document(doc_name, dataset_id, sentences)


@pytest.fixture
def document():
    return make_document(doc_name="doc1")

@pytest.fixture
def document_list():
    return [make_document(doc_name=f"doc{i}") for i in range(1,11)]

@pytest.fixture
def mongo_dal():
    return MongoDAL("test")

@pytest.fixture
def user():
    user = User("coolUser", "user@user.com", None, False, False)
    user.set_password("passw0rd")
    return user

@pytest.fixture
def annotation():
    doc_name = "doc1"
    document = make_document(doc_name)
    sent_id = 0
    start_span = 1
    end_span = 2
    label = "PERSON"
    return Annotation("dataset1", doc_name, sent_id, "coolUser", label, document.sentences[sent_id][start_span:end_span], start_span, end_span)

@pytest.fixture
def final_span_annotation():
    doc_name = "doc1"
    document = make_document(doc_name)
    sent_id = 0
    sent = document.sentences[sent_id]
    start_span = len(sent)-2
    end_span = len(sent)
    label = "ORG"
    return Annotation("dataset1", doc_name, sent_id, "coolUser", label, document.sentences[sent_id][start_span:end_span], start_span, end_span)
