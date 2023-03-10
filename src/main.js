const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

let x = 1000,
	y = 400;

let score = 10;
render();

function render() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.strokeStyle = 'blue';
	context.fillStyle = 'blue';
	context.arc(
		canvas.width / 2,
		canvas.height / 2,
		score,
		0,
		2 * Math.PI,
		false
	);
	context.fill();
	context.stroke();
	//context.translate(0, 100);
	requestAnimationFrame(render);
}
