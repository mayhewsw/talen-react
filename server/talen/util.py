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