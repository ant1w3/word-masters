let count = 0;
let word = "";
let runningWord = "";

const letters = document.querySelectorAll(".letter");

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function handleDelete() {
  word = word.slice(0, -1);
  letters[word.length + runningWord.length].innerHTML = "";
}

function handleLetter(key) {
  if (word.length === 5) {
    word = word.slice(0, -1) + key;
    letters[word.length - 1 + runningWord.length].innerHTML = key;

    // console.log("if word:", word);
  } else {
    word += key;
    letters[word.length - 1 + runningWord.length].innerHTML = key;

    // console.log("else word:", word);
  }
}

function handleEnter() {
  console.log("word:", word);

  let valid = true;

  if (valid) {
    runningWord = word + runningWord;
    word = "";
  } else {
    // continue typing
  }
}

addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "Enter" && word.length === 5) {
    handleEnter();
  }

  if (key === "Backspace") {
    handleDelete();
  }

  if (isLetter(key)) {
    handleLetter(key);
  }
});
