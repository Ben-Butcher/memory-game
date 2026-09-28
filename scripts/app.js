import flowerImgs from "./data.js";

const root = document.getElementById("root");
const gameBoard = createGameBoard();

root.append(gameBoard);

function createGameBoard() {
  const gameBoardEl = document.createElement("div");
  gameBoardEl.classList.add("game-board-container");

  flowerImgs.forEach((flower) => {
    const square = createSqure(flower.imgSrc, flower.altText);
    gameBoardEl.append(square);
  });
  flowerImgs.forEach((flower) => {
    const square = createSqure(flower.imgSrc, flower.altText);
    gameBoardEl.append(square);
  });

  return gameBoardEl;
}

function createSqure(imgSrc, altText) {
  const squareEl = document.createElement("div");
  const imgEl = document.createElement("img");

  imgEl.src = imgSrc;
  imgEl.setAttribute("alt", altText);

  squareEl.appendChild(imgEl);
  squareEl.classList.add("square");

  return squareEl;
}
