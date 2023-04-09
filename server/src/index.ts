import http from 'http';
import express, { json } from 'express';
import fs from 'fs';
import addWebpackMiddleware from './addWebpackMiddleware';
import { Server as IOServer } from 'socket.io';
import Game from './Game';
import {
	ClientToServerEvents,
	ServerToClientsEvents,
} from '../../common/socketInterfaces';

const app = express();

addWebpackMiddleware(app);

const httpServer = http.createServer(app);

const io = new IOServer<ClientToServerEvents, ServerToClientsEvents>(
	httpServer
);

const topTenFile: string = 'topTen.json';

if (!fs.existsSync(topTenFile)) {
	console.log(`Création du fichier ${topTenFile}...`);
	fs.appendFileSync(topTenFile, '[]');
}

const game = new Game(500, 500, topTenFile);

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
	socket.emit('allowConnection', {
		width: Game.width,
		height: Game.height,
	});

	socket.on('disconnect', () => {
		console.log(`Déconnection du client ${socket.id}`);
		game.disconnect(socket.id);
	});

	socket.on('join', msg => {
		if (game.join(socket.id, msg.name, msg.color)) socket.emit('joined');
	});

	socket.on('getTopTen', () => {
		socket.emit('topTen', game.topTen);
	});

	socket.on('setDirection', direction => {
		game.setDirection(direction.socketId, direction.x, direction.y);
	});
});

app.use(express.static('client/public'));

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

setInterval(() => {
	for (let i = game.deadQueue.length - 1; i >= 0; i--) {
		io.sockets.sockets
			.get(game.deadQueue[i].socketId)
			?.emit('dead', game.deadQueue[i]);
		game.deadQueue.splice(i, 1);
	}

	game.update();

	io.emit('updateGame', {
		players: game.players,
		foods: game.foods,
	});
}, 1000 / 60);

setInterval(() => {
	game.respawnFood();
}, 5000);
