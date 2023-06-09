const startDateInput = document.getElementById("startdate") as HTMLInputElement;
const endDateInput = document.getElementById("enddate") as HTMLInputElement;
const intervalInput = document.getElementById("interval") as HTMLInputElement;
const queryStringInput = document.getElementById("querystring") as HTMLInputElement;
const outputTextArea = document.getElementById("output") as HTMLTextAreaElement;
const submitButton = document.getElementById("submit-button") as HTMLButtonElement;
const clearButton = document.getElementById("clear-button") as HTMLButtonElement;
const terminalOutput = document.getElementById("terminal") as HTMLInputElement;
const earliestDate = new Date(2008, 7, 20);

window.addEventListener("load", clearFields);
clearButton.addEventListener("click", clearFields);
submitButton.addEventListener("click", genQueries);

function genQueries(): void {
    outputTextArea.value = "";

    if(!doValidate()){
        return;
    }

    const start: Date = textToDate(startDateInput.value);
    const end: Date = textToDate(endDateInput.value);
    const interval: number = Number(intervalInput.value);
    const query = queryStringInput.value;

    let current: Date = start;
    let counter: number = 0;

    while (current < end) {
        let currentStart: string = dateToText(current);
        let nextDate: Date = new Date(current.getTime() + interval * 24 * 60 * 60 * 1000);
        let currentEnd: string = dateToText(nextDate);

        if (nextDate > end) {
            currentEnd = dateToText(end);
        }

        const arr = query.split(", ");

        arr.forEach((element) => {
            outputTextArea.value += `${element} date:${currentStart}..${currentEnd}\n`;
            counter++;
        })

        current.setDate(current.getDate() + interval);
    }

    postTerminal(`Successfully generated ${counter} queries.`, false);
}

function doValidate(): boolean {
    const start: Date = textToDate(startDateInput.value);
    const end: Date = textToDate(endDateInput.value);
    const interval: number = Number(intervalInput.value);
    const query: string = queryStringInput.value;

    if(start >= end)
    {
        postTerminal("Start date must be before end date!", true);
        return false;
    }

    if(interval < 1)
    {
        postTerminal("Interval must be at least 1!", true);
        return false;
    }

    if(query.length < 1)
    {
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
    postTerminal("", false)
}

function dateToText(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function textToDate(dateStr: string): Date {
    const [yearStr, monthStr, dayStr] = dateStr.split("-");

    if(!/^\d+$/.test(yearStr) || !/^\d+$/.test(monthStr) || !/^\d+$/.test(dayStr))
    {
        postTerminal("Invalid date!", true);
        throw new Error("Invalid date!");
    }

    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;
    const day = parseInt(dayStr);

    let date = new Date(year, month, day);

    if (isNaN(date.getTime())) {
        postTerminal("Invalid date!", true);
        throw new Error("Invalid date!");
    }

    if(date < earliestDate)
    {
        date = earliestDate;
    }

    return date;
}

function postTerminal(text: string, error: boolean): void {
    terminalOutput.value = error ? "ERROR: " + text : text;
    terminalOutput.style.color = error ? "red" : outputTextArea.style.color;
}

//----------------------------------- background

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomGrey() {
    const shade = getRandomNumber(8, 12);
    return `rgb(${shade}%, ${shade}%, ${shade}%)`;
}

const background = document.getElementById("background");

for (let i = 0; i < 800; i++) {
    const square = document.createElement("div");
    square.style.position = "absolute";
    square.style.width = `${getRandomNumber(6, 13)}rem`;
    square.style.height = `${getRandomNumber(6, 13)}rem`;
    square.style.opacity = "0.8";
    square.style.backgroundColor = getRandomGrey();
    square.style.transform = `rotate(-${Math.floor(Math.random() * 360)}deg)`;
    square.style.animation = `rotate${getRandomNumber(1, 2)} ${getRandomNumber(20, 50)}s linear infinite`;
    square.style.transformOrigin = `${getRandomNumber(10, 90)}% ${getRandomNumber(10, 90)}%`;
    square.style.top = `${getRandomNumber(-20, 100)}%`;
    square.textContent = `\u00A0\u00A0SKQG-${getRandomNumber(1111, 9999)}`;
    square.style.color = "rgba(126, 126, 126, 0.07)";
    square.style.fontSize = "1.2rem";
    square.style.left = `${getRandomNumber(-20, 100)}%`;
    background.appendChild(square);
}

const style = document.createElement("style");
style.innerHTML = `
        @keyframes rotate1 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        #background > div {
          animation: rotate ${getRandomNumber(20, 50)}s linear infinite;
        }
@keyframes rotate2 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        #background > div {
          animation: rotate ${getRandomNumber(20, 50)}s linear infinite;
        }
      `;
document.head.appendChild(style);
