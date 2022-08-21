import './index.css';
const {
  FACTOR_X,
  FACTOR_Y,
  BALL_RADIUS,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  BRICK_ROW_COUNT,
  BRICK_COLUMN_COUNT,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_PADDING,
  BRICK_OFFSET_TOP,
  BRICK_OFFSET_LEFT
} = require('../utils/constants');

const messageLosing = document.querySelector('.message-about-losing');
const buttonReload = document.querySelector('.button-reload');
const messageWin = document.querySelector('.victory-message');
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

// массив с кирпичами
const bricks = [];
for (let i = 0; i < BRICK_COLUMN_COUNT; i++) {
  bricks[i] = [];
  for (let j = 0; j < BRICK_ROW_COUNT; j++) {
    bricks[i][j] = { x: 0, y: 0, status: true };
  }
}

// счет очков
let score = 0;

// функция отрисовки мяча
const drawBall = _ => {
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, Math.PI*2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// функция отрисовки ракетки
const drawPaddle = _ => {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = '#0095dd';
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

// функция отрисовки кирпичей
const drawBricks = _ => {
  for (let i = 0; i < BRICK_COLUMN_COUNT; i++) {
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
      if (bricks[i][j].status === true) {
        // положение каждого кирпича
        const brickX = (i * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
        const brickY = (j * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;

        // добавление координат кирпича в массив
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        // отрисовка кирпича
        ctx.beginPath();
        ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
        ctx.fillStyle = '#0095dd';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// функция отрисовки счета
const drawScore = _ => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText('Score: ' + score, 8, 20);
}

// функцию обнаружения столкновений - сталкивается ли центр мяча с любым из кирпичей
const collisionDetection = _ => {
  for (let i = 0; i < BRICK_COLUMN_COUNT; i++) {
    for (let j=0; j < BRICK_ROW_COUNT; j++) {
      const brick = bricks[i][j];
      if (brick.status === true) {
        // изменение направления мяча, если было столкновение
        if (x > brick.x && x < brick.x + BRICK_WIDTH && y > brick.y && y < brick.y + BRICK_HEIGHT) {
          dy = -dy;
          brick.status = false;
          score++;
          if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT)
            messageWin.classList.add('victory-message_visible');
        }
      }
    }
  }
}

// функция отрисовки игры
const draw = _ => {
  // очищение перед каждой отрисовкой
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // отрисовка кирпичей
  drawBricks();
  // отрисовка мяча
  drawBall();
  x += dx;
  y += dy;

  // отскоки мяча от левой и правой стенки
  if (x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) dx = -dx;
  // отскоки мяча от верха и окончание игры
  if (y + dy < BALL_RADIUS) {
    dy = -dy;
  } else if (y + dy > canvas.height - BALL_RADIUS) {
    // проверка на касание мяча ракетки
    if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
      dy = -dy;
    } else {
      messageLosing.classList.add('message-about-losing_visible');
      clearInterval(interval);
    }
  }

  // логика перемещения ракетки
  if (rightArrowPressed && paddleX < canvas.width - PADDLE_WIDTH) {
    paddleX += 7;
  } else if (leftArrowPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // отрисовка ракетки
  drawPaddle();
  // проверка на столкновения
  collisionDetection();
  // отрисовка счета
  drawScore();
}

// обработчик кнопки перезагрузки
const restartGame = _ => {
  document.location.reload();
}

// обработчик управления мышью
const mouseMoveHandler = evt => {
  const relativeX = evt.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - PADDLE_WIDTH/2;
  }
}

// навешиваем обработчики кнопок управления ракеткой
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// навешиваем обработчик на кнопку перезагрузки
buttonReload.addEventListener('click', restartGame);

// управление мышью
document.addEventListener('mousemove', mouseMoveHandler, false);

// заставляем мяч двигаться
const interval = setInterval(draw, 10);
