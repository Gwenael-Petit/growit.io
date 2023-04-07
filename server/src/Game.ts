import PlayerCell from './PlayerCell';
import FoodCell from './FoodCell';
import Colors from './Colors';

export default class Game {
	static defaultPlayerSize: number = 10;
	players: PlayerCell[] = [];
	deadQueue: PlayerCell[] = [];
	foods: FoodCell[] = [];
	static width: number = 100;
	static height: number = 100;
	maxFoods: number = 1000;

	constructor(width: number, height: number) {
		Game.width = width;
		Game.height = height;
	}

	respawnFood(): void {
		const toSpawn = this.maxFoods - this.foods.length;
		for (let i = 0; i < toSpawn; i++) {
			this.spawnFood();
		}
	}

	spawnFood(): void {
		this.foods.push(
			new FoodCell(
				Math.random() * Game.width - Game.width / 2,
				Math.random() * Game.height - Game.height / 2
			)
		);
	}

	join(socketId: string, name: string, color: string): boolean {
		if (this.players.find(p => p.socketId == socketId) != undefined)
			return false;
		this.players.push(
			new PlayerCell(
				Math.random() * Game.width - Game.width / 2,
				Math.random() * Game.height - Game.height / 2,
				color,
				Game.defaultPlayerSize,
				socketId,
				name
			)
		);
		return true;
	}

	disconnect(socketId: string): void {
		const idx = this.players.findIndex(player => player.socketId == socketId);
		if (idx >= 0) this.players.splice(idx, 1);
	}

	update(): void {
		this.players.forEach(player => {
			player.update();
			for (let i = this.foods.length - 1; i >= 0; i--) {
				if (player.canEatCell(this.foods[i])) {
					this.foods.splice(i, 1);
				}
			}
		});
		for (let i = this.players.length - 1; i >= 0; i--) {
			const player = this.players[i];
			for (const other of this.players) {
				if (
					player.socketId != other.socketId &&
					player.vulnerable &&
					other.canEatCell(player)
				) {
					this.deadQueue.push(player);
					player.deathTimeStamp = new Date().getTime();
					player.score -= Game.defaultPlayerSize;
					this.players.splice(i, 1);
					break;
				}
			}
		}
	}

	setDirection(socketId: string, x: number, y: number): void {
		const p = this.players.find(p => p.socketId == socketId);
		if (p != undefined) p.setDirection(x, y);
	}
}
