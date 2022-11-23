URL = window.URL || window.webkitURL;

let gumStream;                      //stream from getUserMedia()
let rec;                            //Recorder.js object
let input;                          //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext //audio context to help us record

function toggle(element) {
    if (element.innerHTML == 'Record') {
        element.style.backgroundColor = 'red';
        element.innerHTML = 'Stop';
        
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
            audioContext = new AudioContext();
            gumStream = stream;
            input = audioContext.createMediaStreamSource(stream);
            rec = new Recorder(input,{numChannels:1})
            rec.record()
            console.log("Recording started");
    
        }).catch(console.error);
    }
    else {
        element.style.backgroundColor = '#008CBA';
        element.innerHTML = 'Record'

        rec.stop();
        gumStream.getAudioTracks()[0].stop();
        rec.exportWAV(createDownloadLink);
    }
}

function createDownloadLink(blob) {
    let xhr=new XMLHttpRequest();
        xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
        };
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("result").innerHTML =
                this.responseText;
           }
        };
          let fd=new FormData();
          fd.append("audio_data",blob, 'audio.wav');
          xhr.open("POST","/",true);
          xhr.send(fd);
}