from typing import Dict, Set, List, Tuple
from talen.dal.mongo_dal import MongoDAL
from talen.config import Config
from talen.models.annotation import Annotation

def get_interannotator_agreement(environment: str) -> None:
    config = Config(environment)
    print(config.mongo_url)
    mongo_dal = MongoDAL(config.mongo_url)

    datasets = mongo_dal.get_dataset_list()
    print(f"there are {len(datasets)} datasets: {datasets}")

    users = mongo_dal.get_users()

    print(f"Users: {users}")
    dataset_id = datasets[-1]
    annotations_by_user = {user_id: flatten_and_separate_by_label(mongo_dal.get_all_annotations(dataset_id, user_id)) for user_id in users}

    non_empty_users = [user for user in users if len(annotations_by_user[user]) > 0]
    # TODO: filter out empty lists.

    for reference_user in non_empty_users:
        print(f"ref: {reference_user}")
        other_users = [user_id for user_id in non_empty_users if user_id != reference_user]
        reference_annotations = annotations_by_user[reference_user]

        for other_user in other_users:
            print(f"other: {other_user}")
            other_annotations = annotations_by_user[other_user]
            if reference_annotations.keys() != other_annotations.keys():
                print("Warning! label mismatch! Can't get agreement for user")
                continue
            ref_labels = reference_annotations.keys()

            for label in ref_labels:
                if label == "O": continue
                precision, recall, f1 = get_f1(reference_annotations[label], other_annotations[label])
                print(f"{label} {precision} {recall} {f1}")
        print()

            
def flatten_and_separate_by_label(annotations: List[Annotation]) -> Dict[str, Set[str]]:
    d = {}
    for annotation in annotations:
        label = annotation.label
        if label not in d:
            d[label] = set()
        d[label].add(f"{annotation.doc_id}_{annotation.sent_id}_{annotation.start_span}-{annotation.end_span}")
    return d


def get_f1(reference_set: Set[str], pred_set: Set[str]) -> Tuple[float, float, float]:
    """
    Given two sets, this calculates the F1 between them, counting the first 
    set as the reference set.
    """

    tp = len(reference_set.intersection(pred_set))
    fp = len(pred_set - reference_set)
    fn = len(reference_set - pred_set)

    precision = tp / (tp + fp)
    recall = tp / (tp + fn)

    if precision == 0 and recall == 0: return 0,0,0
    f1 = 2 * precision * recall / (precision + recall)
    return precision, recall, f1
