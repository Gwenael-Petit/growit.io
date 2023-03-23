import http from 'http';
import express from 'express';
import fs from 'fs';
import addWebpackMiddleware from './addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Game from './Game.js';

const app = express();

addWebpackMiddleware(app);

const httpServer = http.createServer(app);

const io = new IOServer(httpServer);

const game = new Game(4000, 4000);

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.emit('connected', '');

	socket.on('disconnect', reason => {});

	socket.on('join', data => {
		game.join(socket.id);
	});

	socket.on('getLeaderboard', () => {});

	socket.on('setPosition', data => {});
});

app.use(express.static('client/public'));

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
