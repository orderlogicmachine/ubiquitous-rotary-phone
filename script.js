const wordLength = 5;
const keyboard = document.querySelector("[data-keyboard]");
const gameGrid = document.querySelector("[data-gameGrid]");
let dictionary;
let answers;

fetch("wordList.json")
  .then(response => response.json())
  .then(data =>
  {
    dictionary = data.dictionary;
    answers = data.answers;
    console.log(dictionary)
    console.log(answers)
    const dayZero = new Date("January 1, 2022");
    const msOffset = Date.now() - dayZero;
    const dayOffset = (msOffset / 86400000);
    const targetWord = answers[Math.floor(dayOffset)];
    console.log(targetWord);
  })

// remember to remove these
console.log(keyboard);
console.log(gameGrid);
console.log(targetWord);

gameStart();

function gameStart()
{
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("press", handleKeyPress);
}

function gameStop()
{
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("press", handleKeyPress);
}

// maybe rework these into switch cases?
function handleMouseClick(letter)
{
  if (letter.target.matches("[data-letter]")) {
    pressKey(letter.target.dataset.key);
    return;
  }

  if (letter.target.matches("[data-enter]")) {
    checkGuess();
    return;
  }

  if (letter.target.matches("[data-backspace]")) {
    backspace();
    return;
  }
}

function handleKeyPress(letter)
{
  if (letter.key === "Enter") {
    checkGuess();
    return;
  }

  else if (letter.key === "Backspace" || letter.key === "Delete") {
    backspace();
    return;
  }

  else if (letter.key.match(/^[a-z]$/)) {
    pressKey(letter.key);
    return;
  }

  else {
    console.log("What a weird key!")
  }
}

function pressKey(key)
{
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= wordLength) return
  const nextTile = gameGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey()
{
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function checkGuess()
{
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== wordLength) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) =>
  {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess)
{
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() =>
  {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () =>
    {
      tile.classList.remove("flip")
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct"
        key.classList.add("correct")
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location"
        key.classList.add("wrong-location")
      } else {
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () =>
          {
            gameStart()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles()
{
  return gameGrid.querySelectorAll('[data-state="active"]')
}

function checkWinLose(guess, tiles)
{
  if (guess === targetWord) {
    // showAlert("You Win", 5000)
    // danceTiles(tiles)
    stopInteraction()
    return
  }

  const remainingTiles = gameGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    // showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}