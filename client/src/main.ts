import { io, Socket } from 'socket.io-client';
import {
	ServerToClientsEvents,
	ClientToServerEvents,
} from '../../common/socketInterfaces';
import {
	FoodCellMessage,
	PlayerCellMessage,
} from '../../common/socketMessages';
import MainView from './MainView';

//const creditsLink = document.querySelector('.creditsLink') as HTMLAnchorElement;

const endGameMenu = document.querySelector('.endGame') as HTMLDivElement;
const playAgain = document.querySelector('.playAgain') as HTMLAnchorElement;

const scoreTable = document.querySelector('.scoreTable') as HTMLDivElement;
const backToMenuScore = document.querySelector('.menu1') as HTMLAnchorElement;
const backToMenuEndGame = document.querySelector('.menu2') as HTMLAnchorElement;
const backToMenuCredits = document.querySelector('.menu3') as HTMLAnchorElement;

const credits = document.querySelector('.credits') as HTMLDivElement;

const leaderBoard = document.querySelector('.leaderBoard') as HTMLDivElement;
const scoreBubble = document.querySelector('.score-bubble') as HTMLDivElement;

let canvasWidth: number,
	canvasHeight: number,
	mouseX: number = 0,
	mouseY: number = 0,
	mapWidth: number,
	mapHeight: number;

const socket: Socket<ServerToClientsEvents, ClientToServerEvents> = io();

const canvas = document.querySelector('.gameCanvas') as HTMLCanvasElement,
	context = canvas.getContext('2d') as CanvasRenderingContext2D;

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
	players: PlayerCellMessage[] = [],
	foods: FoodCellMessage[] = [];

function drawGrid(): void {
	context.beginPath();
	context.strokeStyle = 'gray';
	context.lineWidth = 0.05;
	for (let x = -mapWidth; x <= mapWidth; x += 10) {
		context.moveTo(x, -mapHeight);
		context.lineTo(x, mapHeight);
	}
	for (let y = -mapHeight; y <= mapHeight; y += 10) {
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

	if (!p.vulnerable) {
		context.lineWidth = 0.5;
		context.strokeStyle = 'greenyellow';
		context.stroke();
	}
	context.lineWidth = 0.05;
	context.textAlign = 'center';
	context.fillStyle = 'white';
	context.font = `bold ${p.radius * 0.45}px arial`;
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
		context.scale(player.zoom, player.zoom);
		context.translate(-player.pos.x, -player.pos.y);
	} else {
		context.scale(10, 10);
	}
	drawGrid();
	foods.forEach(f => drawFood(f));
	players.forEach(p => drawPlayer(p));
	context.restore();
	requestAnimationFrame(render);
}

render();

// SocketIo

socket.on('allowConnection', mapSize => {
	mapWidth = mapSize.width / 2;
	mapHeight = mapSize.height / 2;
});

socket.on('joined', () => {
	inGame = true;
});

socket.on('dead', ({ score, joinTimeStamp, deathTimeStamp, finalScore }) => {
	inGame = false;
	endGameMenu.classList.remove('hidden');
	leaderBoard.classList.add('hidden');
	scoreBubble.classList.add('hidden');
	endGameData(score, new Date(deathTimeStamp - joinTimeStamp), finalScore);
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

const mainView = new MainView(
	document.querySelector('.menu') as HTMLDivElement
);

const topTenTBody = scoreTable.querySelector(
	'tbody'
) as HTMLTableSectionElement;

socket.on('topTen', topTen => {
	let html = '';
	topTen.reverse().forEach(p => {
		html += `<tr>
			<td>${p.name}</td>
			<td>${p.score}</td>
			<td>${new Date(p.date).toLocaleDateString('fr')}</td>
		</tr>`;
	});
	topTenTBody.innerHTML = html;
});

mainView.loginForm.addEventListener('submit', event => {
	event.preventDefault();
	mainView.hide();
	play();
});

playAgain.addEventListener('click', event => {
	event.preventDefault();
	endGameMenu.classList.add('hidden');
	play();
});

function play(): void {
	leaderBoard.classList.remove('hidden');
	scoreBubble.classList.remove('hidden');
	socket.emit('join', {
		name: mainView.nameInput.value == '' ? 'Grolem' : mainView.nameInput.value,
		color: mainView.selectedColor,
	});
}

mainView.scoreLink.addEventListener('click', event => {
	event.preventDefault();
	scoreTable.classList.remove('hidden');
	mainView.hide();
	socket.emit('getTopTen');
});

/*creditsLink.addEventListener('click', event => {
	event.preventDefault();
	credits.classList.remove('hidden');
	mainView.hide();
});*/

backToMenuScore.addEventListener('click', event => {
	event.preventDefault();
	mainView.show();
	scoreTable.classList.add('hidden');
});

backToMenuEndGame.addEventListener('click', event => {
	event.preventDefault();
	mainView.show();
	endGameMenu.classList.add('hidden');
});

backToMenuCredits.addEventListener('click', event => {
	event.preventDefault();
	mainView.show();
	credits.classList.add('hidden');
});

canvas.addEventListener('mousemove', event => {
	if (inGame) {
		mouseX = event.clientX - canvasWidth / 2;
		mouseY = event.clientY - canvasHeight / 2;
	}
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

function endGameData(score: number, timeAlive: Date, finalScore: number): void {
	console.log(timeAlive);
	timeSurvived.innerHTML = `${timeAlive.getMinutes()}m:${timeAlive.getSeconds()}s`;
	eatenFood.innerHTML = `${score}`;
	pointsGained.innerHTML = `${finalScore}`;
}
