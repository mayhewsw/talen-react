from typing import Dict
from attr import attrs, attrib, asdict


@attrs
class Assignment:
    dataset_id: str = attrib()
    doc_id: str = attrib()
    user_id: str = attrib()

    def _make_id(self):
        return f"{self.user_id}_{self.dataset_id}_{self.doc_id}"

    def serialize(self) -> Dict[any, any]:
        d = asdict(self)
        d["_id"] = self._make_id()
        return d

    @staticmethod
    def deserialize(obj):
        del obj["_id"]
        return Assignment(**obj)