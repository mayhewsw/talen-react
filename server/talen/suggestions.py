import os
import threading
from collections import defaultdict
from typing import Dict, List

from logger import get_logger
from util import getPhrases
from views import get_reader

from config import Config

LOG = get_logger()


class Suggestion:
    def __init__(
        self,
        text: List[str],
        sent_index: int,
        start_index: int,
        label_distribution: Dict[str, float],
    ):
        self.text = text
        self.sent_index = sent_index
        self.start_index = start_index
        self.label_distribution = label_distribution

    def toJSON(self):
        return {
            "text": self.text,
            "sent_index": self.sent_index,
            "start_index": self.start_index,
            "label_distribution": self.label_distribution,
        }

    def __repr__(self):
        return f"{self.text} {self.label_distribution}"


class SuggestionEngine:
    def load_model(self, path: str) -> None:
        pass

    def save_model(self, path: str) -> None:
        pass

    def update_model(self, dataset: str) -> None:
        pass

    def make_suggestions(self, words: List[List[str]]) -> Dict[str, List[Suggestion]]:
        # output of this should be:
        # {word_or_phrase: [Suggestion, ...], word_or_phrase: ...}
        pass


class RuleSuggestionEngine(SuggestionEngine):
    def __init__(self):
        self.tag_rules = {}
        self.lock = threading.Lock()
        LOG.debug("RULE SUGGESTIONG GETTING INIT")

    def load_model(self, path: str) -> None:
        pass

    def save_model(self, path: str):
        pass

    def update_model(self, dataset: str, username: str) -> None:
        # get phrases from labels list
        #
        # for each B- tag in the labels list, update the tag_rules accordingly
        self.lock.acquire()

        cfg = Config.dataset_configs[dataset]

        new_tag_rules = {}

        datapath = cfg["path"]

        reader = get_reader(dataset)

        annotated_datapath = datapath + "-anno-" + username
        if os.path.exists(annotated_datapath):
            annotated_files = sorted(
                [p for p in os.listdir(annotated_datapath) if p[0] != "."]
            )

        for docid in annotated_files:
            path = os.path.join(annotated_datapath, docid)
            doc = reader.read_doc(dataset, docid, path)
            for sent, sent_labels in zip(doc["sentences"], doc["labels"]):
                if set(sent_labels) == {"O"}:
                    continue
                phrases = getPhrases(sent, sent_labels)
                for phrase in phrases:
                    word, _, tag = phrase
                    if word not in new_tag_rules:
                        new_tag_rules[word] = {}
                    if tag not in new_tag_rules[word]:
                        new_tag_rules[word][tag] = 0
                    new_tag_rules[word][tag] += 1

        self.tag_rules = new_tag_rules
        self.lock.release()

    def make_suggestions(
        self, sentences: List[List[str]]
    ) -> Dict[str, List[Suggestion]]:

        self.lock.acquire(timeout=2)

        LOG.debug(f"tag rules: {self.tag_rules}")
        LOG.debug(f"sentences {sentences}")

        # output of this should be:
        # {word_or_phrase: [Suggestion, ...], word_or_phrase: ...}
        suggestions = defaultdict(list)
        for sent_index, sent in enumerate(sentences):
            for phrase in self.tag_rules:
                phrase_toks = phrase.split(" ")
                for i, tok in enumerate(sent):
                    match = True
                    for j, phrase_tok in enumerate(phrase_toks):
                        # print(phrase_tok, sent[i+j])
                        if i + j >= len(sent) or phrase_tok != sent[i + j]:
                            match = False
                            break
                    if match:
                        denom = sum(self.tag_rules[phrase].values())
                        dist = {
                            k: v / float(denom)
                            for k, v in self.tag_rules[phrase].items()
                        }
                        s = Suggestion(phrase, sent_index, i, dist)
                        suggestions[phrase].append(s.toJSON())

        LOG.debug(f"make_suggestions: suggestions: {suggestions}")
        self.lock.release()
        return suggestions


if __name__ == "__main__":
    import time

    start = time.time()
    rse = RuleSuggestionEngine()
    rse.update_model("UD_English-EWT-train", "stephen")
    end = time.time()
    elapsed = end - start
    print(elapsed)
    sents = ["Delhi is pretty now .".split(), "New York is not near Chicago .".split()]
    start = time.time()
    ss = rse.make_suggestions(sents)
    end = time.time()
    elapsed = end - start
    print(elapsed)
    print(ss)
