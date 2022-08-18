# TALEN w/ React

This is a rewrite of [TALEN: a Tool for Annotation of Low-resource ENtities](https://github.com/cogcomp/talen) using [React.js](https://reactjs.org/) and a python backend.

This software was designed for annotating Named Entity Recognition (NER), but can be used for any token-level sequence annotation task.


Check out a demo here: [mayhewsw.github.io/talen-react/](https://mayhewsw.github.io/talen-react/), or see a brief walkthrough of annotation [here](https://www.youtube.com/watch?v=LKj4b6m1hoo).

![Screenshot of web interface](/talen-screenshot.png?raw=true "Screenshot")

## Quickstart

### Requirements

- [npm](https://www.npmjs.com/get-npm)
- python 3.6+

### Installation

The code is separated into two folders: `client/`, which holds the frontend, and `server/`, which holds the backend.
Each folder has it's own README file, with more details (probably too many).
Installation and running will be done separately for each folder.

To install MongoDB:

```bash 
$ brew update
$ brew install mongodb
```

To install the backend:

```bash
$ cd server
$ python -m venv cool-environment-name  # virtual env optional but strongly recommended
$ source cool-environment-name/bin/activate
$ pip install -r requirements.txt
cd ..
```

To install the frontend:

```bash
$ cd client
$ npm install
$ cd ..
```

### Running

First, make sure that MongoDB is running locally.

```bash
$ bash start_mongo.sh
$ cd server
$ python -m scripts.mongo_stats -e dev   # check that it worked.
```

You can also check this with `check_mongo.sh`, and stop it with `stop_mongo.sh`. (These commands assume that you 
are on a Mac, and have Homebrew installed. Instructions will be different on Windows and Linux).

```bash
$ cd server
$ export ENV=dev && python app.py
```

This will default to port 8080, but you can change this by setting the `$PORT` variable.

There are two options for viewing the frontend. If you want to modify it and have it
reload automatically, start the node server (in a new terminal):

```bash
$ cd client
$ export REACT_APP_URL="http://localhost:8080" && npm run start
```

If you are ready to start annotating in earnest, compile the react code into static files and serve alongside the flask app. To do this, run (in `client/`):

```bash
$ cd client
$ npm run build
```

This will create a folder called `client/build` containing static files.
Then, with the backend server running, visit, `localhost:8080/`.

## Data

The primary method for storing data is in MongoDB.

This repo also contains some example datasets in `server/data/`, as well as corresponding dataset config files in `config/datasets/`.

### Config Files

Every .yml file in `config/datasets/` will be loaded as a config file. Each config file must contain:

- name: some string identifier
- path: path to the dataset
- reader: the Python class that will read this data. See `server/data_readers` for examples.

You may optionally include a list of labels and their colors, but by default each config file inherits the
labelset from `config/base.yml`.

### Annotating Universal Dependencies

One of the motivators for writing this software was to annotate Universal Dependencies with NER tags.

To get going with annotation, see [this file](server/README.md).

## Dockerization

To build:
```
$ ./run_docker.sh build
```

To run:
```
$ export ENV=prod   # currently, you have to run on prod
$ ./run_docker.sh run
```

Then visit `http://localhost:1337` in a browser.

## Managing users

When running the app locally, it will add a default user with username "a" and password "a". When running in production,
use the [`manage_users.py`](server/scripts/manage_users.py) script to add, update, or delete users.

## Getting Interannotator Agreement

Run:
```
$ python -m scripts.get_interannotator_agreement
```

## Deploying to Google Cloud

The repo has an Action defined in [/.github/workflows/cloud-run.yml]() that deploys to Google Cloud Run when merging to master. Notice that `MONGO_USERNAME` and `MONGO_PASSWORD` variables are stored as secrets in Google Cloud.

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
