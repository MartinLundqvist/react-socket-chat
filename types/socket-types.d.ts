import { Server, Socket } from 'socket.io';
import { Socket as ClientSocket } from 'socket.io-client';
import { IUser, IRoom, IMessage, IMessenger } from '../types';

export type TErrors = 'User not found' | 'Other';
export type TSuccesses = 'Connected';

export interface ServerToClientEvents {
  // Server acknowledges connection
  pushConnected: (message: TSuccesses) => void;

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
  addUser: (name: string) => void;

  //  Client sends a message to a user or room
  sendMessage: (message: IMessage) => void;

  // Client asks to join a room. The server will respond back with a true (joined) or false (room is full)
  joinRoom: (room: IMessenger) => void;

  // Client asks for all messages to a particular Messenger (room or user), the server calls back with the list
  fetchMessagesTo: (
    messenger: IMessenger,
    callback: (messages: IMessage[]) => void
  ) => void;

  // Client asks for all messages between two messengers (rooms or users), the server calls back with the list
  fetchMessagesBetween: (
    messenger1: IMessenger,
    messenger2: IMessenger,
    callback: (messages: IMessage[]) => void
  ) => void;
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
