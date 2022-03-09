const wordLength = 5;
const keyboard = document.querySelector("[data-keyboard]");
const gameGrid = document.querySelector("[data-gameGrid]");

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
