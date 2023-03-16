import Player from './Player.js';
import Vec2D from './Vec2D.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

const player = new Player(50, 50);

const foods = [];

setup();

function setup() {
	for (let i = 0; i < 50; i++) {
		foods.push({
			x: Math.floor(Math.random() * 1000 - 500),
			y: Math.floor(Math.random() * 1000 - 500),
		});
	}
}

const dir = new Vec2D(0, 0);

canvas.addEventListener('mousemove', event => {
	dir.x = event.clientX - canvas.width / 2;
	dir.y = event.clientY - canvas.height / 2;
});

setInterval(() => {
	player.update(dir);
}, 1000 / 60);

render();
function render() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.translate(canvas.width / 2, canvas.height / 2);
	context.translate(-player.pos.x, -player.pos.y);

	foods.forEach(food => {
		context.beginPath();
		context.arc(food.x, food.y, 3, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();
	});

	context.beginPath();
	context.strokeStyle = 'blue';
	context.fillStyle = 'blue';
	context.arc(player.pos.x, player.pos.y, player.score, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();

	requestAnimationFrame(render);
}
