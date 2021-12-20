from typing import Dict, List
from attr import attrs, attrib, asdict
from talen.models.token import Token

@attrs
class Annotation:
    id: str = attrib()
    dataset_id: str = attrib()
    doc_id: str = attrib()
    user_id: str = attrib()
    label: str = attrib()
    tokens: List[Token] = attrib()  # Hmm, should this be words?
    start_span: int = attrib()
    end_span: int = attrib()

    def serialize(self) -> Dict[any, any]:
        return asdict(self)

    @staticmethod
    def deserialize(obj):
        if "_id" in obj:
            del obj["_id"]
        obj["tokens"] = [Token.deserialize(t) for t in obj["tokens"]]
        return Annotation(**obj)