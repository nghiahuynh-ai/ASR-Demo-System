from io import BytesIO
from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from flask import request
from pydub import AudioSegment
import nemo.collections.asr as asr

class Model:
    def __init__(self):
        self.__model = asr.models.EncDecRNNTModel.restore_from('static/VLSP-Baseline.nemo')
        
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
    f = request.files['audio_data'].read()
    f = BytesIO(f)
    audio = AudioSegment.from_file(f)
    audio = audio.set_frame_rate(16000)
    audio = audio.set_sample_width(2)
    audio = audio.set_channels(1)
    audio = audio.export('./dump/audio.wav', format='wav')
    
    transcript = model.transcribe('./dump/audio.wav')
    return transcript[0]

if __name__ == '__main__':
    # http://127.0.0.1:5000
    app.run(host='0.0.0.0', port=5000, debug=True)