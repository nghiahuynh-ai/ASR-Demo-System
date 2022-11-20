let recorder;
let chunks;

function toggle(element) {
    if (element.innerHTML == 'Record') {
        element.style.backgroundColor = 'red';
        element.innerHTML = 'Stop';
        
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            chunks.push(e.data);
        };
        recorder.start(0);
        }).catch(console.error);
    }
    else {
        element.style.backgroundColor = '#008CBA';
        element.innerHTML = 'Record'
        recorder.stop()
        let file = new File(chunks, 'mysound.wav', {type: 'audio/wav'});
        const formData = new FormData();
        formData.append('file', file);
        axios({
            method: "post",
            url: "http://127.0.0.1:5000/",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(function (response) {
                console.log(response);
                const resultElement = document.getElementById('result');
                resultElement.innerHTML = response.data.cfm.transcript
            })
            .catch(function (response) {
              console.log(response);
            });
    }
}

function createAudioElement(blobUrl) {
    const downloadEl = document.createElement('a');
    downloadEl.style = 'display: block';
    downloadEl.innerHTML = 'download';
    downloadEl.download = 'audio.wav';
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/wav';
    audioEl.appendChild(sourceEl);
    document.body.appendChild(audioEl);
    document.body.appendChild(downloadEl);
}
