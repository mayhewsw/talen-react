from typing import Dict, List
from talen.models.document import Document
from talen.models.annotation import Annotation

def get_phrases(sent, labels):
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

def make_labels_lists_from_annotations(annotations: List[Annotation], document: Document) -> List[List[str]]:
    """
    This converts span-based annotations to list-based labels. It adds BIO tags to the labels.
    """
    labels = []
    for sentence in document.sentences:
        labels.append(["O"] * len(sentence))
    
    # We use BIO format. 
    for annotation in annotations:
        # annotations with label O are dummies.
        if annotation.label == "O": continue
        anno_sent = labels[annotation.sent_id]
        for i in range(annotation.start_span, annotation.end_span):
            prefix = "B-" if i == annotation.start_span else "I-"
            if i >= len(anno_sent):
                print(f"WARNING: annotation out of bounds: {annotation}, {i}, {len(anno_sent)}")
            else:
                anno_sent[i] = f"{prefix}{annotation.label}"

    return labels


def make_client_doc(document: Document, annotations: List[Annotation], default_annotations: List[Annotation] = []) -> Dict[any, any]:
    """
    This creates a document that the client knows how to read. 
    TODO: make the client understand Document/Annotation model
    """
    if document is None:
        return None

    blank_labels = []
    raw_sentences = []
    space_markers = []
    for sentence in document.sentences:
        blank_labels.append(["O"] * len(sentence))
        raw_sentences.append([t.text for t in sentence])
        space_markers.append([t.space_after for t in sentence])

    labels = make_labels_lists_from_annotations(annotations, document)
    default_labels = make_labels_lists_from_annotations(default_annotations, document)
    
    doc = {
        "sentences": raw_sentences,
        "labels": labels,
        "space_markers": space_markers,
        "default_labels": default_labels,
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
            if inside_entity and (label == "O" or label.startswith("B")):
                end_span = token_index
                annotation = Annotation(client_doc["dataset"], client_doc["docid"], sent_index, username, tag, original_doc.sentences[sent_index][start_span:end_span], start_span, end_span)
                annotations.append(annotation)
                inside_entity = False
            
            if label.startswith("B-"):
                start_span = token_index
                inside_entity = True                
                tag = label.split("-")[-1]

        if inside_entity:
            end_span = len(label_list)
            annotation = Annotation(client_doc["dataset"], client_doc["docid"], sent_index, username, tag, original_doc.sentences[sent_index][start_span:end_span], start_span, end_span)
            annotations.append(annotation)

    return annotations
