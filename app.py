from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from flask import request
import flask
from pydub import AudioSegment
import nemo.collections.asr as asr

class Model:
    def __init__(self):
        self.__model = asr.models.EncDecRNNTModel.restore_from('static\Alignment-Mask-Word.nemo')
        
    def transcribe(self, audio_path):
        return self.__model.transcribe([audio_path])[0]
model = Model()

app = Flask(__name__)

# Apply Flask CORS
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = "static"
    
@app.route('/', methods=['GET'] )
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def get_data():
    file = request.files['file']
    
    # transcript = model.transcribe('./dump/temp.wav')

    response = flask.jsonify({'cfm': {'transcript': 'this is the transcript'}})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)