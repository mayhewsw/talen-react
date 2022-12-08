from typing import Dict, Set, List, Tuple
from talen.dal.mongo_dal import MongoDAL
from talen.config import Config
from talen.models.annotation import Annotation
import argparse
from collections import defaultdict, Counter

def download_data(dataset_id: str, environment: str) -> None:
    config = Config(environment)
    mongo_dal = MongoDAL(config.mongo_url)
    documents = mongo_dal.get_all_documents(dataset_id)
    documents = sorted(documents, key=lambda d: d.name)

    if len(documents) == 0:
        datasets = mongo_dal.get_dataset_list()
        print(f"Dataset {dataset_id} may not exist. See these choices: {datasets}")
        return
    
    annotations = mongo_dal.get_all_annotations_for_dataset(dataset_id)
    annotated_doc_ids = set([annotation.doc_id for annotation in annotations])

    # this counts: {annotator_id: total number of annotations done in the corpus}
    # TODO(stephen): do we want this to count number of _documents_ annotated, not number of annotations?
    annotator_counter = Counter([annotation.user_id for annotation in annotations])

    print(f"There are {len(documents)} documents in the dataset")
    print(f"   with {len(annotations)} annotations from {len(annotator_counter)} annotators, covering {len(annotated_doc_ids)} documents.")
    print(f"Annotators: {annotator_counter}")

    if len(documents) != len(annotated_doc_ids):
        print(f"Warning: the number of annotated documents ({len(annotated_doc_ids)}) is not equal to the total number of documents ({len(documents)}). Are you sure all documents are annotated?")

    if len(annotator_counter) > 1:
        # TODO(stephen): somehow resolve disputes among annotators???
        print("Warning: using the most common annotator when there are disputes")

    # {doc_id : {sent_id: [anno1, anno2, anno3]}, ...}
    annotation_dict = defaultdict(lambda: defaultdict(list))
    for annotation in annotations:
        annotation_dict[annotation.doc_id][annotation.sent_id].append(annotation)

    with open(f"{dataset_id}.iob2", "w") as out:
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
            most_frequent_doc_annotator = doc_annotators[0]
            if len(doc_annotators) > 1:
                print(f"Warning: doc {doc_id} has multiple annotators: {doc_annotators}. Choosing: {most_frequent_doc_annotator}.")

            for sent_id, sentence in enumerate(document.sentences):
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
                    if label == "O":
                        continue
                    annotator_id = annotation.user_id
                    xlabel = "-"
                    for i in range(start, end):
                        prefix = "B-" if i == start else "I-"
                        labels[i] = f"{prefix}{label}\t{xlabel}\t{annotator_id}"

                
                for tok_id, tok_label in enumerate(zip(sentence, labels)):
                    token, label = tok_label
                    out.write(f"{tok_id+1}\t{token.text}\t{label}\n")
                out.write("\n")



if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-name", help="This is often the name of the file without the .conllu ending", type=str)
    parser.add_argument("--environment", help="Which environment to use", choices=["dev", "prod"], default="dev")

    args = parser.parse_args()
    download_data(args.dataset_name, args.environment)