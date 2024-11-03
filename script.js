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
        square.dataset.index = i;

        if (snakes[i]) {
            square.innerHTML = `<img src="snake.png" class="snake" alt="Snake" />🐍<span>${i}</span>`;
        } else if (ladders[i]) {
            square.innerHTML = `<img src="ladder.png" class="ladder" alt="Ladder" />🪜<span>${i}</span>`;
        } else {
            square.innerText = i;
        }

        boardElement.appendChild(square);
    }
    drawConnections();
    updatePlayerOnBoard();
}

function drawConnections() {
    Object.keys(snakes).forEach(head => {
        const tail = snakes[head];
        drawLine(head, tail, 'snake');
    });

    Object.keys(ladders).forEach(bottom => {
        const top = ladders[bottom];
        drawLine(bottom, top, 'ladder');
    });
}

function drawLine(start, end, type) {
    const startSquare = document.querySelector(`.square[data-index="${start}"]`);
    const endSquare = document.querySelector(`.square[data-index="${end}"]`);

    const startRect = startSquare.getBoundingClientRect();
    const endRect = endSquare.getBoundingClientRect();

    const connection = document.createElement('div');
    connection.className = 'connection';
    const length = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) +
        Math.pow(endRect.top - startRect.top, 2)
    );

    const angle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left) * (180 / Math.PI);

    connection.style.width = `${length}px`;
    connection.style.transform = `translate(${startRect.left + 25}px, ${startRect.top + 25}px) rotate(${angle}deg)`;
    
    boardElement.appendChild(connection);
}

function updatePlayerOnBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => square.classList.remove('player', 'ai'));

    if (playerPosition > 0 && playerPosition <= 100) {
        const playerSquare = [...squares].find(square => square.dataset.index == playerPosition);
        playerSquare.classList.add('player');
    }

    if (aiPosition > 0 && aiPosition <= 100) {
        const aiSquare = [...squares].find(square => square.dataset.index == aiPosition);
        aiSquare.classList.add('ai');
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function updatePosition(position, roll) {
    const newPosition = position + roll;
    if (newPosition > 100) return position; // Stay in the same position if roll exceeds 100
    return snakes[newPosition] || ladders[newPosition] || newPosition; // Check for snakes or ladders
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
    document.getElementById('dice-number').innerText = playerRoll; // Display dice value
    playerPosition = updatePosition(playerPosition, playerRoll);
    playerPosElement.innerText = playerPosition;
    updatePlayerOnBoard(); // Update board with player position

    if (!checkWin(playerPosition, 'Player')) {
        const aiRoll = rollDice();
        aiPosition = updatePosition(aiPosition, aiRoll);
        aiPosElement.innerText = aiPosition;
        updatePlayerOnBoard(); // Update board with AI position
        checkWin(aiPosition, 'AI');
    }
});

createBoard();
