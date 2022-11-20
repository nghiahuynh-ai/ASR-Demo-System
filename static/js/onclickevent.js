let recorder;

function toggle(element) {
    if (element.innerHTML == 'Record') {
        element.style.backgroundColor = 'red';
        element.innerHTML = 'Stop'
        
        
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            chunks.push(e.data);
            if (recorder.state == 'inactive') {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                createAudioElement(URL.createObjectURL(blob));
            }
        };
        recorder.start(0);
        }).catch(console.error);
    }
    else {
        element.style.backgroundColor = '#008CBA';
        element.innerHTML = 'Record'
        recorder.stop()
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