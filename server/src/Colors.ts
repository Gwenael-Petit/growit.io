export default class Colors {
	static colors: string[] = [
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

	static randomColor(): string {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}
}
