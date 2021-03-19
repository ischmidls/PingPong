// game.js
var canvas;
var canvasContext;
let ballX = 50;
let ballSpeedX = 5;
let ballY = 50;

window.onload = function() {
	alert("game.html loaded");
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
	
	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);
}

function moveEverything() {
	ballX += ballSpeedX;
	ballSpeedX++;
}

function drawEverything() {
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0,0,canvas.width,canvas.height);
	canvasContext.fillStyle = 'white';
	canvasContext.fillRect(ballX, ballY, 20, 20);
	canvasContext.fillStyle = 'white';
	canvasContext.fillRect(0, ballY, 20, 100);
}