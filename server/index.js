import http from 'http';
import express from 'express';
import fs from 'fs';
import addWebpackMiddleware from './addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
//import expressStatusMonitor from 'express-status-monitor';

const app = express();

addWebpackMiddleware(app);

const httpServer = http.createServer(app);

const io = new IOServer(httpServer, {
	//allowEIO3: true,
});

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
});

app.use(express.static('client/public'));
//app.use(expressStatusMonitor({ websocket: io }));

httpServer.listen(process.env.PORT, () => {
	console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
