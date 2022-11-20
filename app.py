from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from flask import request
import os
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

@app.route('/infer', methods=['GET'] )
def infer():
    return 'transcribe'

if __name__ == '__main__':
    app.run(debug=True)