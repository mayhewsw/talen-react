# TALEN w/ React

This is a rewrite of [TALEN: a Tool for Annotation of Low-resource ENtities](https://github.com/cogcomp/talen) using [React.js](https://reactjs.org/) and a python backend.

This software was designed for annotating Named Entity Recognition (NER), but can be used for any token-level sequence annotation task.


Check out a demo here: [annotate.universalner.org](https://annotate.universalner.org/).

## Quickstart

### Requirements

- [npm](https://www.npmjs.com/get-npm)
- python 3.6+
- MongoDB 5.0+ (or use mongomock for testing)

### Installation

The code is separated into two folders: `client/`, which holds the frontend, and `server/`, which holds the backend.
Each folder has its own README file with more details.

**Install MongoDB:**

```bash
brew update
brew install mongodb-community@5.0
brew services start mongodb-community@5.0
```

**Install the backend:**

```bash
cd server
python -m venv venv  # virtual env optional but recommended
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

**Install the frontend:**

```bash
cd client
npm install
cd ..
```

### Running

**Start the backend server:**

```bash
cd server
python app.py
```

The server runs on port 8080 by default. No environment variables are required for local development - SECRET_KEY and MongoDB connection are auto-configured.

**Option 1: Development mode (hot reload)**

Start the React dev server in a new terminal:

```bash
cd client
npm start
```

Visit `http://localhost:3000` in your browser. The frontend will proxy API requests to the backend at `http://localhost:8080` (configured in `client/.env`).

**Option 2: Production build**

Compile the React code into static files:

```bash
cd client
npm run build
```

This creates `client/build` containing static files. Then visit `http://localhost:8080/` with the backend server running.

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

## Downloading to BIO format

Run:
```
$ python -m scripts.download_data_to_bio --environment prod --dataset-name sv_pud-ud-test
```

Replace `sv_pud-ud-test` with any dataset you choose. This will download to a single file, and only 
needs read-only privileges on the Mongo DB.  

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

You can read the paper here: [http://cogcomp.org/papers/MayhewRo18.pdf](http://cogcomp.org/papers/MayhewRo18.pdf)
