import { Server, Socket } from 'socket.io';
import { Socket as ClientSocket } from 'socket.io-client';
import { IUser, IRoom, IMessage } from '../types';

export type TErrors = 'User not found' | 'Other';

export interface ServerToClientEvents {
  // Server sends the current session and user information
  pushSession: (sessionId: string, user: IUser) => void;

  // Server sends current list of users
  pushUsers: (users: IUser[]) => void;

  // Server sends current list of rooms
  pushRooms: (rooms: IRoom[]) => void;

  // Server sends messages for a specific room or private chat
  pushMessage: (message: IMessage) => void;

  // Server sends an error
  error: (error: TErrors) => void;
}

export interface ClientToServerEvents {
  // Client adds a new user to the server
  addUser: (user: IUser) => void;

  //  Client sends a message to a user or room
  sendMessage: (message: IMessage) => void;

  // Client asks to join a room. The server will respond back with a true (joined) or false (room is full)
  joinRoom: (room: IRoom) => void;
}

export interface InterServerEvents {}

export interface SocketData {}

export type ServerIO = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type ServerSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type ChatSocket = ClientSocket<
  ServerToClientEvents,
  ClientToServerEvents
>;
