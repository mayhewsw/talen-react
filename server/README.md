# TALEN Backend

The backend is written in python.

## Data Readers

See `data_readers/` for examples of dataset readers. If you have your own bespoke formatted dataset, you may want to write a reader for it.

## Database

Before running the app, you should have run `init_db.py`. To check the database in a python repl, do the following:

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

This came from [here](https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/#a-minimal-application).

## Authorization and Sessions

This uses [flask-login](https://flask-login.readthedocs.io/en/latest/).

This uses JWT for user authentication. The client asks the server for a JWT by giving a username and password. If this succeeds, the token is stored in the browser (`localStorage`) until it expires (5 minutes is the default). All further requests to the server require knowledge of the JWT.

The client checks if the user is logged in by retrieving a variable from `localStorage` called `user`. This variable can be spoofed, of course, but without the proper JWT, no information can be accessed.

What about sessions?

Could we use flask_session with JWT tokens? I guess you could store stuff in the session that is keyed by the JWT token, or the user ID (probably that is a good idea).

What kinds of things do authorized users want to do? Load documents, annotate, save, check personal stats. The next thing one might do is request a dataset, then request a document. Then, they will make changes to the document and save changes to file. There is some tension between annotations "living" in the javascript (in this case, React framework) and in the filesystem. As they are annotated, they will live in the state of page. But when you leave the page, you will save to disk (as in the Java version).

## To Test

Run:
```
$ PYTHONPATH=. pytest
```

Otherwise you will get a module not found error.

If you want to run an individual test:
```
$ PYTHONPATH=. pytest -s -k "test_annotation_serialization"
```