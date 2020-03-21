from app import db
from models import User
# Why can't this be run inside app.py? I don't know why.
db.create_all()
for un in ["a", "b", "c"]:
    admin = User(username=un, email=f'{un}@{un}.com', admin=True)
    admin.set_password(un)
    db.session.add(admin)
db.session.commit() 

print("Admin users with usernames/passwords 'a', 'b', and 'c' have been added.")