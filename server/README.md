
## Database

To check the database, do the following:

```python
> from app import db
> from models import User
> users = User.query.all()
> u = users[0]
> u.check_password("thing")
False
> u.set_password("thing")
> u.check_password("thing")
True
> admin = User(username='admin', email='admin@example.com')
> db.session.add(admin)
> db.session.commit()   # IMPORTANT!
```

This came from (here)[https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/#a-minimal-application].

## Login
This uses [flask-login](https://flask-login.readthedocs.io/en/latest/).