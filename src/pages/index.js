import './index.css';
const {
  FACTOR_X,
  FACTOR_Y,
  BALL_RADIUS,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} = require('../utils/constants');

const canvas = document.querySelector('.canvas');
// переменная для хранения 2D визуализации контекста
const ctx = canvas.getContext('2d');

// начальная позиция мяча
let x = canvas.width/FACTOR_X;
let y = canvas.height-FACTOR_Y;
// изменение координат при движении мяча
let dx = 2;
let dy = -2;

// позиция ракетки
let paddleX = (canvas.width-PADDLE_WIDTH)/2;
let paddleY = canvas.height-PADDLE_HEIGHT;
// состояние кнопок управления ракеткой
let rightArrowPressed = false;
let leftArrowPressed = false;

// функция отрисовки мяча
const drawBall = _ => {
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, Math.PI*2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// функция отрисовки ракетки
const drawPaddle = _ => {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// обработчики нажатия на кнопки управления ракеткой
// 39 - стрелка вправо; 37 - стрелка влево
const keyDownHandler = evt => {
  if (evt.keyCode == 39) {
    rightArrowPressed = true;
  } else if (evt.keyCode == 37) {
      leftArrowPressed = true;
  }
}
const keyUpHandler = evt => {
  if (evt.keyCode == 39) {
    rightArrowPressed = false;
  }
  else if (evt.keyCode == 37) {
    leftArrowPressed = false;
  }
}

// функция движения мяча
const draw = _ => {
  // очищение перед каждой отрисовкой
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // отрисовка мяча
  drawBall();
  x += dx;
  y += dy;

  // отскоки мяча от стенки
  if (x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) dx = -dx;
  if (y + dy > canvas.height - BALL_RADIUS || y + dy < BALL_RADIUS) dy = -dy;

  // логика перемещения ракетки
  if (rightArrowPressed && paddleX < canvas.width - PADDLE_WIDTH) {
    paddleX += 7;
  } else if (leftArrowPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // отрисовка ракетки
  drawPaddle();
}

// навешиваем обработчики кнопок управления ракеткой
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// заставляем мяч двигаться
setTimeout(function move() {
  draw();
  setTimeout(move, 10);
}, 10);

