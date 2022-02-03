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
 

