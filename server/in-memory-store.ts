import { IMessage, IRoom, IUser } from '../types';

export class SessionStore {
  private sessions: Map<string, IUser>;

  constructor() {
    this.sessions = new Map();
  }

  public saveSession(sessionId: string, user: IUser) {
    this.sessions.set(sessionId, user);
  }

  public getSession(sessionId: string): IUser | undefined {
    return this.sessions.get(sessionId);
  }

  public removeSession(sessionId: string) {
    return this.sessions.delete(sessionId);
  }
}

export class Store {
  private rooms: Map<string, IRoom>;
  private users: Map<string, IUser>;

  constructor() {
    this.rooms = new Map();
    this.users = new Map();
  }

  public addUser(user: IUser) {
    this.users.set(user.uuid, { ...user, connected: true });
    console.log(this.users);
  }

  public getUsers(): IUser[] {
    return [...this.users.values()];
  }

  public getRooms(): IRoom[] {
    return [...this.rooms.values()];
  }

  public addRoom(room: IRoom) {
    this.rooms.set(room.uuid, room);

    console.log(this.rooms);
  }

  public addMessageToRoom(roomId: string, message: IMessage) {
    const targetRoom = this.rooms.get(roomId);
    targetRoom && targetRoom.messages.push(message);
  }

  public removeUser(user: IUser) {
    this.users.delete(user.uuid);
  }

  public markUserOffline(user: IUser) {
    this.users.set(user.uuid, { ...user, connected: false });
  }

  public removeRoom(room: IRoom) {
    this.rooms.delete(room.uuid);
  }
}
