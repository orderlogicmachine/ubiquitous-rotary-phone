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

  if (letter.key === "Backspace" || letter.key === "Delete") {
    backspace();
    return;
  }

  if (letter.key.match(/^[a-z]$/)) {
    pressKey(letter.key);
    return;
  }
}
