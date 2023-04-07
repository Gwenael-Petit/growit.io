import { io, Socket } from 'socket.io-client';
import {
	ServerToClientsEvents,
	ClientToServerEvents,
} from '../../common/socketInterfaces';
import {
	FoodCellMessage,
	PlayerCellMessage,
} from '../../common/socketMessages';

const mainMenu = document.querySelector('.menu') as HTMLDivElement;
const playButton = document.querySelector('.play') as HTMLButtonElement;
const leaderBoard = document.querySelector('.leaderBoard') as HTMLDivElement;
const scoreBubble = document.querySelector('.score-bubble') as HTMLDivElement;
const loginForm = document.querySelector('.loginForm') as HTMLFormElement;
const nameInput = loginForm.querySelector(
	'input[type=text]'
) as HTMLInputElement;
const endGameMenu = document.querySelector('.endGame') as HTMLDivElement;
const playAgain = document.querySelector('.playAgain') as HTMLAnchorElement;
const scoreLink = document.querySelector('.scoreLink') as HTMLAnchorElement;
const scoreTable = document.querySelector('.scoreTable') as HTMLDivElement;
const backToMenuScore = document.querySelector('.menu1') as HTMLAnchorElement;
const backToMenuEndGame = document.querySelector('.menu2') as HTMLAnchorElement;
const backToMenuCredits = document.querySelector('.menu3') as HTMLAnchorElement;
const creditsLink = document.querySelector('.creditsLink') as HTMLAnchorElement;
const credits = document.querySelector('.credits') as HTMLDivElement;
const colorPicker = document.querySelectorAll(
	'.color-picker'
) as NodeListOf<HTMLSpanElement>;

const interpolationZoomStep = 0.1;

const socket: Socket<ServerToClientsEvents, ClientToServerEvents> = io();

const canvas = document.querySelector('.gameCanvas') as HTMLCanvasElement,
	context = canvas.getContext('2d') as CanvasRenderingContext2D;

let canvasWidth: number,
	canvasHeight: number,
	mouseX: number = 0,
	mouseY: number = 0,
	mapWidth: number,
	mapHeight: number;

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas(): void {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
}

resampleCanvas();

let inGame: boolean = false;

let player: PlayerCellMessage | undefined,
	actualZoom: number = 0,
	players: PlayerCellMessage[] = [],
	foods: FoodCellMessage[] = [];

function drawGrid(): void {
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

function drawFood(food: FoodCellMessage): void {
	context.beginPath();
	context.fillStyle = food.color;
	context.arc(food.pos.x, food.pos.y, food.radius, 0, 2 * Math.PI, false);
	context.fill();
	context.closePath();
}

function drawPlayer(p: PlayerCellMessage): void {
	context.beginPath();
	context.fillStyle = p.color;

	context.arc(p.pos.x, p.pos.y, p.radius, 0, 2 * Math.PI, false);
	context.fill();

	context.textAlign = 'center';
	context.fillStyle = 'white';
	context.font = `bold ${p.radius * 0.5}px arial`;
	context.fillText(p.name, p.pos.x, p.pos.y + p.radius * 0.15);
	context.strokeStyle = 'black';
	context.strokeText(p.name, p.pos.x, p.pos.y + p.radius * 0.15);
	context.closePath();
}

function render(): void {
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

socket.on('dead', ({ score, joinTimeStamp, deathTimeStamp }) => {
	inGame = false;
	endGameMenu.classList.remove('hideMenu');
	leaderBoard.classList.add('hideDisplays');
	scoreBubble.classList.add('hideDisplays');
	endGameData(score, new Date(deathTimeStamp - joinTimeStamp));
});

socket.on('updateGame', game => {
	players = game.players.sort((a, b) => {
		return a.score - b.score;
	});
	foods = game.foods;
	player = players.find(p => p.socketId == socket.id);
	if (inGame && player != undefined) {
		refreshScore(`${player.score}`);
		refreshLeaderBoard(player);
	}
});

render();

playButton.addEventListener('click', event => {
	event.preventDefault();
	mainMenu.classList.add('hideMenu');
	leaderBoard.classList.remove('hideDisplays');
	scoreBubble.classList.remove('hideDisplays');
	socket.emit('join', { name: nameInput.value, color: selectedColor });
});

playAgain.addEventListener('click', event => {
	event.preventDefault();
	endGameMenu.classList.add('hideMenu');
	leaderBoard.classList.remove('hideDisplays');
	scoreBubble.classList.remove('hideDisplays');
	socket.emit('join', { name: nameInput.value, color: selectedColor });
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

let selectedColor: string = 'red';
colorPicker.forEach(c => {
	c.style.backgroundColor = c.getAttribute('color') || 'red';
	c.addEventListener('click', event => {
		event.preventDefault();
		colorPicker.forEach(element => element.classList.remove('color-selected'));
		c.classList.add('color-selected');
		selectedColor = c.getAttribute('color') || 'red';
	});
});

setInterval(() => {
	if (inGame) {
		socket.emit('setDirection', {
			socketId: socket.id,
			x: mouseX,
			y: mouseY,
		});
	}
}, 1000 / 30);

setInterval(() => {
	if (inGame && player != undefined) {
		/*actualZoom =
			Math.round(
				interpolate(actualZoom, player.zoom, interpolationZoomStep) * 100
			) / 100;
		console.log(actualZoom);*/
		actualZoom = player.zoom;
	}
}, 1000 / 60);

const bodyBoard = document.querySelector(
	'.bodyBoard'
) as HTMLTableSectionElement;

function refreshLeaderBoard(player: PlayerCellMessage): void {
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
		leaderBoard += `<tr><td class="me">${playerIndex}.${player.name}</td></tr>`;
	bodyBoard.innerHTML = leaderBoard;
}

const scoreDisplay = document.querySelector('.score') as HTMLSpanElement;

function refreshScore(score: string): void {
	scoreDisplay.innerHTML = score;
}

const timeSurvived = document.querySelector('.time') as HTMLLIElement;
const eatenFood = document.querySelector('.eaten') as HTMLLIElement;
const pointsGained = document.querySelector('.points') as HTMLLIElement;

function endGameData(score: number, timeAlive: Date): void {
	timeSurvived.innerHTML = `${timeAlive.getMinutes()}m:${timeAlive.getSeconds()}s`;
	eatenFood.innerHTML = `${score}`;
}

/*function interpolate(actual, goal, t) {
	const diff = Math.round((goal - actual) * 100) / 100;
	if (diff == 0) return goal;
	if (diff > 0) return actual + t > goal ? actual + diff : actual + t;
	return actual - t < goal ? actual - diff : actual - t;
}*/
