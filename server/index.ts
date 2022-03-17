import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { IOCOnnection } from './io-connection';
import { SessionStore, Store } from './in-memory-store';
import { ServerIO } from '../types';

// Initialize the global stores
const store = new Store();
const sessions = new SessionStore();

// Set up the express app
const app = express();

// If in production mode, serve up the front-end
if (process.env.NODE_ENV === 'production') {
  const cwd = process.cwd();
  app.use('/assets', express.static(path.join(cwd, 'dist/assets/')));
  app.get('*', (req, res) => res.sendFile(path.join(cwd, 'dist/index.html')));
}

// Set up the HTTP Server and connect it to the express app
const httpServer = createServer(app);
const io = new Server<ServerIO>(httpServer, {
  cors: {
    origin: '*', // TODO: Review whether this is really a good idea...
  },
});

// Listen for connections to the socket, and create an IOConnection object for each connection
io.on('connection', (socket) => {
  new IOCOnnection(io, socket, store, sessions);
});

// Start the server
const PORT = process.env.PORT || '4000';
httpServer.listen(PORT, () => {
  console.log('Server started on port ' + PORT.toString());
  console.log(process.cwd());
});
