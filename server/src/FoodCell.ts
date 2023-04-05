import Colors from './Colors';
import Cell from './Cell';

export default class FoodCell extends Cell {
	constructor(x: number, y: number) {
		super(x, y, Colors.randomColor(), 1);
	}
}
