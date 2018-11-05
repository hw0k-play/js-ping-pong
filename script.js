/**
 * Configs
 */

let canvas;
let canvasContext;

let ball = {
  posX: 50,
  posY: 50,
  speedX: 5,
  speedY: 3
};

const paddle = {
  height: 100,
  thickness: 10
};

let player = {
  paddleY: 250,
  score: 0
};

let enemy = {
  paddleY: 250,
  score: 0
};

let game = {
  speed: 1,
  time: 0,
  pause: false
};

const fps = 60;

// End of Configs

/**
 * Sets logic of this game.
 */
window.onload = () => {
  canvas = document.getElementById("game-canvas");
  canvasContext = canvas.getContext("2d");

  // MouseMove Handler
  canvas.onmousemove = e => { if (!game.pause) player.paddleY = calcMousePos(e).y };

  resetBall();

  setInterval(() => {
    if (game.pause) {
      drawComponents();
    }
    else {
      setSpeed();
      moveBall();
      moveEnemy();
      drawComponents();
    }
  }, 1000 / fps);
};

/**
 * Sets pause state with 'spacebar'.
 */
window.onkeypress = e => { if (e.code == "Space") game.pause = !game.pause; };

/**
 * Draws components of this game.
 */
const drawComponents = () => {
  drawCustomRect(0, 0, canvas.width, canvas.height, "black");
  drawCustomRect(0, player.paddleY, paddle.thickness, paddle.height, "white");
  drawCustomRect(canvas.width - paddle.thickness, enemy.paddleY, paddle.thickness, paddle.height, "white");

  drawCustomCircle(ball.posX, ball.posY, 10, "red");
  
  if (game.pause) {
    writePause();
  }

  writeScore();
};

const reverse = num => num = -num;

/**
 * Sets position of ball.
 */
const moveBall = () => {
  ball.posX += parseInt(ball.speedX * game.speed);
  ball.posY += parseInt(ball.speedY * game.speed);

  if (ball.posY > canvas.height || ball.posY < 0) {
    ball.speedY *= -1;
  }

  if (ball.posX < 0) {
    if (ball.posY > player.paddleY && ball.posY < player.paddleY + paddle.height) {
      ball.speedX *= -1;
    }
    else {
      resetBall();
      enemy.score++;
    }
  }

  if (ball.posX > canvas.width) {
    if (ball.posY > enemy.paddleY && ball.posY < enemy.paddleY + paddle.height) {
      ball.speedX *= -1;
    }
    else {
      resetBall();
      player.score++;
    }
  }
};

/**
 * Moves Enemy AI's paddle.
 */
const moveEnemy = () => {
  let paddleEnemyCenter = enemy.paddleY + (paddle.height / 2);
  if (paddleEnemyCenter < (ball.posY - 35)) {
    enemy.paddleY += 6;
  }
  else if (paddleEnemyCenter > (ball.posY + 35)) {
    enemy.paddleY -= 6;
  }
};

/**
 * Resets ball when game was ended.
 */
const resetBall = () => {
  game.speed = 1;
  game.time = 0;

  // Top-Left, Top-Right, Bottom-Left, Bottom-Right
  const random = Math.floor(Math.random() * 100) + 1
  if (random > 50) ball.speedX *= -1;
  if (random % 2 == 0) ball.speedY *= -1;
  ball.posX = canvas.width / 2;
  ball.posY = canvas.height / 2;
};

/**
 * Draws rectangle with custom property.
 * @param {Number} x Rectangle's center posX.
 * @param {Number} y Rectangle's center posY.
 * @param {Number} width Rectangle's width.
 * @param {Number} height Rectangle's height.
 * @param {String} color Rectangle's color.
 */
const drawCustomRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

/**
 * Draws circle with custom property.
 * @param {Number} x Circle's center posX.
 * @param {Number} y Circle's center posY.
 * @param {Number} radius Circle's radius.
 * @param {String} color Circle's color.
 */
const drawCustomCircle = (x, y, radius, color) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
  canvasContext.closePath();
};

/**
 * Calculates player's mouse position for canvas relatively.
 * @param {MouseEvent} e 
 */
const calcMousePos = e => {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;

  const mouseX = e.clientX - rect.left - root.scrollLeft;
  const mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
};

/**
 * Writes score when game is active.
 */
const writeScore = () => {
  canvasContext.fillStyle = "white";
  canvasContext.font = "30px Lato";
  canvasContext.fillText(`ME ${player.score} : ${enemy.score} COM`, 30, 50);
};

/**
 * Writes text when game is paused.
 */
const writePause = () => {
  canvasContext.fillStyle = "white";
  canvasContext.font = "30px Lato";
  canvasContext.fillText("Pause", canvas.width - 100, canvas.height - 40);
};

/**
 * Sets game speed.
 */
const setSpeed = () => {
  game.time++;

  if (game.time == 240) game.speed *= 1.2;
  if (game.time == 480) game.speed *= 1.2;
  if (game.time == 840) game.speed *= 1.2;
  if (game.time == 1200) game.speed *= 1.2;
  if (game.time == 2000) game.speed *= 1.2;
};