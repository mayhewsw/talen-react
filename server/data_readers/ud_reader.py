from conllu import parse_incr
from collections import OrderedDict

MISC_NAME = "Ent"


class UDReader:

    @staticmethod
    def get_ent_tag(tok: dict):
        if "misc" in tok and tok["misc"] is not None and MISC_NAME in tok["misc"]:
            return tok['misc'][MISC_NAME]
        else:
            return "O"

    @staticmethod
    def read_doc(dataset: str, docid: str, path: str):
        sentences = []
        labels = []

        with open(path) as f:
            ud_sentences = parse_incr(f)

            for ud_sentence in ud_sentences:
                tokens = [t["form"] for t in ud_sentence]
                sentences.append(tokens)
                token_labels = [UDReader.get_ent_tag(t) for t in ud_sentence]
                labels.append(token_labels)

        doc = {
            "sentences": sentences,
            "labels": labels,
            "docid": docid,
            "dataset": dataset,
            "path": path
        }
        return doc

    @staticmethod
    def write_doc(doc, path):
        orig_path = doc["path"]

        sentences = doc["sentences"]
        labels = doc["labels"]

        with open(orig_path) as f, open(path, "w") as out:
            ud_sentences = list(parse_incr(f))

            # TODO: change to a try except
            assert len(sentences) == len(ud_sentences)

            for i, ud_sentence in enumerate(ud_sentences):
                sent_labels = labels[i]
                for label, tok in zip(sent_labels, ud_sentence):

                    if label is not "O":
                        if tok["misc"] is None:
                            tok["misc"] = OrderedDict()
                        tok["misc"]["Ent"] = label
                out.write(ud_sentence.serialize())


if __name__ == "__main__":
    # TODO: move to a testing place!
    r = UDReader.read_doc("d", "d", "tmp2")
    UDReader.write_doc(r, "tmp3")