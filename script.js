// script.js
// https://thecodingpie.com/post/learn-to-code-ping-pong-game-using-javascript-and-html5

// reference canvas using its id
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// some sounds
const hitSound = new Audio('sounds/hitSound.wav');
const scoreSound = new Audio('sounds/scoreSound.wav');
const wallHitSound = new Audio('sounds/wallHitSound.wav');

// other variables
const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

// objects
const net = {
	x: canvas.width / 2 - netWidth / 2,
	y: 0,
	width: netWidth,
	height: netHeight,
	color: '#FFF',
};

const user = {
	x: 10,
	y: canvas.height / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight,
	color: '#FFF',
	score: 0
};

const ai = {
	x: canvas.width - (paddleWidth + 10),
	y: canvas.height / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight,
	color: '#FFF',
	score: 0
};

const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 7,
	speed: 7,
	velocityX: 5,
	velocityY: 5,
	color: '#05EDFF'
};

// drawing functions 
function drawNet(){
	ctx.fillStyle = net.color;
	ctx.fillRect(net.x, net.y, net.width, net.height);
};

function drawScore(x, y, score) {
	ctx.fillStyle = '#fff';
	ctx.font = '35px sans-serif';
	ctx.fillText(score, x, y);
};

function drawPaddle(x, y, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
};

function drawBall(x, y, radius, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
};

// moving paddles
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
	switch (event.keyCode) {
		case 38:
			upArrowPressed = true;
			break;
		case 40:
			downArrowPressed = true;
			break;
	};
};

function keyUpHandler(event) {
	switch (event.keyCode) {
		case 38:
			upArrowPressed = false;
			break;
		case 40:
			downArrowPressed = false;
			break;
	};
};

function reset() {
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.speed = 7;

	ball.velocityX = -ball.velocityX;
	ball.velocityY = -ball.velocityY;
};

function collisionDetect(player, ball) {
	player.top = player.y;
	player.right = player.x + player.width;
	player.bottom = player.y + player.height;
	player.left = player.x;

	ball.top = ball.y - ball.radius;
	ball.right = ball.x + ball.radius;
	ball.bottom = ball.y + ball.radius;
	ball.left = ball.x - ball.radius;
	
	return ball.left < player.right && 
	ball.top < player.bottom && 
	ball.right > player.left && 
	ball.bottom > player.top;
};

// This seems like a new section, but I don't know what to name it
function update() {
	// move the paddle
	if (upArrowPressed && user.y > 0) {
		user.y -= 8;
	} else if (downArrowPressed && (user.y < canvas.height - user.height)) {
		user.y += 8;
	};
  	// check if ball hits top or bottom wall
  	if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
  		// play wallHitSound
  		wallHitSound.play()
  		ball.velocityY = -ball.velocityY;
  	};
  	// ball hits right wall
  	if (ball.x + ball.radius >= canvas.width) {
  		// play scoreSound
  		scoreSound.play()
  		user.score += 1;
  		reset();
  	};
  	// ball hits left wall
  	if (ball.x - ball.radius <= 0) {
  		// play scoreSound
  		scoreSound.play()
  		ai.score += 1;
  		reset();
  	};
  	// move the ball
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

  	// ai paddle movement
  	ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;
  	// collision detection on paddles
  	let player = (ball.x < canvas.width / 2) ? user : ai;

  	if (collisionDetect(player, ball)) {
  		// play hitSound
  		hitSound.play();
  		// default angle
  		let angle = 0;
  		
  		if (ball.y < (player.y + player.height / 2)) {
      		angle = -1 * Math.PI / 4;
      	} else if (ball.y > (player.y + player.height / 2)) {
      		angle = Math.PI / 4
      	}

    	ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
    	ball.velocityY = ball.speed * Math.sin(angle);

    	ball.speed += 0.2;
  	}
};

function render() {
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawNet();
	drawScore(canvas.width / 4, canvas.height / 6, user.score);
	drawScore(3 * canvas.width / 4, canvas.height / 6, ai.score);
	drawPaddle(user.x, user.y, user.width, user.height, user.color);
	drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);
	drawBall(ball.x, ball.y, ball.radius, ball.color);
};

// game loop
function gameLoop() {
	update();
	render();
};

setInterval(gameLoop, 1000 / 75);
