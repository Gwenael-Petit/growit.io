import TopTenPlayer from './TopTenPlayer';
import {
	AllowConnectionMessage,
	UpdateGameMessage,
	DirectionMessage,
	PlayerJoinMessage,
	PlayerDeathMessage,
} from './socketMessages';

export interface ServerToClientsEvents {
	allowConnection: (size: AllowConnectionMessage) => void;
	joined: () => void;
	dead: (message: PlayerDeathMessage) => void;
	updateGame: (game: UpdateGameMessage) => void;
	topTen: (topTen: TopTenPlayer[]) => void;
}

export interface ClientToServerEvents {
	join: (join: PlayerJoinMessage) => void;
	setDirection: (direction: DirectionMessage) => void;
	getTopTen: () => void;
}
