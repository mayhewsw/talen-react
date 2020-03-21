# TALEN w/ React

This is a modern rewrite of [TALEN: a Tool for Annotation of Low-resource ENtities](https://github.com/cogcomp/talen).

## Requirements
* npm
* python 3.6+
* flask

The client-login was inspired by: https://github.com/cornflourblue/react-redux-registration-login-example

## Installation

TODO: write this part.

```bash
$ cd client
$ npm install
```

## Running

You will need to start the python server:
```bash
$ cd server
$ python init_db.py  # only the first time
$ python server.py
```

And you will need to start the npm server:

```bash
$ cd client
$ npm start
```

## Authorization and Sessions

This uses JWT for user authentication. The client asks the server for a JWT by giving a username and password. If this succeeds, the token is stored in the browser (`localStorage`) until it expires (5 minutes is the default). All further requests to the server require knowledge of the JWT.

The client checks if the user is logged in by retrieving a variable from `localStorage` called `user`. This variable can be spoofed, of course, but without the proper JWT, no information can be accessed.

What about sessions?

### What is flask-login used for?

If you use flask-jwt, then you pass `authenticate` and `identity` functions. These could load a User object from a database, and check passwords, etc. This was formerly the job of flask-login. Similarly, eah library has a decorator that goes before functions that require a login. 

One thing that I want is knowledge of the current user. Could this be stored in the session?

The internet seems to suggest that flask-login and flask-jwt are separate methods, and that flask-jwt is used for mobile applications while flask-login is nice for web applications.

Oon eproblem with flask-login is that it doesn't stay logged in between page reloads. If I login (fine) then switch to another site (bbc.com), then come back, I'm logged out again. What's going on? I can see that some cookies have been saved. This even happens if I refresh the page.

What happens is that the `App.tsx` makes a `GET` call to `/api/me` via `/utils/login.tsx`. The only identifying information is in `withCredentials: True` in the `Axios` call. This should return whether or not the current user is logged in.

My guess is that when you log in, using the `/api/login` route, some cookie is set (is it specific to a particular host? For example, a browser or an application). Then when you hit the `/api/me` route, it checks that cookie. 

Perhaps the issue is a cross-domain issue. Consider setting the `REMEMBER_COOKIE_DOMAIN` to `*`

https://stackoverflow.com/questions/47666210/cookies-not-saved-in-the-browser

OK -- here's the deal. This feels like a massive waste of time. I can't figure out how to get the cookies to save correclty in the browser. I think this means that flask-login is not the right way to go for React. I'm going to move ahead with JWT tokens because this seems so much more straightforward. How frustrating.

## Citation

If you use this in your research paper, please cite us!

```
@inproceedings{talen2018,
    author = {Stephen Mayhew, Dan Roth},
    title = {TALEN: Tool for Annotation of Low-resource ENtities},
    booktitle = {ACL System Demonstrations},
    year = {2018},
}
```

Read the paper here: [http://cogcomp.org/papers/MayhewRo18.pdf](http://cogcomp.org/papers/MayhewRo18.pdf) 