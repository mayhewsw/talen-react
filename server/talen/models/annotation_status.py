"""
Annotation Status model - tracks which documents have been reviewed by which users
This replaces the "dummy annotation" hack
"""
from typing import Dict
from attr import attrs, attrib, asdict
from datetime import datetime


@attrs
class AnnotationStatus:
    """
    Tracks that a user has reviewed/annotated a document.
    This is separate from actual annotations to avoid the "dummy annotation" hack.
    """
    dataset_id: str = attrib()
    doc_id: str = attrib()
    user_id: str = attrib()
    last_updated: str = attrib(default=None)  # ISO format timestamp

    def _make_id(self):
        return f"{self.dataset_id}_{self.doc_id}_{self.user_id}"

    def serialize(self) -> Dict:
        d = asdict(self)
        d["_id"] = self._make_id()
        if not d["last_updated"]:
            d["last_updated"] = datetime.utcnow().isoformat()
        return d

    @staticmethod
    def deserialize(obj) -> "AnnotationStatus":
        if not obj:
            return None
        return AnnotationStatus(
            dataset_id=obj["dataset_id"],
            doc_id=obj["doc_id"],
            user_id=obj["user_id"],
            last_updated=obj.get("last_updated")
        )
