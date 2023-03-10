const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

/*function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);*/

console.log(canvas.clientWidth);
console.log(canvas.width);

let x = 50,
	y = 50;

render();

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.moveTo(x, y);
	context.strokeStyle = 'blue';
	context.fillStyle = 'blue';
	context.arc(x, y, 10, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
}
