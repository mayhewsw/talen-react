# TALEN Backend

The backend is written in python.

## Quick Start (Development/Testing)

The application is now configured to run without requiring passwords or environment variables for local development.

### Prerequisites

1. **MongoDB**: Make sure MongoDB is running locally on port 27017
   ```bash
   # On macOS with Homebrew:
   brew services start mongodb-community@5.0

   # Or run manually:
   mongod --config /usr/local/etc/mongod.conf
   ```

2. **Python Dependencies**: Install required packages
   ```bash
   cd server
   pip install -r requirements.txt
   ```

### Running Tests

Simply run pytest without any environment setup:

```bash
cd server
PYTHONPATH=. pytest
```

To run an individual test:
```bash
PYTHONPATH=. pytest -s -k "test_annotation_serialization"
```

### Running the Development Server

**1. Initialize test users** (first time only):

```bash
cd server
python scripts/init_dev_users.py
```

This creates three test users:
- `a` / `a` (admin user)
- `b` / `b` (regular user)
- `guest` / `guest` (read-only user)

**2. Start the Flask development server:**

```bash
cd server
python app.py
```

The server will:
- Auto-generate a temporary SECRET_KEY (you'll see a warning in the logs)
- Connect to MongoDB at `localhost:27017` without authentication
- Run on `http://localhost:8080`

### Environment Variables (Optional)

For production or if you want to suppress the SECRET_KEY warning:

```bash
export SECRET_KEY=your-secret-key-here
```

For remote MongoDB with authentication:
```bash
export MONGO_USERNAME=your-username
export MONGO_PASSWORD=your-password
```

**Notes:**
- The auto-generated SECRET_KEY changes on each restart, so user sessions won't persist across restarts
- For production deployments, always set a proper SECRET_KEY environment variable

## Authorization and Sessions

This uses [flask-login](https://flask-login.readthedocs.io/en/latest/).

This uses JWT for user authentication. The client asks the server for a JWT by giving a username and password. If this succeeds, the token is stored in the browser (`localStorage`) until it expires (6 hours is the default). All further requests to the server require knowledge of the JWT.

The client checks if the user is logged in by retrieving a variable from `localStorage` called `user`. This variable can be spoofed, of course, but without the proper JWT, no information can be accessed.

What about sessions?

Could we use flask_session with JWT tokens? I guess you could store stuff in the session that is keyed by the JWT token, or the user ID (probably that is a good idea).

What kinds of things do authorized users want to do? Load documents, annotate, save, check personal stats. The next thing one might do is request a dataset, then request a document. Then, they will make changes to the document and save changes to file. There is some tension between annotations "living" in the javascript (in this case, React framework) and in the filesystem. As they are annotated, they will live in the state of page. But when you leave the page, you will save to disk (as in the Java version).

## Install MongoDB

Follow instructions [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).

## Adding datasets
To add a new CONLLU dataset (as used in Universal Dependencies), run the following:

```bash
python -m scripts.conllu_to_mongo --input-file <input_file.conllu> --dataset-name <your_dataset_name> --environment $ENV
```

where `$ENV` should be either `dev` (for local development), or `prod` for using the hosted MongoDB.

For example, if you wanted to download the English Universal Dependencies data and put it into the local database, you would do the following:
```bash
git clone https://github.com/UniversalDependencies/UD_English-EWT.git
python -m scripts.conllu_to_mongo --input-file UD_English-EWT/en_ewt-ud-train.conllu --dataset-name en_ewt-ud-train --environment dev
```

## Copying annotations
If you want to copy annotations from the dev to the prod database, or vice versa, use the following:

```bash
cd server
python -m scripts.copy_annotations --dataset-name en_ewt-ud-train --source dev --target prod --user-id stephen
```

This may be useful for annotating locally (to find bugs, or to annotate offline), and then copying to the cloud database.

## Creating Default Annotations

You can use the spacy NER tagger to get starter or ("default") annotations for your dataset.

Run:
```bash
pip install spacy
python -m spacy download en_core_web_md
python -m scripts.merge_default_annotations --dataset-name <your_dataset_name> --environment $ENV
```

where `$ENV` should be either `dev` (for local development), or `prod` for using the hosted MongoDB.
