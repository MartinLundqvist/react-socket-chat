import { IMessage, IRoom, IUser } from '../types';

export class SessionStore {
  private sessions: Map<string, string>;

  constructor() {
    this.sessions = new Map();
  }
}

export class Store {
  private rooms: IRoom[];
  private users: IUser[];

  constructor() {
    this.rooms = [];
    this.users = [];
  }

  public addUser(user: IUser) {
    this.users.push(user);
    console.log(this.users);
  }

  public getUsers(): IUser[] {
    return [...this.users];
  }

  public addRoom(room: IRoom) {
    this.rooms.push(room);

    console.log(this.rooms);
  }

  addMessageToRoom(roomId: string, message: IMessage) {
    const targetRoom = this.rooms.find((room) => room.uuid === roomId);
    targetRoom && targetRoom.state.messages.push(message);
  }

  public removeUser(user: IUser) {
    this.users = this.users.filter((usr) => usr.uuid !== user.uuid);
  }

  public removeRoom(roomId: string) {
    this.rooms = this.rooms.filter((rm) => rm.uuid !== roomId);
  }
}

interface InMemoryStore {
  sessions: Map<string, string>;
  rooms: IRoom[];
  users: IUser[];
}

const store: InMemoryStore = {
  sessions: new Map<string, string>(),
  rooms: [],
  users: [],
};

export { store };
