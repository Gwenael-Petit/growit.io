import { io } from 'socket.io-client';

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
	context.strokeStyle = p.color;
	context.fillStyle = p.color;
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
		const zoom = 48 / Math.sqrt(player.radius);
		context.scale(zoom, zoom);
		//context.scale(20, 20);
		context.translate(-player.pos.x, -player.pos.y);
	} else {
		context.scale(20, 20);
	}
	drawGrid();
	foods.forEach(f => drawFood(f));
	if (player != undefined) drawPlayer(player);
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

socket.on('dead', () => {
	inGame = false;
});

socket.on('updateGame', game => {
	players = game.players.sort((a, b) => a.score > b.score);
	foods = game.foods;
	player = players.find(p => p.socketId == socket.id);
});

render();

document.addEventListener('keydown', event => {
	if (event.key == 'j') {
		socket.emit('join', 'Bobo');
	}
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
