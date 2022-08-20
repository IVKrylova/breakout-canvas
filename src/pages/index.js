import './index.css';
const {
  FACTOR_X,
  FACTOR_Y,
  BALL_RADIUS,
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

// функция отрисовки мяча
const drawBall = _ => {
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, Math.PI*2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// функция движения мяча
const draw = _ => {
  // очищение перед каждой отрисовкой
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // отрисовка
  drawBall();
  x += dx;
  y += dy;

  // отскоки мяча от стенки
  if (x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) dx = -dx;
  if (y + dy > canvas.height - BALL_RADIUS || y + dy < BALL_RADIUS) dy = -dy;
}

// заставляем мяч двигаться
setTimeout(function move() {
  draw();
  setTimeout(move, 10);
}, 10);

