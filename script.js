const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const playerXScoreElement = document.getElementById('scoreX');
const playerOScoreElement = document.getElementById('scoreO');
const darkModeToggle = document.getElementById('darkModeToggle');
const timerElement = document.getElementById('timer');
const body = document.body;

let circleTurn;
let playerXScore = 0;
let playerOScore = 0;
let timer;

startGame();

restartButton.addEventListener('click', startGame);

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light' : 'Dark';
});

// Reset scores and board
document.getElementById('resetScoreButton').addEventListener('click', () => {
  // Reset player scores
  playerXScore = 0;
  playerOScore = 0;
  playerXScoreElement.textContent = '0';
  playerOScoreElement.textContent = '0';

  // Clear the board
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('x', 'circle', 'winning');
    cell.textContent = ''; // Clear cell content
  });

  // Optionally, reset any game state variables
  circleTurn = false;
  setBoardHoverClass();
});

function startGame() {
  circleTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS, CIRCLE_CLASS, 'winning');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
  resetTimer();
  startTimer();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
    updateScore(circleTurn ? 'O' : 'X');
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    resetTimer();
    startTimer();
  }
}

function endGame(draw) {
  clearInterval(timer);
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS, CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  let winningCombination = null;
  const isWin = WINNING_COMBINATIONS.some(combination => {
    const win = combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
    if (win) winningCombination = combination;
    return win;
  });

  if (isWin && winningCombination) {
    winningCombination.forEach(index => {
      cellElements[index].classList.add('winning');
    });
  }

  return isWin;
}

function updateScore(winner) {
  if (winner === 'X') {
    playerXScore++;
    playerXScoreElement.textContent = playerXScore;
  } else if (winner === 'O') {
    playerOScore++;
    playerOScoreElement.textContent = playerOScore;
  }
}

// Timer functionality
function startTimer() {
  let timeLeft = 10; // 10 seconds per turn
  timerElement.textContent = `Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft === 0) {
      // Add a point to the opponent's score when the timer resets
      if (circleTurn) {
        playerXScore++;
        playerXScoreElement.textContent = playerXScore;
      } else {
        playerOScore++;
        playerOScoreElement.textContent = playerOScore;
      }

      // Reset the timer for the same player
      clearInterval(timer); // Stop the timer
      startTimer(); // Restart the timer for the same turn
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
}