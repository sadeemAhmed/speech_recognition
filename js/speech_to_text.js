const startRecordBtn = document.getElementById('start-record-btn');
const stopRecordBtn = document.getElementById('stop-record-btn');
const textOutput = document.getElementById('text-output');
const status = document.getElementById('status');

let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function(event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                textOutput.value += transcript;
                saveToDatabase(transcript);
            } else {
                interimTranscript += transcript;
            }
        }
        textOutput.value += interimTranscript;
    };

    recognition.onerror = function(event) {
        status.textContent = 'Error occurred in recognition: ' + event.error;
    };
}

startRecordBtn.addEventListener('click', () => {
    recognition.start();
});

stopRecordBtn.addEventListener('click', () => {
    recognition.stop();
});

function saveToDatabase(text) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../PHP/save_text.php', true); // Path to save_text.php
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('Status: ' + xhr.status);
            console.log('Response: ' + xhr.responseText);
            if (xhr.status === 200) {
                console.log('Text saved to database');
            } else {
                console.error('Error: ', xhr.statusText);
            }
        }
    };
    console.log('Sending text: ' + text); // Log the text being sent
    xhr.send('text=' + encodeURIComponent(text));
}
