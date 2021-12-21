from werkzeug.security import check_password_hash, generate_password_hash
from typing import Dict
from attr import attrs, attrib, asdict
from enum import Enum

@attrs
class User():
    id: str = attrib() # also known as the username!
    email: str = attrib()
    password_hash: str = attrib()
    admin: bool = attrib()
    readonly: bool = attrib()

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def _make_id(self):
        return f"{self.id}"

    def serialize(self) -> Dict[any, any]:
        d = asdict(self)
        d["_id"] = self._make_id()
        return d

    @staticmethod
    def deserialize(obj):
        del obj["_id"]
        return User(**obj)


class LoginStatus(Enum):
    SUCCESS = "success"
    USER_NOT_FOUND = "user_not_found"
    PASSWORD_INCORRECT = "password_incorrect"