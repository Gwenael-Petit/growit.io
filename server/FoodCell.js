import Colors from './Colors.js';
import Cell from './Cell.js';

export default class FoodCell extends Cell {
	constructor(x, y) {
		super(x, y, Colors.randomColor(), 1);
	}
}
