from typing import Dict, Set, List, Tuple, Any
from talen.dal.mongo_dal import MongoDAL
from talen.models.annotation import Annotation

SEP = "$$$"


def get_interannotator_agreement(mongo_dal: MongoDAL, dataset_id: str) -> dict[Any, Any]:

    users = mongo_dal.get_users()
    annotations_by_user = {user_id: flatten_and_separate_by_label(mongo_dal.get_all_annotations(dataset_id, user_id)) for user_id in users}
    # this is users who have annotated at least one document
    non_empty_users = [user for user in users if len(annotations_by_user[user]) > 0]
    # if there is only one annotator, there is no interannotator agreement
    if len(non_empty_users) < 2:
        return {}
    
    annotated_docs_by_user = {user_id: set(mongo_dal.get_annotated_doc_ids(dataset_id, user_id)) for user_id in users}

    seen_pairs = set()
    scores = {}

    for reference_user in non_empty_users:
        other_users = [user_id for user_id in non_empty_users if user_id != reference_user]
        reference_annotations = annotations_by_user[reference_user]

        for other_user in other_users:
            # order doesn't matter here, it's a set
            seen_pair = frozenset([reference_user, other_user])
            # we want to check if we've already seen this pair, but we don't care about the order
            if seen_pair in seen_pairs:
                continue
            seen_pairs.add(seen_pair)
            pair_scores = {}

            other_annotations = annotations_by_user[other_user]

            # only include the set of documents that both annotators have done!
            common_annotated_docs = annotated_docs_by_user[reference_user].intersection(annotated_docs_by_user[other_user])
            pair_scores["num_common_annotated_docs"] = len(common_annotated_docs)

            # filter annotations to only include those documents
            # each annotation looks like: f"{annotation.doc_id}_{annotation.sent_id}_{annotation.start_span}-{annotation.end_span}"
            filtered_reference_annotations = {label: {annotation for annotation in annotations if annotation.split(SEP)[0] in common_annotated_docs} for label, annotations in reference_annotations.items()}
            filtered_other_annotations = {label: {annotation for annotation in annotations if annotation.split(SEP)[0] in common_annotated_docs} for label, annotations in other_annotations.items()}

            # remove "OTH" from these dicts
            filtered_reference_annotations.pop("OTH", None)
            filtered_other_annotations.pop("OTH", None)

            if filtered_reference_annotations.keys() != filtered_other_annotations.keys():
                print("    Warning! label mismatch! Can't get agreement for user")
                print(f"    reference: {filtered_reference_annotations.keys()}")
                print(f"    other: {filtered_other_annotations.keys()}")
                continue

            ref_labels = sorted(filtered_reference_annotations.keys())

            # associate seen pair with {label: {precision, recall, f1}}
            # scores format should be: 
            # {frozenset({user1, user2}): {label1: {precision, recall, f1}, label2: {precision, recall, f1}}}
            for label in ref_labels:
                if label == "O" or label == "OTH": continue
                precision, recall, f1 = get_f1(filtered_reference_annotations[label], filtered_other_annotations[label])
                pair_scores[label] = {"precision": precision, "recall": recall, "f1": f1}

            # when reporting scores, we want to report in a fixed order.
            ref_other = f"ref:{reference_user}, pred:{other_user}"
            scores[ref_other] = pair_scores

    # also calculate the average scores for each label
    label_scores = {}
    for label in ref_labels:
        if label == "O" or label == "OTH": continue
        label_scores[label] = {}
        label_scores[label]["precision"] = sum([scores[seen_pair][label]["precision"] for seen_pair in scores]) / len(scores)
        label_scores[label]["recall"] = sum([scores[seen_pair][label]["recall"] for seen_pair in scores]) / len(scores)
        label_scores[label]["f1"] = sum([scores[seen_pair][label]["f1"] for seen_pair in scores]) / len(scores)
    
    scores["average"] = label_scores

    return scores

            
def flatten_and_separate_by_label(annotations: List[Annotation]) -> Dict[str, Set[str]]:
    d = {}

    for annotation in annotations:
        label = annotation.label
        if label not in d:
            d[label] = set()
        d[label].add(f"{annotation.doc_id}{SEP}{annotation.sent_id}{SEP}{annotation.start_span}-{annotation.end_span}")
    return d


def get_f1(reference_set: Set[str], pred_set: Set[str]) -> Tuple[float, float, float]:
    """
    Given two sets, this calculates the F1 between them, counting the first 
    set as the reference set.
    """

    tp = len(reference_set.intersection(pred_set))
    fp = len(pred_set - reference_set)
    fn = len(reference_set - pred_set)

    precision = tp / (tp + fp) if tp + fp > 0 else 0
    recall = tp / (tp + fn) if tp + fn > 0 else 0

    if precision == 0 and recall == 0: return 0,0,0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall > 0 else 0
    return precision, recall, f1
