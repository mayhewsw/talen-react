from flask import Flask
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/getsentence', methods=['GET', 'POST'])
def getsentence():
    return "this is a tokenized sentence , and it came from the server !"

@app.route('/setlabels', methods=['POST'])
def setlabels():
    data = request.get_json()
    words = data["words"]
    labels = data["labels"]
    print(words)
    print(labels)
    return "OK"


app.debug = True
app.run(port=5000)