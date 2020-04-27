class ConllReader:

    @staticmethod
    def read_doc(dataset: str, docid: str, path: str):
        with open(path) as f:
            lines = f.readlines()
        sentences = []
        labels = []

        curr_sent = []
        curr_labels = []
        for line in lines:
            if len(line.strip()) == 0:
                if len(curr_sent) > 0:
                    sentences.append(curr_sent)
                    labels.append(curr_labels)

                curr_sent = []
                curr_labels = []
                continue

            sline = line.strip().split()
            word = sline[0]
            label = sline[-1]

            curr_sent.append(word)
            curr_labels.append(label)

        # in case the file doesn't end with an empty line
        if len(curr_sent) > 0:
            sentences.append(curr_sent)
            labels.append(curr_labels)

        doc = {
            "sentences": sentences,
            "labels": labels,
            "docid": docid,
            "dataset": dataset,
        }
        return doc

    @staticmethod
    def write_doc(doc, path: str):

        with open(path, "w") as out:
            for sentence,labels in zip(doc["sentences"], doc["labels"]):
                for tok, label in zip(sentence, labels):
                    out.write(f"{tok} {label}\n")
                out.write("\n")
