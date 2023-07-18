from typing import Dict, Set, List
from talen.dal.mongo_dal import MongoDAL
from talen.models.annotation import Annotation
from collections import defaultdict, Counter
from talen.logger import get_logger
import json

LOG = get_logger()

def download_data(dataset_id: str, mongo_dal: MongoDAL) -> str:
    """
    dataset_id looks like: "en_ewt-ud-dev"
    """
    documents = mongo_dal.get_all_documents(dataset_id)
    documents = sorted(documents, key=lambda d: d.name)

    if dataset_id == None or len(documents) == 0:
        datasets = mongo_dal.get_dataset_list()
        LOG.error(f"Dataset {dataset_id} may not exist. See these choices: {datasets}")
        return None
    

    annotations = mongo_dal.get_all_annotations_for_dataset(dataset_id)
    annotated_doc_ids = set([annotation.doc_id for annotation in annotations])

    # this counts: {annotator_id: total number of annotations done in the corpus}
    # TODO(stephen): do we want this to count number of _documents_ annotated, not number of annotations?
    annotator_counter = Counter([annotation.user_id for annotation in annotations])

    if len(documents) != len(annotated_doc_ids):
        LOG.warn(f"Warning: the number of annotated documents ({len(annotated_doc_ids)}) is not equal to the total number of documents ({len(documents)}). Are you sure all documents are annotated?")

    if len(annotator_counter) > 1:
        # TODO(stephen): somehow resolve disputes among annotators???
        LOG.info("Warning: using the most common annotator when there are disputes")

    # {doc_id : {sent_id: [anno1, anno2, anno3]}, ...}
    annotation_dict = defaultdict(lambda: defaultdict(list))
    for annotation in annotations:
        annotation_dict[annotation.doc_id][annotation.sent_id].append(annotation)

    num_sentences = 0
    num_tokens = 0
    annotation_counter = Counter()
    num_docs_with_annotator_overlap = 0

    outfname = f"{dataset_id}.iob2"
    with open(outfname, "w") as out:
        for document in documents:
            doc_id = document.name
            out.write(f"# newdoc id = {doc_id}\n")

            # If multiple annotators have done this document, take the most frequent one
            doc_annotations: Dict[int, List[Annotation]] = annotation_dict[doc_id]
            doc_annotators: Set[str] = set()
            for sent_id in doc_annotations:
                sentence_annotations = doc_annotations[sent_id]
                for annotation in sentence_annotations:
                    doc_annotators.add(annotation.user_id)
            doc_annotators: List[str] = list(doc_annotators)
            doc_annotators = sorted(doc_annotators, key=lambda s: annotator_counter[s], reverse=True)
            most_frequent_doc_annotator = None
            if len(doc_annotators) == 0:
                LOG.warn(f"Warning, no annotators for this document!")
            else:       
                if len(doc_annotators) > 1:
                    LOG.warn(f"Warning: doc {doc_id} has multiple annotators: {doc_annotators}. Choosing: {most_frequent_doc_annotator}.")
                    num_docs_with_annotator_overlap += 1
                most_frequent_doc_annotator = doc_annotators[0]
    
            for sent_id, sentence in enumerate(document.sentences):
                num_sentences += 1
                num_tokens += len(sentence)
                text = "".join([tok.text + " "*tok.space_after for tok in sentence]).strip()

                out.write(f"# sent_id = {doc_id}-{sent_id+1:04}\n")
                out.write(f"# text = {text}\n")

                sent_annotations: List[Annotation] = doc_annotations[sent_id] if sent_id in doc_annotations else []
                # filter to only use the most frequent document annotator
                sent_annotations = [annotation for annotation in sent_annotations if annotation.user_id == most_frequent_doc_annotator]
                
                labels: List[str] = [f"O\t-\t-"] * len(sentence)
                for annotation in sent_annotations:
                    start = annotation.start_span
                    end = annotation.end_span
                    label = annotation.label
                    annotation_counter[label] += 1
                    # Filter out the OTH and O labels
                    if label in ["O", "B-OTH", "I-OTH", "B-O", "I-O"]:
                        continue
                    annotator_id = annotation.user_id
                    if annotator_id == "emil":
                        annotator_id = "EmilStenstrom"
                    xlabel = "-"
                    for i in range(start, end):
                        prefix = "B-" if i == start else "I-"
                        labels[i] = f"{prefix}{label}\t{xlabel}\t{annotator_id}"

                
                for tok_id, tok_label in enumerate(zip(sentence, labels)):
                    token, label = tok_label
                    out.write(f"{tok_id+1}\t{token.text}\t{label}\n")
                out.write("\n")


    data_stats = {
        "dataset_id": dataset_id,
        "num_documents": len(documents),
        "num_annotated_documents": len(annotated_doc_ids),
        "num_annotations": len(annotations),
        "num_annotators": len(annotator_counter),
        "annotator_ids": list(annotator_counter.keys()),
        "num_docs_with_multiple_annotators": num_docs_with_annotator_overlap,
        "num_sentences" : num_sentences,
        "num_tokens": num_tokens,
        "label_distribution": dict(annotation_counter)
    }

    # write data_stats to file
    stats_outfname = f"{dataset_id}.stats"
    with open(stats_outfname, "w") as out:
        out.write(json.dumps(data_stats, indent=2))

    return outfname, stats_outfname