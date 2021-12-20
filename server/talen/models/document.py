from typing import List, Dict
from attr import attrs, attrib, asdict, make_class

from talen.models.token import Token

@attrs
class Document:
    id: str = attrib()
    dataset_id: str = attrib()
    tokens: List[Token] = attrib()

    def serialize(self) -> Dict[any, any]:
        return asdict(self)

    @staticmethod
    def deserialize(obj):
        return Document(obj["id"],obj["dataset_id"], tokens=[Token.deserialize(t) for t in obj["tokens"]])
