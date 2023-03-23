import PlayerCell from './PlayerCell.js';

export default class Game {
	players = new Map();
	foods = [];
	width;
	height;

	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	join(playerId) {
		this.players.set(
			playerId,
			new PlayerCell(
				Math.random() * this.width - this.width / 2,
				Math.random() * this.height - this.height / 2,
				10
			)
		);
	}

	death(playerId) {
		this.players.delete(playerId);
	}

	update() {
		this.players.forEach((value, key) => {
			value.update();
		});
	}
}
