from typing import Dict
from attr import attrs, attrib, asdict


@attrs
class Token:
    document_id: str = attrib()
    text: str = attrib()
    index: int = attrib()
    space_after: bool = attrib()

    def _make_id(self):
        return f"{self.document_id}_{self.index}"

    def serialize(self) -> Dict[any, any]:
        d = asdict(self)
        d["_id"] = self._make_id()
        return d

    @staticmethod
    def deserialize(obj):
        return Token(document_id=obj["document_id"], text=obj["text"], index=obj["index"], space_after=obj["space_after"])
