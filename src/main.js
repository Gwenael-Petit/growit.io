const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

/*function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);*/

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 1000,
	y = 400;

const image = new Image();
image.src = '/images/logo.png';

image.addEventListener('load', event => {
	context.drawImage(image, 50, 50);
});

render();

function render() {
	//context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.moveTo(x, y);
	context.strokeStyle = 'blue';
	context.fillStyle = 'blue';
	context.arc(x, y, 10, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
}
