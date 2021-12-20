from app import db
from talen.models import User

# Why can't this be run inside app.py? I don't know why.
db.create_all()
for un in ["user1", "user2", "user3", "stephen"]:
    admin = User(username=un, email=f"{un}@{un}.com", admin=True, readonly=False)
    admin.set_password(un)
    db.session.add(admin)
db.session.commit()

print(
    "Admin users with usernames/passwords 'user1', 'user2', and 'user3' have been added."
)
