// send the page title as a chrome message

function binary(hex) {
    let bin = [];
    let str = (parseInt(hex, 16).toString(2)).padStart(8, '0');
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        // val truth =
        bin.push(char === '1');
    }
    console.log(str);
    return bin;
}


function attack(firstEnemy) {
    let hex = firstEnemy.innerText;
    let bin = binary(hex);
    console.log("attacking: " + hex);
    bin.forEach(function (val, index, arr) {
        let power = Math.pow(2, 7-index);
        let id = "missile-" + power;
        let elem = document.getElementById(id);
        let active = elem.classList.contains("hover");
        let keyNumber = (index+1).toString();
        let eventCode = keyNumber.charCodeAt(0);
        let event = new KeyboardEvent("keypress", {
            altKey: false,
            bubbles: true,
            cancelBubble: false,
            cancelable: true,
            charCode: eventCode,
            code: "Digit" + keyNumber,
            composed: true,
            ctrlKey: false,
            currentTarget: document,
            defaultPrevented: false,
            detail: 0,
            eventPhase: 3,
            isComposing: false,
            isTrusted: true,
            key: keyNumber,
            keyCode: eventCode,
            metaKey: false,
            repeat: false,
            returnValue: true,
            shiftKey: false,
        });

        if (active !== val) {
            sendableTarget.dispatchEvent(event);
        }
    })
}


function activeEnemy() {
    let enemies = document.getElementsByClassName("enemy");
    let firstEnemy = null;
    for (let i =0; i<enemies.length; i++) {
        let enemy = enemies[i];
        let attacked = enemy.classList.contains("under-attack");
        if (!attacked) {
            return enemy;
        }
    }
    return null;
}


function loop() {
    let firstEnemy = activeEnemy();
    if (firstEnemy !== null) {
        attack(firstEnemy)
}
}


let sendableTarget = document.getElementsByTagName("body")[0];

setInterval(loop, 1);


// let leftSide = document.getElementById("intro").parentElement;
// leftSide.parentElement.removeChild(leftSide);
