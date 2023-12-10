console.log("popup");
alert("test");

chrome.storage.local.get("GimkitAnswers", function (items) {
    eventLoop(items["GimkitAnswers"]);
});