import { io } from 'socket.io-client';

const mainMenu = document.querySelector('.menu');
const playButton = document.querySelector('.play');
const leaderBoard = document.querySelector('.leaderBoard');
const score = document.querySelector('.score-bubble');
const loginForm = document.querySelector('.loginForm');
const nameInput = loginForm.querySelector('input[type=text]');
const endGameMenu = document.querySelector('.endGame');
const playAgain = document.querySelector('.playAgain');
const scoreLink = document.querySelector('.scoreLink');
const scoreTable = document.querySelector('.scoreTable');
const backToMenuScore = document.querySelector('.menu1');
const backToMenuEndGame = document.querySelector('.menu2');
const backToMenuCredits = document.querySelector('.menu3');
const creditsLink = document.querySelector('.creditsLink');
const credits = document.querySelector('.credits');
const colorChoice = document.querySelectorAll('.color-picker');

const interpolationZoomStep = 0.1;

const socket = new io();

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

let canvasWidth,
	canvasHeight,
	mouseX = 0,
	mouseY = 0,
	mapWidth,
	mapHeight;

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
}

resampleCanvas();

let inGame = false;

let player,
	actualZoom = 0,
	players = [],
	foods = [];

function drawGrid() {
	context.beginPath();
	context.strokeStyle = 'gray';
	context.lineWidth = 0.05;
	for (let x = -mapWidth; x <= mapWidth; x += 5) {
		context.moveTo(x, -mapHeight);
		context.lineTo(x, mapHeight);
	}
	for (let y = -mapHeight; y <= mapHeight; y += 5) {
		context.moveTo(-mapWidth, y);
		context.lineTo(mapWidth, y);
	}
	context.stroke();
	context.closePath();
}

function drawFood(food) {
	context.beginPath();
	context.fillStyle = food.color;
	context.arc(food.pos.x, food.pos.y, food.radius, 0, 2 * Math.PI, false);
	context.fill();
	context.closePath();
}

function drawPlayer(p) {
	context.beginPath();
	if (color != undefined) {
		context.strokeStyle = color;
		context.fillStyle = color;
	} else {
		context.strokeStyle = p.color;
		context.fillStyle = p.color;
	}

	context.arc(p.pos.x, p.pos.y, p.radius, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();

	context.textAlign = 'center';
	context.fillStyle = 'white';
	context.font = `bold ${p.radius * 0.5}px arial`;
	context.fillText(p.name, p.pos.x, p.pos.y + p.radius * 0.15);
	context.strokeStyle = 'black';
	context.strokeText(p.name, p.pos.x, p.pos.y + p.radius * 0.15);
	context.closePath();
}

function render() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.save();
	context.translate(canvasWidth / 2, canvasHeight / 2);
	if (player != undefined) {
		context.scale(actualZoom, actualZoom);
		context.translate(-player.pos.x, -player.pos.y);
	} else {
		context.scale(20, 20);
	}
	drawGrid();
	foods.forEach(f => drawFood(f));
	players.forEach(p => drawPlayer(p));
	context.restore();
	requestAnimationFrame(render);
}

socket.on('allowConnection', mapSize => {
	mapWidth = mapSize.width / 2;
	mapHeight = mapSize.height / 2;
});

socket.on('joined', () => {
	inGame = true;
});
let finalScore = 0;
socket.on('dead', () => {
	endGameMenu.classList.remove('hideMenu');
	leaderBoard.classList.add('hideDisplays');
	score.classList.add('hideDisplays');
	endGameData(finalScore);
	inGame = false;
});

socket.on('updateGame', game => {
	players = game.players.sort((a, b) => {
		return a.score - b.score;
	});
	foods = game.foods;
	player = players.find(p => p.socketId == socket.id);
	if (player != undefined) {
		refreshScore(player.score);
		refreshLeaderBoard();
		finalScore = player.score;
	}
});

render();

playButton.addEventListener('click', event => {
	event.preventDefault();
	mainMenu.classList.add('hideMenu');
	leaderBoard.classList.remove('hideDisplays');
	score.classList.remove('hideDisplays');
	socket.emit('join', nameInput.value);
	//time = 0;
});

playAgain.addEventListener('click', event => {
	event.preventDefault();
	endGameMenu.classList.add('hideMenu');
	leaderBoard.classList.remove('hideDisplays');
	score.classList.remove('hideDisplays');
	socket.emit('join', nameInput.value);
	//time = 0;
});

scoreLink.addEventListener('click', event => {
	event.preventDefault();
	scoreTable.classList.remove('hideMenu');
	mainMenu.classList.add('hideMenu');
});

backToMenuScore.addEventListener('click', event => {
	event.preventDefault();
	mainMenu.classList.remove('hideMenu');
	scoreTable.classList.add('hideMenu');
});

backToMenuEndGame.addEventListener('click', event => {
	event.preventDefault();
	mainMenu.classList.remove('hideMenu');
	endGameMenu.classList.add('hideMenu');
});

creditsLink.addEventListener('click', event => {
	event.preventDefault();
	credits.classList.remove('hideMenu');
	mainMenu.classList.add('hideMenu');
});

backToMenuCredits.addEventListener('click', event => {
	event.preventDefault();
	mainMenu.classList.remove('hideMenu');
	credits.classList.add('hideMenu');
});

canvas.addEventListener('mousemove', event => {
	if (inGame) {
		mouseX = event.clientX - canvasWidth / 2;
		mouseY = event.clientY - canvasHeight / 2;
	}
});
let color;
for (let i = 0; i < colorChoice.length; i++) {
	let element = colorChoice[i];
	element.addEventListener('click', event => {
		event.preventDefault();
		colorChoice.forEach(element => element.classList.remove('color-selected'));
		element.classList.add('color-selected');
		console.log(element.classList[1]);
		color = element.classList[1];
	});
}

setInterval(() => {
	if (inGame) {
		socket.emit('setDirection', {
			socketId: socket.id,
			x: mouseX,
			y: mouseY,
		});
	}
	//time++;
}, 1000 / 30);

setInterval(() => {
	if (inGame) {
		/*actualZoom =
			Math.round(
				interpolate(actualZoom, player.zoom, interpolationZoomStep) * 100
			) / 100;
		console.log(actualZoom);*/
		actualZoom = player.zoom;
	}
}, 1000 / 60);

function refreshLeaderBoard() {
	const orderedPlayers = players.slice(0, players.length).reverse();
	let leaderBoard = '';
	const playerIndex = orderedPlayers.findIndex(
		p => p.socketId == player.socketId
	);
	orderedPlayers.slice(0, 10).forEach((p, idx) => {
		leaderBoard += `<tr><td class="${idx == playerIndex ? 'me' : ''}">${
			idx + 1
		}.${p.name}</td></tr>`;
	});
	if (playerIndex >= 10)
		leaderBoard += `<tr><td>${playerIndex}.${player.name}</td></tr>`;
	document.querySelector('.bodyBoard').innerHTML = leaderBoard;
}

function refreshScore(score) {
	document.querySelector('.score').innerHTML = score;
}

const timeSurvived = document.querySelector('.time');
const eatenFood = document.querySelector('.eaten');
const pointsGained = document.querySelector('.points');
function endGameData(score) {
	pointsGained.innerHTML = score;
	//timeSurvived.innerHTML = Math.round(time / 30);
}

/*function interpolate(actual, goal, t) {
	const diff = Math.round((goal - actual) * 100) / 100;
	if (diff == 0) return goal;
	if (diff > 0) return actual + t > goal ? actual + diff : actual + t;
	return actual - t < goal ? actual - diff : actual - t;
}*/
