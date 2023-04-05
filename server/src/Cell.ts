import Vec2D from './Vec2D';

export default class Cell {
	pos: Vec2D;
	radius: number;
	color: string;

	constructor(x: number, y: number, color: string, score: number) {
		this.pos = new Vec2D(x, y);
		this.color = color;
		this.radius = Math.sqrt(score / Math.PI);
	}
}
