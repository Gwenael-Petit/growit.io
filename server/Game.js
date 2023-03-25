import PlayerCell from './PlayerCell.js';
import FoodCell from './FoodCell.js';
import Colors from './Colors.js';

export default class Game {
	players = [];
	foods = [];
	width;
	height;

	constructor(width, height) {
		this.width = width;
		this.height = height;

		for (let i = 0; i < 1000; i++) {
			this.foods.push(
				new FoodCell(
					Math.random() * this.width - this.width / 2,
					Math.random() * this.height - this.height / 2
				)
			);
		}
	}

	join(socketId) {
		this.players.push(
			new PlayerCell(
				Math.random() * this.width - this.width / 2,
				Math.random() * this.height - this.height / 2,
				Colors.randomColor(),
				10,
				socketId
			)
		);
	}

	death(playerId) {
		const idx = this.players.indexOf(
			this.players.find(player => player.socketId == playerId)
		);
		this.players.splice(idx, 1);
	}

	update() {
		this.players.forEach(player => {
			player.update();
			this.foods.forEach((f, idx) => {
				if (player.canEatCell(f)) {
					this.foods.splice(idx, 1);
				}
			});
			this.players.forEach(other => {
				if (player.canEatCell(other)) {
					this.death(other.socketId);
				}
			});
		});
	}

	setDirection(socketId, x, y) {
		const p = this.players.find(p => p.socketId == socketId);
		p.setDirection(x, y);
	}
}
