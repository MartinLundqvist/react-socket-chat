import { IMessage, IMessenger, IUser, ServerIO, ServerSocket } from '../types';
import { nanoid } from 'nanoid';
import { SessionStore, Store } from './in-memory-store';

/**
 * This class allows client to:
 * - "connect", and provide a SessionId OR user name to the server - which in turn allows the server to restore a session that might have been lost.
 *    If there is no SessionID provided (nullish) the server will assume this is a new user and establish a fresh SessionID and User object based on the username.
 *    //TODO: This is flawed, since it does not allow an existing user to reappear with a new browser instance and get back the history.
 *            That's a problem for a different project, though
 *    //TODO: This should be refactored into a middleware on the IO Server. Check notes in GDrive.
 * - "joinRoom", and provide a RoomID. The server will check whether the room allows to join, and execute a callBack with true or false
 * - "sendRoomMessage", and provide a RoomID which sends a message.
 * - "sendPrivateMessage", and provide a UserID which sends a message.
 * - "leaveRoom", and provide a RoomID which removes the user from the room
 * - "disconnect", which updates the user 'connected' state to 'false'
 *
 * This class allows the server to:
 *  - Keep a reference to the global Store (in memory for now) so that session state can be updated
 *  - "pushUsers" and broadcast the list of users from the store
 *  - "pushPrivateMessage" and send a message object (from one UserID to another UserID)
 *  - "pushRoomMessage" and send a message object (from one UserID to a RoomID)
 *  - "pushRoomUsers" and send a list of users who are in that room
 *
 * Implementation details
 *   - In order to keep the User information private, it should not be stored in the LocalStorage on the web browser. Hence, the SessionID
 *     is used. It is stored in localstorage and added to the socket.auth attribute upon connection. The Server then resolves it
 */

export class IOCOnnection {
  // These are references to objects scoped globally
  private sessions: SessionStore;
  private store: Store;

  // These are references to the connection's IO and Socket instances
  private io: ServerIO;
  private socket: ServerSocket;

  // These are local variables to the instance of this IOConnection
  private user: IUser;
  private sessionId: string;

  constructor(
    io: ServerIO,
    socket: ServerSocket,
    store: Store,
    sessions: SessionStore
  ) {
    // Initialize variables with references and temporary values
    this.io = io;
    this.socket = socket;
    this.store = store;
    this.sessions = sessions;
    this.sessionId = '';
    this.user = {
      name: '',
      uuid: '',
      connected: true,
      type: 'User',
    };

    console.log('New connection identified - socket ID is' + this.socket.id);

    // Tell client it's connected successfully
    socket.emit('pushConnected', 'Connected');

    //

    // // The client should EITHER connect with a sessionId OR with a name - never both!
    // // TODO: This is prone to bad DX...
    // const { sessionId, name } = socket.handshake.auth;

    // // If there is a sessionId, then recreate the session
    // if (sessionId) {
    //   console.log('Found sessionId' + sessionId);
    //   const user = this.sessions.getSession(sessionId);
    //   if (!user) {
    //     this.socket.emit('error', 'User not found');
    //     // TODO: Not sure if this is a particular graceful exit...
    //     this.socket.disconnect();
    //     return;
    //   }
    //   this.user = user;
    //   this.sessionId = sessionId;
    // }

    // // If there is a name, then we will create a new session with the new user
    // if (name) {
    //   console.log('Found new user ' + name);
    //   this.sessionId = nanoid();

    //   this.user = {
    //     name,
    //     uuid: nanoid(),
    //   };

    //   // Let's store the new sessions
    //   this.sessions.saveSession(this.sessionId, this.user);
    // }

    // // Emit the session detail to the client for local storage
    // this.socket.emit('pushSession', this.sessionId, this.user);

    // // Make sure the user has access to their private space
    // this.socket.join(this.user.uuid);

    // // Add the user to the list of users and mark it as connected
    // this.store.addUser(this.user);

    // // Emit the updated list of users to the client
    // this.socket.emit('pushUsers', this.store.getUsers());

    /* Start event listeners */
    this.socket.on('addUser', (name) => this.addUser(name));

    // this.socket.on('joinRoom', (room) => this.joinRoom(room.uuid));
    this.socket.on('sendMessage', (message) => this.sendMessage(message));
    this.socket.on('disconnect', async (reason) => this.disconnect(reason));
    this.socket.on('fetchMessagesTo', (messenger, callback) =>
      this.fetchMessages(messenger, callback)
    );
    this.socket.on('fetchMessagesBetween', (messenger1, messenger2, callback) =>
      this.fetchMessagesBetween(messenger1, messenger2, callback)
    );
    this.socket.on('joinRoom', (room) => this.joinRoom(room));
  }

  private fetchMessages(
    messenger: IMessenger,
    callback: (messages: IMessage[]) => void
  ) {
    callback(this.store.getMessagesTo(messenger));
  }
  private fetchMessagesBetween(
    messenger1: IMessenger,
    messenger2: IMessenger,
    callback: (messages: IMessage[]) => void
  ) {
    callback(this.store.getMessagesBetween(messenger1, messenger2));
  }

  private addUser(name: string) {
    // New user coming in, first we initialize it

    this.user = {
      name,
      uuid: nanoid(),
      connected: true,
      type: 'User',
    };

    // Let's store the new session
    this.sessions.saveSession(this.sessionId, this.user);

    // Emit the session detail to the client for local storage
    this.socket.emit('pushSession', this.sessionId, this.user);

    // Create a private Rooom for the user
    this.socket.join(this.user.uuid);

    // Also, add the user to all public rooms
    this.store.getRooms().forEach((room) => {
      this.joinRoom(room);
    });

    // Add the user to the list of users and mark it as connected
    this.store.addUser(this.user);

    // Broadcast the updated list of users to the client
    this.io.emit('pushUsers', this.store.getUsers());

    // Emit the list of rooms to the client
    this.socket.emit('pushRooms', this.store.getRooms());
  }

  private joinRoom(room: IMessenger) {
    console.log('Joining room ' + room.name);
    this.socket.join(room.uuid);
    this.store.addUserToRoom(this.user, room);
  }

  private sendMessage(message: IMessage) {
    console.log('Sending message ' + JSON.stringify(message));
    this.store.saveMessage(message);

    const { to, from } = message;

    // this.socket.emit('pushMessage', message);
    // this.io.to(this.user.uuid).emit('pushMessage', message);

    this.io.to(to.uuid).to(from.uuid).emit('pushMessage', message);
  }

  private async disconnect(reason: string) {
    console.log('User disconnected ' + this.user.name);

    // Disconnect the user from the store
    this.store.markUserOffline(this.user);

    // Publish the updated user list
    this.io.emit('pushUsers', this.store.getUsers());
  }
}
