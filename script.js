let row = 0;
let guess = "";
let answer;
let isLoading = true;
const GUESS_LENGTH = 5;

const letters = document.querySelectorAll(".letter");
const spinner = document.querySelector(".spinner");

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function handleDelete() {
  guess = guess.slice(0, -1);
  letters[guess.length + row * 5].innerHTML = "";
}

function handleLetter(key) {
  if (guess.length === GUESS_LENGTH) {
    guess = guess.slice(0, -1) + key;
    letters[guess.length - 1 + row * 5].innerHTML = key;
  } else {
    guess += key;
    letters[guess.length - 1 + row * 5].innerHTML = key;
  }
}

function correctWord() {
  for (let i = 0; i < GUESS_LENGTH; i++) {
    const splittedGuess = answer.split("");
    let isCurrentLetterInAnswer = splittedGuess.includes(guess[i]);
    let areLettersEqual = guess[i] === answer[i] ? true : false;

    if (areLettersEqual) {
      letters[i + GUESS_LENGTH * row].classList.add("green");
    } else if (isCurrentLetterInAnswer && !areLettersEqual) {
      letters[i + GUESS_LENGTH * row].classList.add("yellow");
    } else {
      letters[i + GUESS_LENGTH * row].classList.add("grey");
    }
  }

  // Tell user he wins
  if (guess === answer) {
    alert("YOU WIN !!!");
    return;
  }

  guess = "";
  row++;
}

function wrongWord() {
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

async function handleEnter() {
  console.log("Word of the Day:", answer);

  // Enable spinner
  spinner.classList.remove("hidden");

  // Post the guess
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: guess }),
  });

  const { validWord } = await res.json();

  // Disable spinner
  spinner.classList.add("hidden");

  validWord ? correctWord() : wrongWord();

  // Tell user he looses
  if (row === 6 && guess != answer) {
    alert("loose");
    return;
  }
}

async function getAnswer() {
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const obj = await res.json();

  spinner.classList.add("hidden");

  answer = obj.word.toUpperCase();
  // answer = "IVORY";
}

// Get the the word of the day
getAnswer();

// Listen events
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
