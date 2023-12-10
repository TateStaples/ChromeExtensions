var flag = false;

async function process(data) {
    if (flag) return;
    flag = true;
    let url = data.url.toString();
    console.log(url);
    fetch(url).then(result =>
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
    chrome.storage.local.set({"GimkitAnswers": formatted}, function () {})
}



console.log("scanning for gimkit");
chrome.webRequest.onBeforeRequest.addListener(process, {urls: ["https://www.gimkit.com/playInfo*"]}, ["requestBody"]);
