
from talen.models.document import Document
from talen.models.user import User
from talen.models.annotation import Annotation

def test_document_serialization(document):
    serialized_doc = document.serialize()
    assert serialized_doc["_id"] == "dataset1_doc1"
    assert serialized_doc["dataset_id"] == "dataset1"
    assert len(serialized_doc["sentences"][0]) == 5
    assert serialized_doc["sentences"][0][0]["text"] == "These"

    new_doc = Document.deserialize(serialized_doc)
    assert document == new_doc

def test_document_text(document: Document):
    text = Document.get_sentence_text(document.sentences[0])
    assert text == "These are some words ."

def test_user_serialization(user):
    serialized_user = user.serialize()

    assert serialized_user["_id"] == "coolUser"

    new_user = User.deserialize(serialized_user)
    assert user == new_user

def test_annotation_serialization(annotation):
    serialized_annotation = annotation.serialize()

    assert serialized_annotation["label"] == "PERSON"

    new_annotation = Annotation.deserialize(serialized_annotation)
    assert annotation == new_annotation