const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const statusDisplay = document.getElementById('status'); // دریافت عنصر statusDisplay از HTML

// تنظیمات بازی
const gridSize = 20;
const canvasSize = canvas.width;
const numCells = canvasSize / gridSize;

let snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let changingDirection = false;

function generateFood() {
    let foodX, foodY;
    while (true) {
        foodX = Math.floor(Math.random() * numCells) * gridSize;
        foodY = Math.floor(Math.random() * numCells) * gridSize;

        let foodOnSnake = false;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === foodX && snake[i].y === foodY) {
                foodOnSnake = true;
                break;
            }
        }
        if (!foodOnSnake) {
            break;
        }
    }
    food = { x: foodX, y: foodY };
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = '#27ae60';
    ctx.strokeStyle = '#16a085';
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function drawFood() {
    ctx.fillStyle = '#e74c3c';
    ctx.strokeStyle = '#c0392b';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

function draw() {
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    changingDirection = false;
    if (gameInterval) {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = `امتیاز: ${score}`;
            generateFood();
        } else {
            snake.pop();
        }

        if (didGameEnd()) {
            clearInterval(gameInterval);
            statusDisplay.textContent = `بازی تمام شد! امتیاز شما: ${score}`;
            restartButton.style.display = 'block'; // نمایش دکمه شروع مجدد
            return;
        }

        snake.forEach(drawSnakePart);
        drawFood();
    }
}

function didGameEnd() {
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvasSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvasSize;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true;
    }

    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

function changeDirection(event) {
    const keyPressed = event.key;

    if (changingDirection) return;
    changingDirection = true;

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingLeft = dx === -gridSize;
    const goingRight = dx === gridSize;

    if (keyPressed === "ArrowUp" && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if (keyPressed === "ArrowDown" && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
    if (keyPressed === "ArrowLeft" && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if (keyPressed === "ArrowRight" && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
}

function startGame() {
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `امتیاز: ${score}`;
    statusDisplay.textContent = ''; // پاک کردن پیام اتمام بازی
    restartButton.style.display = 'none'; // مخفی کردن دکمه شروع مجدد

    generateFood();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);

    document.addEventListener('keydown', changeDirection);
}

function restartGame() {
    // فقط کافی است تابع startGame را دوباره فراخوانی کنیم
    startGame();
}

// اضافه کردن Event Listener به دکمه شروع مجدد
restartButton.addEventListener('click', restartGame);

// شروع خودکار بازی هنگام بارگذاری صفحه
startGame();