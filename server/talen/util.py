from typing import Dict, List
from talen.models.document import Document
from talen.models.annotation import Annotation

def getPhrases(sent, labels):
    phrases = []
    i = 0
    phrase = None
    start = -1
    label = None
    for tok, tok_label in zip(sent, labels):
        if tok_label == "O":
            if phrase is not None:
                phrases.append((" ".join(phrase), start, label))
            phrase = None
            start = -1
            label = None
        elif tok_label[0] == "B":
            phrase = [tok]
            start = i
            label = tok_label.split("-")[-1]
        elif tok_label[0] == "I":
            # assume the data is well-formed.... ugh
            phrase.append(tok)
        i += 1

    if phrase is not None:
        phrases.append((" ".join(phrase), start, label))

    return phrases

def make_client_doc(document: Document, annotations: List[Annotation]) -> Dict[any, any]:
    """
    This creates a document that the client knows how to read. 
    TODO: make the client understand Document/Annotation model
    """
    labels = []
    raw_sentences = []
    for sentence in document.sentences:
        labels.append(["O"] * len(sentence))
        raw_sentences.append([t.text for t in sentence])

    # We use BIO format. 
    for annotation in annotations:
        # annotations with label O are dummies.
        if annotation.label == "O": continue
        anno_sent = labels[annotation.sent_id]
        for i in range(annotation.start_span, annotation.end_span):
            prefix = "B-" if i == annotation.start_span else "I-"
            anno_sent[i] = f"{prefix}{annotation.label}"

    doc = {
        "sentences": raw_sentences,
        "labels": labels,
        "docid": document.name,
        "dataset": document.dataset_id,
        "path": "ignore_plz",
    }

    return doc

def get_annotations_from_client(original_doc: Document, client_doc: Dict[any, any], username: str) -> List[Annotation]:
    """
    This converts a client document into a list of annotations
    TODO: make the client understand Document/Annotation model
    """
    annotations: List[Annotation] = []


    for sent_index, label_list in enumerate(client_doc["labels"]):
        # sentence is a list of words
        start_span = -1
        end_span = -1
        inside_entity = False
        tag = None

        for token_index, label in enumerate(label_list):
            if label.startswith("B-"):
                start_span = token_index
                inside_entity = True                
                tag = label.split("-")[-1]
            if inside_entity and label == "O":
                # create an annotation if we 
                end_span = token_index
                annotation = Annotation(client_doc["dataset"], client_doc["docid"], sent_index, username, tag, original_doc.sentences[sent_index][start_span:end_span], start_span, end_span)
                annotations.append(annotation)
                inside_entity = False

        if inside_entity:
            end_span = len(label_list)
            annotation = Annotation(client_doc["dataset"], client_doc["docid"], sent_index, username, tag, original_doc.sentences[sent_index][start_span:end_span], start_span, end_span)
            annotations.append(annotation)

    return annotations