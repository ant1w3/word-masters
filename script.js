let count = 0;
let guess = "";
let running = "";

const letters = document.querySelectorAll(".letter");

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
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: guess }),
  });

  const validation = await res.json();

  if (validation.validWord) {
    console.log("here");
    running = guess + running;
    guess = "";
  } else {
    // continue typing
    return;
  }
}

addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "Enter" && guess.length === 5) {
    handleEnter();
  }

  if (key === "Backspace") {
    handleDelete();
  }

  if (isLetter(key)) {
    handleLetter(key);
  }
});
