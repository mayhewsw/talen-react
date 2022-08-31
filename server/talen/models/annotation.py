from typing import Dict, List
from attr import attrs, attrib, asdict
from talen.models.token import Token
import time

@attrs
class Annotation:
    dataset_id: str = attrib()
    doc_id: str = attrib()
    sent_id: int = attrib()
    user_id: str = attrib()
    label: str = attrib()
    tokens: List[Token] = attrib()  # Hmm, should this be words?
    start_span: int = attrib()
    end_span: int = attrib()
    _timestamp: int = attrib(default=time.time())

    def _make_id(self):
        return f"{self.user_id}_{self.dataset_id}_{self.doc_id}_{self.sent_id}_{self.start_span}-{self.end_span}"

    def serialize(self) -> Dict[any, any]:
        d = asdict(self)
        d["_id"] = self._make_id()
        return d

    def text(self) -> str:
        return " ".join(t.text for t in self.tokens)

    @staticmethod
    def deserialize(obj):
        del obj["_id"]
        # oops. should probably have just made this non-private in the first place
        if "_timestamp" in obj:
            obj["timestamp"] = obj["_timestamp"]
            del obj["_timestamp"]
        obj["tokens"] = [Token.deserialize(t) for t in obj["tokens"]]
        return Annotation(**obj)
