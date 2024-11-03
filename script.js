const boardElement = document.getElementById('board');
const rollButton = document.getElementById('roll-button');
const messageElement = document.getElementById('message');
const playerPosElement = document.getElementById('player-pos');
const aiPosElement = document.getElementById('ai-pos');

let playerPosition = 0;
let aiPosition = 0;

const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
};

const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
};

function createBoard() {
    for (let i = 100; i >= 1; i--) {
        const square = document.createElement('div');
        square.className = 'square';
        square.innerText = i;
        boardElement.appendChild(square);
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function updatePosition(position, roll) {
    position += roll;
    if (position > 100) return position; // Can't move beyond 100
    position = snakes[position] || ladders[position] || position; // Check for snakes or ladders
    return position;
}

function checkWin(position, player) {
    if (position === 100) {
        messageElement.innerText = `${player} Wins!`;
        rollButton.disabled = true;
        return true;
    }
    return false;
}

rollButton.addEventListener('click', () => {
    const playerRoll = rollDice();
    playerPosition = updatePosition(playerPosition, playerRoll);
    playerPosElement.innerText = playerPosition;
    if (!checkWin(playerPosition, 'Player')) {
        const aiRoll = rollDice();
        aiPosition = updatePosition(aiPosition, aiRoll);
        aiPosElement.innerText = aiPosition;
        checkWin(aiPosition, 'AI');
    }
});

createBoard();
