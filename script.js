const wordLength = 5;
const flipDuration = 500
const danceDuration = 500
const keyboard = document.querySelector("[data-keyboard]");
const gameGrid = document.querySelector("[data-gameGrid]");
const overlay = document.querySelector("[data-overlay]");
const dayZero = new Date(2022, 0, 1)
const msOffset = Date.now() - dayZero
const daysOffset = msOffset / 86400000

// const wordOfTheDay = answers[Math.floor(daysOffset)]

// v fetch and async import test area v
// v        hard hat required         v

// let testDictionary = "";

// async function wordGetter(fileName, arrayName) 
// {
//   arrayName = await fetch(fileName);
//   return await response.json();
// }

// wordGetter("./dictionary.json", testDictionary)

// console.log(testDictionary)

// const testDictionary2 = import('./dictionary.json', {
//   assert: {
//       type: 'json'
//   }
// });

// console.log(testDictionary2)

// let dictionary;
// let answers;

// function wordBank()
// {
//   // import word list JSON
//   fetch("dictionary.json")
//     .then(response => response.json())
//     .then(data =>
//     {
//       // create array of guessable words
//       dictionary = data.dictionary;
//       // check to make sure it worked
//       console.log(dictionary)
//     })
// }

// function allenIverson()
// {
//   // import word list JSON
//   fetch("answers.json")
//     .then(response => response.json())
//     .then(data =>
//     {
//       // create array of guessable words
//       answers = data.answers;
//       // check to make sure it worked
//       console.log(answers)
//       // calculate the number of days between now and 1 Jan 2022
//       const dayZero = new Date("January 1, 2022");
//       const msOffset = Date.now() - dayZero;
//       const daysOffset = (msOffset / 86400000);
//       // use that number to generate the index value for the answers array
//       const wordOfTheDay = answers[Math.floor(daysOffset)];
//       console.log(wordOfTheDay + " inside the fetch block")
//     })
// }

// wordBank()

// console.log(wordOfTheDay + " outside the fetch block");

const answers = [];
const dictionary = [];
let wordOfTheDay = "";

console.log(answers)

const fetchJSON = async (url) => 
{
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const init = async () =>
{
  const dictionaryData = await fetchJSON('dictionary.json');
  const answerData = await fetchJSON('answers.json');
  dictionary.push(...dictionaryData.dictionary);
  answers.push(...answerData.answers);
  wordOfTheDay = answers[Math.floor(daysOffset)];
};

init().then(() =>
{
  console.log(dictionary);
  console.log(answers);
});

startRound();

function startRound()
{
  console.log("Starting round")
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
}

function endRound()
{
  console.log("Stopping round")
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
}

// maybe rework these into switch cases?
function handleMouseClick(clicked)
{
  console.log("Click detected")
  if (clicked.target.matches("[data-key]")) {
    pressKey(clicked.target.dataset.key)
    return
  }

  if (clicked.target.matches("[data-enter]")) {
    takeAGuess()
    return
  }

  if (clicked.target.matches("[data-backspace]")) {
    backspace()
    return
  }
}

function handleKeyPress(pressed)
{
  console.log("Keystroke detected")
  if (pressed.key === "Enter") {
    takeAGuess()
    return
  }

  else if (pressed.key === "Backspace" || pressed.key === "Delete") {
    backspace()
    return
  }

  else if (pressed.key.match(/^[a-z]$/)) {
    pressKey(pressed.key)
    return
  }

  else {
    console.log("What a weird key!")
  }
}

function pressKey(key)
{
  console.log("Pressing a key")
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= wordLength) return
  const nextTile = gameGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function backspace()
{
  console.log("Deleting a key")
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function takeAGuess()
{
  console.log("Taking a guess")

  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== wordLength) {
    showOverlay("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) =>
  {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess) && !answers.includes(guess)) {
    showOverlay("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  endRound()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess)
{
  console.log("Flipping tiles")
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() =>
  {
    tile.classList.add("flip")
  }, (index * flipDuration) / 2)

  tile.addEventListener(
    "transitionend",
    () =>
    {
      tile.classList.remove("flip")
      if (wordOfTheDay[index] === letter) {
        tile.dataset.state = "correct"
        key.classList.add("correct")
      } else if (wordOfTheDay.includes(letter)) {
        tile.dataset.state = "wrongSpot"
        key.classList.add("wrongSpot")
      } else {
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () =>
          {
            startRound()
            checkForWin(guess, array)
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

function showOverlay(message, duration = 1000)
{
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  overlay.prepend(alert)
  if (duration == null) return

  setTimeout(() =>
  {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () =>
    {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles)
{
  tiles.forEach(tile =>
  {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () =>
      {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}

function checkForWin(guess, tiles)
{
  if (guess === wordOfTheDay) {
    showOverlay("You Win!", 5000)
    danceTiles(tiles)
    endRound()
    return
  }

  const remainingTiles = gameGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showOverlay(wordOfTheDay.toUpperCase(), null)
    endRound()
  }
}

function danceTiles(tiles)
{
  tiles.forEach((tile, index) =>
  {
    setTimeout(() =>
    {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () =>
        {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * danceDuration) / 5)
  })
  if ("vibrate" in navigator) {
    vibrate(500);
  }
}