
from talen.models.document import Document
from talen.models.user import User
from talen.models.annotation import Annotation

def test_document_serialization(document):
    serialized_doc = document.serialize()
    assert serialized_doc["id"] == "doc1"
    assert serialized_doc["dataset_id"] == "dataset1"
    assert len(serialized_doc["tokens"]) == 5
    assert serialized_doc["tokens"][0]["text"] == "These"

    new_doc = Document.deserialize(serialized_doc)
    assert document == new_doc

def test_user_serialization(user):
    serialized_user = user.serialize()

    assert serialized_user["id"] == "coolUser"

    new_user = User.deserialize(serialized_user)
    assert user == new_user

def test_annotation_serialization(annotation):
    serialized_annotation = annotation.serialize()

    assert serialized_annotation["label"] == "PERSON"

    new_annotation = Annotation.deserialize(serialized_annotation)
    assert annotation == new_annotation