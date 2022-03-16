import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  IMessage,
  IUser,
  ServerToClientEvents,
} from '../types';
import { nanoid } from 'nanoid';
import { Store } from './in-memory-store';

export class IOCOnnection {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private socket: Socket<ClientToServerEvents, ServerToClientEvents>;
  private user: IUser;
  private store: Store;

  constructor(
    io: Server<ClientToServerEvents, ServerToClientEvents>,
    socket: Socket<ClientToServerEvents, ServerToClientEvents>,
    store: Store
  ) {
    // Initialize variables with socket reference
    this.io = io;
    this.socket = socket;
    this.store = store;
    this.user = {
      name: '',
      uuid: '',
    };

    console.log('New connection identified - socket ID is' + this.socket.id);

    /* Start event listeners */
    // User joins server.
    this.socket.on('addUser', (user) => this.addUser(user));
    this.socket.on('joinRoom', (roomId) => this.joinRoom(roomId));
    this.socket.on('sendMessage', (message) => this.sendMessage(message));
    this.socket.on('disconnect', async (reason) => this.disconnect(reason));
  }

  private addUser(user: IUser) {
    // If this is a new user, create a unique ID and add to the user object
    if (!user.uuid) {
      user.uuid = nanoid();
    }

    console.log('Adding user ' + JSON.stringify(user, null, 2));

    // Join your own private room on the socket
    this.socket.join(user.uuid);

    // Create and join your own private room in the memory store
    this.store.addRoom({
      name: user.name,
      uuid: user.uuid,
      max_users: 2,
      users: [user],
      state: {
        messages: [],
      },
    });

    // Update the store
    this.store.addUser(user);

    // Update this userId
    this.user = user;

    // Broadcast the new list of users to everyone
    this.io.emit('pushUsers', this.store.getUsers());
  }

  private joinRoom(roomId: string) {
    console.log('Joining room ' + roomId);
  }

  private sendMessage(message: IMessage) {
    console.log('Sending message ' + message);

    const { to, from } = message;

    this.socket.to(to).to(from.uuid).emit('pushMessage', message);
  }

  private async disconnect(reason: string) {
    console.log('User disconnected ' + this.user.name);

    // Remove the user from the store
    this.store.removeUser(this.user);
    this.store.removeRoom(this.user.uuid);

    // Publish the updated user list
    this.io.emit('pushUsers', this.store.getUsers());
  }
}
