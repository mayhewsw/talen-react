
import random
random.seed(352)

# FIXME: replace the annotators in this list with those who will take assignments
annotators = ["anno1", "anno2"]
ratio = 0.2


doc_ids = []
dataset_id = "en_ewt-ud-train"
with open(f"UD_English-EWT/{dataset_id}.conllu") as f:
    for line in f:
        if "newdoc id" in line:
            doc_id = line.split()[4]
            doc_ids.append(doc_id)

random.shuffle(doc_ids)
num_doc_ids = int(ratio * len(doc_ids))

with open("en_ewt_assignments.csv", "a") as out:
    for i, user_id in enumerate(annotators):
        docs = doc_ids[num_doc_ids*i:num_doc_ids*(i+1)]
        for doc_id in docs:
            out.write(f"{dataset_id},{user_id},{doc_id}\n")