import { io } from 'socket.io-client';

const socket = new io();

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

let canvasWidth, canvasHeight;

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
	players = [],
	foods = [];

function drawGrid() {
	context.beginPath();
	context.lineWidth = 2;
	for (let i = 0; i < 100; i++) {}
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
	context.strokeStyle = p.color;
	context.fillStyle = p.color;
	context.arc(p.pos.x, p.pos.y, p.radius, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();
}

function render() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.save();
	if (player != undefined) {
		context.translate(canvasWidth / 2, canvasHeight / 2);
		const zoom = 48 / Math.sqrt(player.radius);
		context.scale(zoom, zoom);
		context.translate(-player.pos.x, -player.pos.y);
	}
	foods.forEach(f => drawFood(f));
	if (player != undefined) drawPlayer(player);
	players.forEach(p => drawPlayer(p));
	context.restore();
	requestAnimationFrame(render);
}

socket.on('allowConnection', () => {
	socket.emit('join');
	inGame = true;
});

socket.on('updateGame', game => {
	players = game.players;
	foods = game.foods;
	player = players.find(p => p.socketId == socket.id);
});

canvas.addEventListener('mousemove', event => {
	if (inGame) {
		socket.emit('setDirection', {
			socketId: socket.id,
			x: event.clientX - canvasWidth / 2,
			y: event.clientY - canvasHeight / 2,
		});
	}
});

render();

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
