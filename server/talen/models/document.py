from typing import List, Dict
from attr import attrs, attrib, asdict

from talen.models.token import Token

@attrs
class Document:
    name: str = attrib()
    dataset_id: str = attrib()
    sentences: List[List[Token]] = attrib()

    def _make_id(self):
        return f"{self.dataset_id}_{self.name}"

    def serialize(self) -> Dict[any, any]:
        d = asdict(self)
        d["_id"] = self._make_id()
        return d

    @staticmethod
    def deserialize(obj):
        deserialized_sents = []
        for sent in obj["sentences"]:
            deserialized_sents.append([Token.deserialize(t) for t in sent])
        return Document(name=obj["name"], dataset_id=obj["dataset_id"], sentences=deserialized_sents)
