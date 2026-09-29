import flowerImgs from "./data.js";

const root = document.getElementById("root");
const gameBoard = createGameBoard();
root.append(gameBoard);

function createGameBoard() {
  const gameBoardEl = document.createElement("div");
  gameBoardEl.classList.add("game-board-container");

  const squaresArr = flowerImgs.forEach((flower) => {
    return createSqure(flower);
  });

  shuffleBoard(squaresArr, gameBoardEl);
  return gameBoardEl;
}

function createSqure({ id, imgSrc, altText }) {
  const squareEl = document.createElement("div");

  const imgEl = document.createElement("img");

  imgEl.src = imgSrc;
  imgEl.setAttribute("alt", altText);

  squareEl.appendChild(imgEl);
  squareEl.classList.add("square");
  squareEl.id = id;

  return squareEl;
}

function shuffleBoard(squaresArr, gameBoard) {
  const shuffledArr = squaresArr.concat(squaresArr);

  let currentIndex = shuffledArr.length;

  while (currentIndex != 0) {
    let randomIndex = getRandom(currentIndex);
    currentIndex--;

    [shuffledArr[currentIndex], shuffledArr[randomIndex]] = [
      shuffledArr[randomIndex],
      shuffledArr[currentIndex],
    ];
  }

  shuffledArr.forEach((square) => {
    gameBoard.append(square);
  });
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}
