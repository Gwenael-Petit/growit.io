export default class Colors {
	static colors = [
		'black',
		'silver',
		'gray',
		'maroon',
		'red',
		'fuchsia',
		'green',
		'lime',
		'olive',
		'yellow',
		'navy',
		'blue',
		'teal',
		'aqua',
	];

	static randomColor() {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}
}
