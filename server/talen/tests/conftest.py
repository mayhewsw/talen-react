import pytest
from talen.dal.mongo_dal import MongoDAL
from talen.models.document import Document
from talen.models.token import Token
from talen.models.user import User
from talen.models.annotation import Annotation

def make_document(doc_id):
    """
    A little helper function
    """
    dataset_id = "dataset1"
    words = "These are some words .".split()
    tokens = [Token(str(i), doc_id, w, i, i+1) for i,w in enumerate(words)]

    return Document(doc_id, dataset_id, tokens)


@pytest.fixture
def document():
    return make_document(doc_id="doc1")

@pytest.fixture
def document_list():
    return [make_document(doc_id=f"doc{i}") for i in range(1,11)]

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
    doc_id = "doc1"
    document = make_document(doc_id)
    start_span = 1
    end_span = 2
    return Annotation("anno1", "dataset1", doc_id, "coolUser", "PERSON", document.tokens[start_span:end_span], start_span, end_span)
