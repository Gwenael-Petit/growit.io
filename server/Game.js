import PlayerCell from './PlayerCell.js';
import FoodCell from './FoodCell.js';
import Colors from './Colors.js';

export default class Game {
	players = [];
	deadQueue = [];
	foods = [];
	static width = 100;
	static height = 100;

	constructor(width, height) {
		Game.width = width;
		Game.height = height;

		for (let i = 0; i < 500; i++) {
			this.foods.push(
				new FoodCell(
					Math.random() * Game.width - Game.width / 2,
					Math.random() * Game.height - Game.height / 2
				)
			);
		}
	}

	join(socketId) {
		this.players.push(
			new PlayerCell(
				Math.random() * Game.width - Game.width / 2,
				Math.random() * Game.height - Game.height / 2,
				Colors.randomColor(),
				10,
				socketId
			)
		);
	}

	remove(socketId) {
		const idx = this.players.findIndex(player => player.socketId == socketId);
		if (idx >= 0) this.players.splice(idx, 1);
	}

	update() {
		this.players.forEach(player => {
			player.update();
			for (let i = this.foods.length - 1; i >= 0; i--) {
				if (player.canEatCell(this.foods[i])) {
					this.foods.splice(i, 1);
				}
			}
			for (let i = this.players.length - 1; i >= 0; i--) {
				this.players.forEach(other => {
					if (other.canEatCell(this.players[i])) {
						this.deadQueue.push(this.players[i].socketId);
						this.players.splice(i, 1);
					}
				});
			}
		});
	}

	setDirection(socketId, x, y) {
		const p = this.players.find(p => p.socketId == socketId);
		if (p != undefined) p.setDirection(x, y);
	}
}
