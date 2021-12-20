# content of tests/conftest.py
import pytest
from talen.dal.mongo_dal import MongoDAL
from talen.models.document import Document
from talen.models.token import Token


def make_document(doc_id):
    """
    A little helper function
    """
    dataset_id = "dataset1"
    words = "These are some words .".split()
    tokens = [Token(str(i), doc_id, dataset_id, w, i, i+1) for i,w in enumerate(words)]

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