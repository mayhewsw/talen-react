from typing import Dict
from attr import attrs, attrib, asdict

@attrs
class Token:
    id: str = attrib()
    document_id: str = attrib()
    dataset_id: str = attrib()
    text: str = attrib()
    start_span: int = attrib()
    end_span: int = attrib()

    def serialize(self) -> Dict[any, any]:
        return asdict(self)

    @staticmethod
    def deserialize(obj):
        return Token(**obj)