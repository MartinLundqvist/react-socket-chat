import { IUser, IRoom, IMessage } from '../types';

export interface ServerToClientEvents {
  // Server sends current list of users
  pushUsers: (users: IUser[]) => void;

  // Server sends current list of rooms
  pushRooms: (rooms: IRoom[]) => void;

  // Server sends messages for a specific room or private chat
  pushMessage: (message: IMessage) => void;
}

export interface ClientToServerEvents {
  // Client adds a new user to the server
  addUser: (user: IUser) => void;

  //  Client sends a message to a user or room
  sendMessage: (message: IMessage) => void;

  // Client asks to join a room. The server will respond back with a true (joined) or false (room is full)
  joinRoom: (roomId: string) => void;
}
