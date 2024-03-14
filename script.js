let count = 0;
let row = 0;
let guess = "";
let running = "";
let wordOfTheDay;
let isLoading = true;
const GUESS_LENGTH = 5;

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

  // Post the guess
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: guess }),
  });

  const validation = await res.json();

  if (validation.validWord) {
    running = guess + running;

    for (let i = 0; i < GUESS_LENGTH; i++) {
      let isTheLetterInWordOfTheDay = wordOfTheDay.indexOf(guess[i]);
      let areLettersEqual = wordOfTheDay[i] === guess[i] ? true : false;

      if (isTheLetterInWordOfTheDay === 0 && !areLettersEqual) {
        letters[i + GUESS_LENGTH * row].classList.add("yellow");
      } else if (wordOfTheDay[i] === guess[i]) {
        letters[i + GUESS_LENGTH * row].classList.add("green");
      } else {
        letters[i + GUESS_LENGTH * row].classList.add("grey");
      }
    }

    guess = "";
    row++;
  } else {
    // add a red border for invalid word
    for (let i = 0; i < GUESS_LENGTH; i++) {
      letters[i + GUESS_LENGTH * row].classList.add("red");
    }

    // remove red border after 1 sec
    setTimeout(() => {
      for (let i = 0; i < GUESS_LENGTH; i++) {
        letters[i + GUESS_LENGTH * row].classList.remove("red");
      }
    }, 1000);
  }
}

async function getWordOfTheDay() {
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const obj = await res.json();

  spinner.classList.add("hidden");

  wordOfTheDay = obj.word.toUpperCase();
}

// the the word of the day
getWordOfTheDay();

// listen events
document.addEventListener("keydown", (event) => {
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
