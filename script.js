const wordLength = 5;
const keyboard = document.querySelector("[data-keyboard]");
const gameGrid = document.querySelector("[data-gameGrid]");

// remember to remove these
console.log(keyboard);
console.log(gameGrid);

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
    guess();
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
    guess();
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

function getActiveTiles()
{
  return gameGrid.querySelectorAll('[data-state="active"]')
}
