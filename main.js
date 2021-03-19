let synth = window.speechSynthesis;
synth.cancel();

let text = document.getElementsByClassName("chapter-content")[0].innerText;
console.log("Sample Text:" + text.substr(10, 100));

let speech = undefined;


function speak(rate=3.0) {
    console.log("speaking now");
    speech = new SpeechSynthesisUtterance(text);
    speech.rate = rate;
    speech.onend = function () {
        let arrow = document.getElementsByClassName("fa-chevron-double-right")[0];
        let button = arrow.parentElement;
        let newHref = button.href.concat("?speak##" + speech.rate.toString());
        button.href = newHref;
        button.click()
    };
    synth.speak(speech);
}


document.addEventListener("keyup", (e) => {
    if (speech !== undefined) {
        console.log(speech.rate);
    }
    if (e.code === "Space") {
        if (speech === undefined || synth.speaking === false) speak();
        else {
            console.log(synth.speaking);
            console.log(synth);
            if (synth.paused) synth.resume();
            else synth.pause();
        }
    }
    else if (e.code === "KeyD") {
        if (speech !== undefined) {
            speech.rate += 0.5
        }
    }
    else if (e.code === "KeyA") {
        if (speech !== undefined && speech.rate > 0.5) {
            speech.rate -= 0.5
        }
    }
    else if (typeof e === typeof new CustomEvent("auto")) {
        speak();
    }

});


if (document.URL.includes("?speak")) {
    let url = document.URL;
    let strRate = url.slice(url.indexOf('##') + 2, url.length);
    let r = parseFloat(strRate);
    speak(r);
}
