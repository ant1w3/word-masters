let count = 0;
let guess = "";
let running = "";
let wordOfTheDay;
let isLoading = true;

const letters = document.querySelectorAll(".letter");
const spinner = document.querySelector(".spinner");

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function handleDelete() {
  guess = guess.slice(0, -1);
  letters[guess.length + running.length].innerHTML = "";
}

function handleLetter(key) {
  if (guess.length === 5) {
    guess = guess.slice(0, -1) + key;
    letters[guess.length - 1 + running.length].innerHTML = key;

    // console.log("if guess:", guess);
  } else {
    guess += key;
    letters[guess.length - 1 + running.length].innerHTML = key;

    // console.log("else guess:", guess);
  }
}

async function handleEnter() {
  console.log(wordOfTheDay);
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: guess }),
  });

  const validation = await res.json();

  if (validation.validWord) {
    running = guess + running;
    guess = "";

    // grey background on all boxes
    // yellow background if one or more letter in wrong place
    // green if one or more letter in right place
  } else {
    //flash boxes in red
    // continue typing
    return;
  }
}

async function getWordOfTheDay() {
  //   isLoading = true;
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const obj = await res.json();

  isLoading = false;
  spinner.classList.add("hidden");

  wordOfTheDay = obj.word.toUpperCase();
}

getWordOfTheDay();

addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "Enter" && guess.length === 5) {
    handleEnter();
  }

  if (key === "Backspace") {
    handleDelete();
  }

  if (isLetter(key)) {
    handleLetter(key.toUpperCase());
  }
});

document
  .querySelector(".click")
  .addEventListener("click", () => spinner.classList.add("hidden"));
