let flag = false;
let answerKey;
let verbose = false;

function print(obj, force=false) {if (verbose || force) console.log(obj);}

let shop = {
    money_per_question: [5, 10, 100, 1000, 10000, 75000, 300000, 1000000, 10000000, 100000000],
    streak: [20, 200, 2000, 20000, 200000, 2000000, 20000000, 20000000, 20000000],
    multiplier: [50, 300, 2000, 12000, 85000, 700000, 6500000, 65000000, 1000000000],

    money_per_question_index: 0,
    steak_index: 0,
    multiplier_index: 0
};

function buy(type) {
    let shopButton = document.getElementsByTagName("span")[4].firstChild;
    shopButton.click();

    setTimeout(function () {
        let sections = document.getElementsByClassName("cejaEX");
        let index = Object.keys(shop).indexOf(type);
        let section = sections[index];
        section.click();
        setTimeout(function () {
            let purchases = document.querySelectorAll('div[style*="color: green"]');
            let mostExpensive = purchases[purchases.length -1];
            mostExpensive.parentElement.parentElement.parentElement.parentElement.click();
            print(mostExpensive);
            let newIndex = parseInt(mostExpensive.parentElement.childNodes[1].textContent.slice(-1)[0]) - 1;
            if (newIndex < 0) newIndex = null;
            print(newIndexw);
            shop[type + "_index"] = newIndex;
            setTimeout(entry(), 300)
        }, 300)
    }, 300)
}


function checkShop() {
    let shopped = false;

    let moneyElem = document.getElementsByTagName('button')[0].parentElement.getElementsByTagName('div')[1].childNodes[1].firstChild.firstChild;
    let money = parseInt(moneyElem.textContent.slice(1, -1).replace(",", ""));
    print(money);
    if (shop.money_per_question_index === null || money > shop.money_per_question[shop.money_per_question_index]) {
        shopped = true;
        buy("money_per_question", money);
    }


    return shopped;
}


function answerQuestion(data) {
    let spans = document.getElementsByTagName("span");
    let imgs = document.getElementsByTagName("img");
    let prompt = spans.length === 6 ? spans[4].textContent : imgs[0].src;
    let answerSection = document.getElementsByTagName('input')[0];
    let answer = data[prompt];
    print(prompt);
    print(answer);
    if (answer !== undefined) {
        answerSection.value = "";
        answerSection.focus();
        document.execCommand('insertText', false, answer);

        let button = answerSection.parentElement.parentElement.getElementsByTagName('div')[0];
        button.click();

        setTimeout(function () {
            // let shopped = checkShop();
            let shopped = false;

            if (!shopped) {
                let continueButton = document.getElementsByTagName("span")[5].firstChild;
                print(continueButton);
                continueButton.click();

                if (flag) {
                    setTimeout(function () {
                        answerQuestion(data)
                    }, 800)
                }
            }
        }, 500);

    }
}


function entry() {
    chrome.storage.local.get("GimkitAnswers", function (items) {
        let answerKey = items["GimkitAnswers"];
        print(answerKey, true);
        answerQuestion(answerKey);
    });
    // answerQuestion(answerKey);
}


function setData() {  // this doesn't work
    let url = document.URL;
    print(url);
    let baseURL = "https://www.gimkit.com/live/";
    let a = url.slice(baseURL.length, url.lastIndexOf("/"));
    let class_ = url.slice(url.lastIndexOf("/") + 1, url.length - 1);

    let root = "https://www.gimkit.com/playInfo?";
    let fullURL = root + "a=" + a + "&class=" + class_;
    print(fullURL);
    fetch(fullURL).then(result =>
        reformat(result.json())
    )
}

async function reformat(json) {
    let data = await json;
    console.log(data);
    let questions = data.gameData.questions;
    let formatted = {placeholder: "test"};
    for(let index in questions) {
        let question = questions[index];
        // console.log(question);
        let key = question.text.length > 0 ? question.text : question.image;
        // console.log(question.answers);
        let answer = question.answers[0].text;
        // console.log(key + ", " + answer);
        // console.log(formatted);
        formatted[key] = answer;
    }
    console.log(formatted);
    answerKey = formatted;
}


document.addEventListener("keyup", (e) => {
    // alert(e.code);
    if (e.code == "AltRight") {
        if (flag) {
            flag = false;
        }
        else {
            flag = true;
            entry()
        }
    }
});
// setData();