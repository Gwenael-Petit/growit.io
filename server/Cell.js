import Vec2D from './Vec2D.js';

export default class Cell {
	pos;
	radius;
	color;

	constructor(x, y, color, score) {
		this.pos = new Vec2D(x, y);
		this.color = color;
		this.radius = Math.sqrt(score / Math.PI);
	}
}
