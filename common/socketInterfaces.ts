import {
	AllowConnectionMessage,
	UpdateGameMessage,
	DirectionMessage,
	PlayerJoinMessage,
} from './socketMessages';

export interface ServerToClientsEvents {
	allowConnection: (size: AllowConnectionMessage) => void;
	joined: () => void;
	dead: () => void;
	updateGame: (game: UpdateGameMessage) => void;
}

export interface ClientToServerEvents {
	join: (join: PlayerJoinMessage) => void;
	setDirection: (direction: DirectionMessage) => void;
	getLeaderboard: () => void;
}
