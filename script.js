// --- DOM Elements ---
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const btnPvP = document.getElementById('btn-pvp');
const btnPvC = document.getElementById('btn-pvc');

// --- Game State Variables ---
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let isPlayVsComputer = false; // False = PvP, True = PvC

// All 8 possible ways to win
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- Initialization ---
function initGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    resetBtn.addEventListener('click', restartGame);
    
    btnPvP.addEventListener('click', () => setMode(false));
    btnPvC.addEventListener('click', () => setMode(true));
    
    updateStatus();
}

// --- Mode Selection ---
function setMode(isPvC) {
    isPlayVsComputer = isPvC;
    btnPvC.classList.toggle('active', isPvC);
    btnPvP.classList.toggle('active', !isPvC);
    restartGame();
}

// --- Interaction Logic ---
function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    // Ignore click if cell is full, game is over, or it's the computer's turn
    if (board[cellIndex] !== "" || !gameActive || (isPlayVsComputer && currentPlayer === "O")) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    // If game is still active and it's computer mode, let the AI play
    if (gameActive && isPlayVsComputer && currentPlayer === "O") {
        statusText.textContent = "Computer is thinking...";
        setTimeout(computerMove, 600); // Slight delay for realism
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase()); // Adds .x or .o class for colors
}

// --- Game Flow & Win Logic ---
function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

function updateStatus() {
    if (gameActive) {
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWinner() {
    let roundWon = false;

    // Loop through all winning lines
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
        gameActive = false;
        return;
    }

    // Check for a draw
    if (!board.includes("")) {
        statusText.textContent = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    changePlayer();
}

// --- Computer Logic ---
function computerMove() {
    if (!gameActive) return;

    // Find all empty cells
    let emptyCells = [];
    board.forEach((cell, index) => {
        if (cell === "") emptyCells.push(index);
    });

    // Pick a random empty cell (Basic AI)
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const chosenCellIndex = emptyCells[randomIndex];
        
        const cellDOM = document.querySelector(`.cell[data-index="${chosenCellIndex}"]`);
        updateCell(cellDOM, chosenCellIndex);
        checkWinner();
    }
}

// --- Reset Logic ---
function restartGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
    
    updateStatus();
}

// Start the app
initGame();