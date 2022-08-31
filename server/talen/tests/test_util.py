from talen.models.annotation import Annotation
from talen.util import get_annotations_from_client, make_client_doc


def test_make_client_doc(document, annotation: Annotation, final_span_annotation: Annotation):
    client_doc = make_client_doc(document, [annotation, final_span_annotation])
    assert len(client_doc["sentences"]) == 1
    assert client_doc["labels"][0][1] == "B-PERSON"

def test_get_client_doc(document, initial_annotation: Annotation, annotation: Annotation, final_span_annotation: Annotation):
    client_doc = make_client_doc(document, [initial_annotation, annotation, final_span_annotation])
    annotations = get_annotations_from_client(document, client_doc, annotation.user_id)

    assert len(annotations) == 3

    assert annotations[0].label == "LOCATION"
    assert len(annotations[0].tokens) == 1
    assert annotations[0].text() == "These"

    assert annotations[1].label == "PERSON"
    assert len(annotations[1].tokens) == 1
    assert annotations[1].text() == "are"

    assert annotations[2].label == "ORG"
    assert len(annotations[2].tokens) == 2
    assert annotations[2].text() == "words ."
