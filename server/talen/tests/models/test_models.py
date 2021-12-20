
from talen.models.document import Document


def test_document_serialization(document):
    serialized_doc = document.serialize()
    assert serialized_doc["id"] == "doc1"
    assert serialized_doc["dataset_id"] == "dataset1"
    assert len(serialized_doc["tokens"]) == 5
    assert serialized_doc["tokens"][0]["text"] == "These"

    new_doc = Document.deserialize(serialized_doc)
    assert document == new_doc