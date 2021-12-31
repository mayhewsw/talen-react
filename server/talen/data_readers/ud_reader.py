from typing import List
from conllu import parse_incr
from talen.models.document import Document
from talen.models.token import Token

# MISC_NAME = "Ent"


class UDReader:

    # @staticmethod
    # def get_ent_tag(tok: dict):
    #     if "misc" in tok and tok["misc"] is not None and MISC_NAME in tok["misc"]:
    #         return tok['misc'][MISC_NAME]
    #     else:
    #         return "O"


    @staticmethod
    def read_docs(path_to_udfile: str, dataset_name: str) -> List[Document]:
        sentences = []
        docid = None
        documents: List[Document] = []

        with open(path_to_udfile, "r", encoding="utf-8") as data_file:

            for sentence in parse_incr(data_file):
                md = sentence.metadata
                if "newdoc id" in md:
                    # upload the last one
                    if docid is not None:
                        document = Document(docid, dataset_name, sentences)
                        # Consider yielding here
                        documents.append(document)

                    # start a new one
                    docid = md["newdoc id"]
                    sentences = []

                # save the current sentence
                sentence_toks = []
                for tok in sentence:
                    try:
                        tok["id"][0]
                        # that means it's a tuple, so we ignore
                        continue
                    except:
                        # if we get here, it's an int
                        pass
                    
                    index = tok["id"]-1
                    # SpaceAfter is only in the misc if the value is "NO"
                    #space_after = "misc" in tok and "SpaceAfter" not in tok["misc"]
                    space_after = True
                    if tok["misc"] and "SpaceAfter" in tok["misc"] and tok["misc"]["SpaceAfter"] == "No":
                        space_after = False

                    # tok["misc"]["SpaceAfter"] --> False
                    # tok["misc"] is None --> True

                    sentence_toks.append(Token(docid, tok["form"], index, space_after))
                sentences.append(sentence_toks)

        # means we haven't yet dealt with the last doc
        if len(sentences) > 0:
            document = Document(docid, dataset_name, sentences)
            # Consider yielding here
            documents.append(document)

        return documents


    # @staticmethod
    # def read_doc(dataset: str, docid: str, path: str):
    #     sentences = []
    #     labels = []

    #     with open(path) as f:
    #         ud_sentences = parse_incr(f)

    #         for ud_sentence in ud_sentences:
    #             tokens = [t["form"] for t in ud_sentence]
    #             sentences.append(tokens)
    #             token_labels = [UDReader.get_ent_tag(t) for t in ud_sentence]
    #             labels.append(token_labels)

    #     doc = {
    #         "sentences": sentences,
    #         "labels": labels,
    #         "docid": docid,
    #         "dataset": dataset,
    #         "path": path
    #     }
    #     return doc

    # @staticmethod
    # def write_doc(doc, path):
    #     orig_path = doc["path"]

    #     sentences = doc["sentences"]
    #     labels = doc["labels"]

    #     with open(orig_path) as f, open(path, "w") as out:
    #         ud_sentences = list(parse_incr(f))

    #         # TODO: change to a try except
    #         assert len(sentences) == len(ud_sentences)

    #         for i, ud_sentence in enumerate(ud_sentences):
    #             sent_labels = labels[i]
    #             for label, tok in zip(sent_labels, ud_sentence):

    #                 if label is not "O":
    #                     if tok["misc"] is None:
    #                         tok["misc"] = OrderedDict()
    #                     tok["misc"]["Ent"] = label
    #             out.write(ud_sentence.serialize())
