import flowerImgs from "./data.js";

const root = document.getElementById("root");
const movesEl = document.getElementById("moves");
const pairsFoundEl = document.getElementById("pairs-found");
const statusEl = document.getElementById("status");
const restartButton = document.getElementById("restart-game");

const gameBoard = createGameBoard();
root.replaceChildren(gameBoard);

const gameState = {
  firstCard: null,
  secondCard: null,
  lockBoard: true,
  moves: 0,
  pairsFound: 0,
  previewTimeoutId: null,
  mismatchTimeoutId: null,
};

restartButton.addEventListener("click", startGame);

startGame();

function createGameBoard() {
  const gameBoardEl = document.createElement("div");
  gameBoardEl.classList.add("game-board-container");

  return gameBoardEl;
}

function startGame() {
  clearTimeout(gameState.previewTimeoutId);
  clearTimeout(gameState.mismatchTimeoutId);

  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.lockBoard = true;
  gameState.moves = 0;
  gameState.pairsFound = 0;

  updateScoreboard();
  setStatus("Study the board while the cards are showing.");

  const shuffledDeck = shuffleDeck();

  gameBoard.classList.add("is-previewing");
  gameBoard.replaceChildren(...shuffledDeck.map(createCard));

  revealAllCards();

  gameState.previewTimeoutId = setTimeout(() => {
    hideUnmatchedCards();
    gameBoard.classList.remove("is-previewing");
    gameState.lockBoard = false;
    setStatus("Find every matching pair.");
  }, 1800);
}

function createCard({ imgSrc, altText, id }) {
  const cardEl = document.createElement("button");
  cardEl.type = "button";
  cardEl.classList.add("card");
  cardEl.dataset.pairId = String(id);
  cardEl.setAttribute("aria-label", `Card for ${altText}`);
  cardEl.addEventListener("click", handleCardClick);

  const cardInnerEl = document.createElement("span");
  cardInnerEl.classList.add("card-inner");

  const backFaceEl = document.createElement("span");
  backFaceEl.classList.add("card-face", "card-back");
  backFaceEl.setAttribute("aria-hidden", "true");

  const frontFaceEl = document.createElement("span");
  frontFaceEl.classList.add("card-face", "card-front");

  const imgEl = document.createElement("img");
  imgEl.src = imgSrc;
  imgEl.alt = altText;

  frontFaceEl.append(imgEl);
  cardInnerEl.append(backFaceEl, frontFaceEl);
  cardEl.append(cardInnerEl);

  return cardEl;
}

function shuffleDeck() {
  const duplicatedDeck = flowerImgs.flatMap((flower) => [flower, flower]);
  const deckWithStableIds = duplicatedDeck.map((flower, index) => ({
    ...flower,
    cardId: `${flower.id}-${index}`,
  }));

  let currentIndex = deckWithStableIds.length;

  while (currentIndex !== 0) {
    const randomIndex = getRandom(currentIndex);
    currentIndex -= 1;

    [deckWithStableIds[currentIndex], deckWithStableIds[randomIndex]] = [
      deckWithStableIds[randomIndex],
      deckWithStableIds[currentIndex],
    ];
  }

  return deckWithStableIds;
}

function revealAllCards() {
  gameBoard.querySelectorAll(".card").forEach((cardEl) => {
    cardEl.classList.add("is-flipped");
  });
}

function hideUnmatchedCards() {
  gameBoard.querySelectorAll(".card").forEach((cardEl) => {
    if (!cardEl.classList.contains("is-matched")) {
      cardEl.classList.remove("is-flipped");
    }
  });
}

function handleCardClick(event) {
  const cardEl = event.currentTarget;

  if (
    gameState.lockBoard ||
    cardEl.classList.contains("is-matched") ||
    cardEl.classList.contains("is-flipped")
  ) {
    return;
  }

  flipCard(cardEl, true);

  if (!gameState.firstCard) {
    gameState.firstCard = cardEl;
    return;
  }

  gameState.secondCard = cardEl;
  gameState.moves += 1;
  updateScoreboard();

  const isMatch =
    gameState.firstCard.dataset.pairId === gameState.secondCard.dataset.pairId;

  if (isMatch) {
    markCardsAsMatched(gameState.firstCard, gameState.secondCard);
    gameState.pairsFound += 1;
    updateScoreboard();
    resetTurn();

    if (gameState.pairsFound === flowerImgs.length) {
      setStatus(`You won in ${gameState.moves} moves.`);
      gameState.lockBoard = true;
      return;
    }

    setStatus("Nice match. Keep going.");
    return;
  }

  gameState.lockBoard = true;
  setStatus("Not a match. Try again.");

  gameState.mismatchTimeoutId = setTimeout(() => {
    flipCard(gameState.firstCard, false);
    flipCard(gameState.secondCard, false);
    resetTurn();
    setStatus("Try the next pair.");
  }, 850);
}

function markCardsAsMatched(firstCard, secondCard) {
  firstCard.classList.add("is-matched");
  secondCard.classList.add("is-matched");
}

function flipCard(cardEl, shouldFlip) {
  cardEl.classList.toggle("is-flipped", shouldFlip);
}

function resetTurn() {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.lockBoard = false;
}

function updateScoreboard() {
  movesEl.textContent = String(gameState.moves);
  pairsFoundEl.textContent = String(gameState.pairsFound);
}

function setStatus(message) {
  statusEl.textContent = message;
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}
