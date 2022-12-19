from typing import List
from conllu import parse_incr
from talen.models.document import Document
from talen.models.token import Token


class UDReader:
    DEFAULT_SENTS_PER_DOC = 30

    @staticmethod
    def read_docs(path_to_udfile: str, dataset_name: str, ignore_docs: bool = False) -> List[Document]:
        sentences = []
        docid = None
        documents: List[Document] = []

        if ignore_docs:
            print("WARNING: ignore-docs is true!")

        with open(path_to_udfile, "r", encoding="utf-8") as data_file:

            for sentence in parse_incr(data_file):
                md = sentence.metadata
                if not ignore_docs and "newdoc id" in md:
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

        if docid == None and len(documents) == 1:
            batch_size = UDReader.DEFAULT_SENTS_PER_DOC
            if not ignore_docs:
                print(f"Warning: dataset doesn't specify documents, splitting into batches of {batch_size} sentences.")

            all_sentences = documents[0].sentences
            new_documents = []
            for i in range(0, len(all_sentences), batch_size):
                docid = f"batch-{i//batch_size:04}"
                batch_sentences = all_sentences[i:i+batch_size]
                document = Document(docid, dataset_name, batch_sentences)
                new_documents.append(document)
                
            documents = new_documents

        return documents
