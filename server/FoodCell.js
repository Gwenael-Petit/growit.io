import Colors from './Colors.js';

export default class FoodCell extends Cell {
	constructor(x, y) {
		super(x, y, Colors.randomColor(), 1);
	}
}
