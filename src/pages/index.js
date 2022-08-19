import './index.css';

const canvas = document.querySelector('.canvas');
// переменная для хранения 2D визуализации контекста
const ctx = canvas.getContext('2d');
// начальная позиция мяча
let x = canvas.width/2;
let y = canvas.height-30;
// изменение координат при движении мяча
const dx = 2;
const dy = -2;

// функция отрисовки мяча
const drawBall = _ => {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI*2);
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
}

// заставляем мяч двигаться
setTimeout(function move() {
  draw();
  setTimeout(move, 10);
}, 10);

