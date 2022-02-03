const canvas = document.querySelector('#game-board');
const ctx = canvas.getContext('2d');
const scoreBoard = document.querySelector('#score span');
const highScore = document.querySelector('#high-score span');
const savedScore = JSON.parse(localStorage.getItem('scoreLocalStorage'));
 
const FRAMES_PER_SECOND = 10;
const GRID_SIZE = 20;
 
let snakePosX = 200;
let snakePosY = 200;
let gameOver = true;
let score = 0
 
let scoreLocalStorage = {
   lastRoundScore: 0,
   highScore: 0,
};
 
let apple = {
   x: 0,
   y: 0
}
 
class SnakeBodySegment {
   constructor(bodyPosX, bodyPosY, GRID_SIZE) {
       this.bodyPosX = bodyPosX;
       this.bodyPosY = bodyPosY;
       this.width = GRID_SIZE;
       this.height = GRID_SIZE;
   }
}
 
let snakeBody = [];
 
let snake = {
   directionX: 0,
   directionY: 0,
   speed: 20,
   length: 5
}
 
function drawGameBoard() {
    for (let i = 0; i < canvas.height / GRID_SIZE; i++) {
        for (let j = 0; j < canvas.width / GRID_SIZE; j++) {
            if (i % 2 === 0) {
                if (j % 2 === 1) {
                    ctx.fillStyle = 'rgb(223, 22, 230)';
                    ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
                } else {
                    ctx.fillStyle = 'rgb(223, 22, 230)';
                    ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
                }
            } else if (i % 2 === 1) {
                if (j % 2 === 0) {
                    ctx.fillStyle = 'rgb(223, 22, 230)';
                    ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
                } else {
                    ctx.fillStyle = 'rgb(223, 22, 230)';
                    ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
                }
            }
        }
    }
}


function drawGameOver() {
    ctx.fillStyle = 'rgba(223, 22, 230)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgb(223, 22, 230)';
    ctx.lineWidth = 10;
    ctx.strokeRect(GRID_SIZE, GRID_SIZE, canvas.width - (GRID_SIZE * 2), canvas.height - (GRID_SIZE * 2));
    ctx.fillStyle = 'rgb(230, 230, 230)';
    ctx.font = '100px VT323';
    ctx.fillText('Game Over', 117, canvas.height * .3);
    ctx.font = '36px VT323';
    ctx.fillText('     Press Enter to start', 55, canvas.height * .45);
    ctx.font = '24px VT323';
    ctx.fillText('* Use Arrow keys to control Snake *', 132, canvas.height * .63);
    ctx.fillText('* Collect Orange to score points *', 137, canvas.height * .7);
    ctx.fillStyle = 'red';
    ctx.font = '24px VT323';
    ctx.fillText('<-- Avoid hitting the edges or your own tail! -->', 65, canvas.height * .8);
}
 
function buildBody() {
    const snakeSegment = new SnakeBodySegment(snakePosX, snakePosY, GRID_SIZE);
    return snakeBody.unshift(snakeSegment);
}
 
function drawBody() {
    buildBody();
    snakeBody.forEach((elem) => {
        ctx.fillStyle = 'rgb(6,9,60,255)';
        ctx.fillRect(elem.bodyPosX, elem.bodyPosY, elem.width, elem.height);
        ctx.strokeStyle = 'rgb(6,9,60,255)';
        ctx.lineWidth = 1;
        ctx.strokeRect(elem.bodyPosX, elem.bodyPosY, elem.width, elem.height);
    });
    if (snakeBody.length > snake.length)
        snakeBody.pop();
}
 
function drawHead() {
    if (snakePosX % GRID_SIZE === 0 && snakePosY % GRID_SIZE === 0) {
        getDirection();
    }
    ctx.fillStyle = 'rgb(6,9,60,255)';
    ctx.fillRect(snakePosX += (snake.speed * snake.directionX),
        snakePosY += (snake.speed * snake.directionY),
        GRID_SIZE,
        GRID_SIZE);
    ctx.strokeStyle = 'rgb(6,9,60,255)';
    ctx.lineWidth = 1;
    ctx.strokeRect(snakePosX, snakePosY, GRID_SIZE, GRID_SIZE);
}
 
function getDirection() {
    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'ArrowUp':
                snake.directionX = 0;
                if (snake.directionY === 1) {
                    return;
                } else
                    snake.directionY = -1;
                break;
            case 'ArrowDown':
                snake.directionX = 0;
                if (snake.directionY === -1) {
                    return;
                } else
                    snake.directionY = 1;
                break;
            case 'ArrowLeft':
                snake.directionY = 0;
                if (snake.directionX === 1) {
                    return;
                } else
                    snake.directionX = -1;
                break;
            case 'ArrowRight':
                snake.directionY = 0;
                if (snake.directionX === -1) {
                    return;
                } else
                    snake.directionX = 1;
                break;
            default:
                console.log('Ignored');
                break;
        }
    });
}
 
function drawApple() {
    snakeBody.forEach(({ bodyPosX, bodyPosY }) => {
        if (apple.x === bodyPosX && apple.y === bodyPosY) {
            getRandomApplePos();
        } else {
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.arc(apple.x + (GRID_SIZE / 2), apple.y + (GRID_SIZE / 2), GRID_SIZE / 2, 0, 2 * Math.PI, true);
            ctx.stroke();
            ctx.fill();
        }
    });
}
 
function getRandomApplePos() {
    apple.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * (GRID_SIZE);
    apple.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * (GRID_SIZE);
    if (apple.x < GRID_SIZE || apple.x === (canvas.width - GRID_SIZE) || apple.y < GRID_SIZE || apple.y === (canvas.height - GRID_SIZE)) {
        getRandomApplePos();
    }
}
 
function boundaryCheck() {
    if (snakePosX < 0 || snakePosX === canvas.width) {
        gameOver = true;
    }
    if (snakePosY < 0 || snakePosY === canvas.height) {
        gameOver = true;
    }
}
 
function appleCheck() {
    if (snakePosX === apple.x && snakePosY === apple.y) {
        getRandomApplePos();
        snake.length += 1;
        score++;
        scoreBoard.textContent = `SCORE: ${score}`;
    }
}
 
function bodyCheck() {
    snakeBody.forEach(({ bodyPosX, bodyPosY }) => {
        if (snake.directionX === 0 && snake.directionY === 0) {
            return;
        } else if (snakePosY === bodyPosY && snakePosX === bodyPosX) {
            gameOver = true;
        }
    });
}
 
function createLocalStorage() {
    if (savedScore === null) {
        localStorage.setItem('scoreLocalStorage', JSON.stringify(scoreLocalStorage));
        document.location.reload();
    }
}
 
function displayLastRoundScore() {
    scoreBoard.textContent = `SCORE: ${savedScore.lastRoundScore}`;
    highScore.textContent = `HIGH SCORE: ${savedScore.highScore}`;
}
 
function checkGameOver() {
    if (gameOver) {
        scoreLocalStorage.lastRoundScore = score;
        scoreLocalStorage.highScore = savedScore.highScore;
        if (scoreLocalStorage.lastRoundScore > scoreLocalStorage.highScore) {
            scoreLocalStorage.highScore = scoreLocalStorage.lastRoundScore;
            localStorage.setItem('scoreLocalStorage', JSON.stringify(scoreLocalStorage));
        }
        localStorage.setItem('scoreLocalStorage', JSON.stringify(scoreLocalStorage));
        document.location.reload();
    }
}
 
window.addEventListener('keydown', (e) => {
   if (gameOver && (e.code) === "Enter") {
       gameOver = false;
       playGame();
       score = 0;
   }
});
 
function playGame() {
    setInterval(function () {
        drawGameBoard();
        drawApple();
        drawBody();
        drawHead();
        boundaryCheck();
        appleCheck();
        bodyCheck();
        checkGameOver();
    }, 1000 / FRAMES_PER_SECOND);
    getRandomApplePos();
}
 
window.onload = () => {
   createLocalStorage();
   drawGameBoard();
   drawGameOver();
   displayLastRoundScore();
}

