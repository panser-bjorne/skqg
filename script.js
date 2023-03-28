var startDateInput = document.getElementById("startdate");
var endDateInput = document.getElementById("enddate");
var intervalInput = document.getElementById("interval");
var queryStringInput = document.getElementById("querystring");
var outputTextArea = document.getElementById("output");
var submitButton = document.getElementById("submit-button");
var clearButton = document.getElementById("clear-button");
var terminalOutput = document.getElementById("terminal");
var earliestDate = new Date(2008, 7, 1);
window.addEventListener("load", clearFields);
clearButton.addEventListener("click", clearFields);
submitButton.addEventListener("click", genQueries);
function genQueries() {
    outputTextArea.value = "";
    if (!doValidate()) {
        return;
    }
    var start = textToDate(startDateInput.value);
    var end = textToDate(endDateInput.value);
    var interval = Number(intervalInput.value);
    var query = queryStringInput.value;
    var current = start;
    var counter = 0;
    var _loop_1 = function () {
        var currentStart = dateToText(current);
        var nextDate = new Date(current.getTime() + interval * 24 * 60 * 60 * 1000);
        var currentEnd = dateToText(nextDate);
        if (nextDate > end) {
            currentEnd = dateToText(end);
        }
        var arr = query.split(", ");
        arr.forEach(function (element) {
            outputTextArea.value += "".concat(element, " date:").concat(currentStart, "..").concat(currentEnd, "\n");
            counter++;
        });
        current.setDate(current.getDate() + interval);
    };
    while (current < end) {
        _loop_1();
    }
    postTerminal("Successfully generated ".concat(counter, " queries."), false);
}
function doValidate() {
    var start = textToDate(startDateInput.value);
    var end = textToDate(endDateInput.value);
    var interval = Number(intervalInput.value);
    var query = queryStringInput.value;
    if (start >= end) {
        postTerminal("Start date must be before end date!", true);
        return false;
    }
    if (interval < 1) {
        postTerminal("Interval must be at least 1!", true);
        return false;
    }
    if (query.length < 1) {
        postTerminal("No query is set!", true);
        return false;
    }
    return true;
}
function clearFields() {
    startDateInput.value = "2008-08-20";
    endDateInput.value = dateToText(new Date(new Date().getTime() + 86400000));
    intervalInput.value = "30";
    queryStringInput.value = "";
    outputTextArea.value = "";
    postTerminal("", false);
}
function dateToText(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return "".concat(year, "-").concat(month, "-").concat(day);
}
function textToDate(dateStr) {
    var _a = dateStr.split("-"), yearStr = _a[0], monthStr = _a[1], dayStr = _a[2];
    if (!/^\d+$/.test(yearStr) || !/^\d+$/.test(monthStr) || !/^\d+$/.test(dayStr)) {
        postTerminal("Invalid date!", true);
        throw new Error("Invalid date!");
    }
    var year = parseInt(yearStr);
    var month = parseInt(monthStr) - 1;
    var day = parseInt(dayStr);
    var date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
        postTerminal("Invalid date!", true);
        throw new Error("Invalid date!");
    }
    if (date < earliestDate) {
        date = earliestDate;
    }
    return date;
}
function postTerminal(text, error) {
    terminalOutput.value = error ? "ERROR: " + text : text;
    terminalOutput.style.color = error ? "red" : outputTextArea.style.color;
}
//# sourceMappingURL=script.js.map