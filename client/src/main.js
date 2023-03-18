import { io } from 'socket.io-client';
import Player from './Player.js';
import Food from './Food.js';

const socket = new io();

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

const player = new Player(0, 0, 10);

const foods = [];

setup();

function setup() {
	for (let i = 0; i < 200; i++) {
		foods.push(
			new Food(
				Math.floor(Math.random() * 200 - 200),
				Math.floor(Math.random() * 200 - 200),
				1
			)
		);
	}
}

canvas.addEventListener('mousemove', event => {
	player.setDirection(
		event.clientX - canvas.width / 2,
		event.clientY - canvas.height / 2
	);
});

setInterval(() => {
	foods.forEach((food, idx) => {
		if (player.canEatFood(food)) {
			foods.splice(idx, 1);
			console.log(player.speed);
		}
	});
	player.update();
}, 1000 / 60);

render();
function render() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.translate(canvas.width / 2, canvas.height / 2);
	const zoom = 48 / (player.size / 2);
	context.scale(zoom, zoom);
	context.translate(-player.pos.x, -player.pos.y);

	foods.forEach(food => {
		context.beginPath();
		context.arc(food.pos.x, food.pos.y, food.size / 2, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();
		context.closePath();
	});

	context.beginPath();
	context.strokeStyle = 'blue';
	context.fillStyle = 'blue';
	context.arc(
		player.pos.x,
		player.pos.y,
		player.size / 2,
		0,
		2 * Math.PI,
		false
	);
	context.fill();
	context.stroke();

	requestAnimationFrame(render);
}
