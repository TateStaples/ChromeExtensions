let fullText = document.getElementsByClassName("chapter-content")[0].innerText;
let globalVoiceLocation = 0;
let voiceLocation = 0;
let textLen = 1000;
let text = fullText.substr(0, textLen);
let paused = false;
let speech = undefined;

window.speechSynthesis.cancel();

window.utterances = [];

function pause() {paused=true; speechSynthesis.pause()}
function resume() {paused=false; speechSynthesis.resume()}


let resetInterval = function () {
    if (speech !== undefined && !paused) {
        pause();
        resume();
    }
};

setInterval(resetInterval, 10000);


function speak(rate=2, voice=null){
    console.log(text);
    speech = new SpeechSynthesisUtterance(text);
    speech.rate = rate;
    if (voice !== null) speech.voice = voice;
    speech.volume = 0.8;
    // speech.lang = "en-GB";
    // speech.pitch = 1.1;
    speech.onend = function () {
        console.log("done section");
        if (fullText.length - fullText.indexOf(text) < textLen) {
            let arrow = document.getElementsByClassName("fa-chevron-double-right")[0];
            let button = arrow.parentElement;
            button.href = button.href.concat("?speak##" + speech.rate.toString());
            button.click()
        }
        else {
            globalVoiceLocation += textLen;
            text = fullText.substr(globalVoiceLocation, textLen)
            speak(speech.rate)
        }
    };
    speech.onboundary = function (event) {
        console.log(event);
        voiceLocation = event.charIndex;
        console.log(voiceLocation);
        console.log("triggered");
        if (voiceLocation > textLen-100) resetInterval()
    };
    // speech.addEventListener("start", function (e) {console.log(e);});
    // speech.addEventListener("error", function (e) {console.log(e);});
    // speech.addEventListener("mark", function (e) {console.log(e);});
    // speech.addEventListener("pause", function (e) {console.log(e);});
    // speech.addEventListener("resume", function (e) {console.log(e);});
    // speech.addEventListener("end", function (e) {console.log(e);});
    speech.addEventListener("boundary", function (e) {console.log(e);});
    utterances.push(speech);
    speechSynthesis.speak(speech);
    // setInterval(window.speechSynthesis.resume, 100);
}


function reset() {
    console.log("reset");
    speech.onend = function(){};
    speechSynthesis.cancel();
    globalVoiceLocation += voiceLocation;
    text = fullText.substr(globalVoiceLocation, textLen);
}


document.addEventListener("keyup", (e) => {
    if (false && speech !== undefined) {
        console.log(speech.rate);
        console.log(speech);
        console.log(voiceLocation);

    }
    console.log(speech);
    if (e.code === "Space") {
        if (speech === undefined || !speechSynthesis.speaking) speak();
        else {
            if (paused) resume();
            else pause();
            console.log(speechSynthesis);
        }
    }
    if (e.code === "KeyR") {
        reset()
        speak()
    }
    else if (speech === undefined) {}
    else if (e.code === "KeyD") {
        reset();
        speak(speech.rate + 0.5);
    }
    else if (e.code === "KeyA") {
        if (speech.rate > 0.5) {
            reset();
            speak(speech.rate - 0.5);
        }
    }
    else if (e.code === "KeyW") {
        globalVoiceLocation += 1000;
        reset();
        speak(speech.rate);
    }
    else if (e.code === "KeyS") {
        globalVoiceLocation -= 1000;
        reset();
        speak(speech.rate);
    }
});


if (document.URL.includes("?speak")) {
    let url = document.URL;
    let strRate = url.slice(url.indexOf('##') + 2, url.length);
    let r = parseFloat(strRate);
    speak();
}
