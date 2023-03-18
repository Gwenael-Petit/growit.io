import Vec2D from './Vec2D.js';

export default class Food {
	pos;
	size;

	constructor(x, y, score) {
		this.pos = new Vec2D(x, y);
		this.size = Math.sqrt(score / Math.PI) * 2;
	}
}
