let classNames = document.getElementsByClassName("course-name");
let assignments = document.getElementsByClassName("assignments-link");
let jqueryLink = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";

function getClassAverage(link) {
    
}

var str = "";


for (let classIndex = 0; classIndex < classNames.length; classIndex++) {
    let _class = classNames[classIndex];
    let link = assignments[classIndex];
    let grade = getClassAverage(link);
    str += _class + ": " + grade.toString() + "\n"
}

alert(str)