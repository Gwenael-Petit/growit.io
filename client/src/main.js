import { io } from 'socket.io-client';

const socket = new io();

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

let rendered = false;
let inGame = false;

let player,
	players = [],
	foods = [];

function drawFood(food) {
	context.beginPath();
	context.fillStyle = food.color;
	context.arc(food.pos.x, food.pos.y, food.radius, 0, 2 * Math.PI, false);
	context.fill();
	context.closePath();
}

function drawPlayer(p) {
	context.beginPath();
	context.strokeStyle = p.color;
	context.fillStyle = p.color;
	context.arc(p.pos.x, p.pos.y, p.radius, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();
}

function render() {
	rendered = true;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.translate(canvas.width / 2, canvas.height / 2);
	const zoom = 48 / (player.radius * 2);
	context.scale(zoom, zoom);
	context.translate(-player.pos.x, -player.pos.y);

	foods.forEach(f => drawFood(f));
	drawPlayer(player);
	players.forEach(p => drawPlayer(p));
	requestAnimationFrame(render);
}

socket.on('allowConnection', () => {
	socket.emit('join');
	inGame = true;
});

socket.on('updateGame', game => {
	player = game.player;
	players = game.players;
	foods = game.foods;
	if (!rendered) requestAnimationFrame(render);
});

canvas.addEventListener('mousemove', event => {
	if (inGame) {
		socket.emit('setDirection', {
			socketId: socket.id,
			x: event.clientX - canvas.width / 2,
			y: event.clientY - canvas.height / 2,
		});
	}
});

/*const player = new Player(0, 0, 10);

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

	requestAnimationFrame(render);*/

/*const filterNameInput = document.getElementById('filter-name');
        const rows = document.querySelectorAll('tbody tr');
		const table = document.querySelector('table');
		const rowToSort = Array.from(table.querySelectorAll('tbody tr'));

		rowToSort.sort((a, b) => parseInt(b.cells[1].textContent) - parseInt(a.cells[1].textContent));

		rowToSort.forEach(row => table.appendChild(row));
        
        filterNameInput.addEventListener('input', () => {
            filterRows();
        });
        
        
        function filterRows() {
            const filterName = filterNameInput.value.trim().toLowerCase();
            
            rows.forEach(row => {
                const name = row.querySelector('td:first-child').textContent.trim().toLowerCase();
                
                if (filterName === '' || name.includes(filterName)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
}*/
