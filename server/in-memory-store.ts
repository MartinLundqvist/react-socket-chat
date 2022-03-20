import { IMessage, IMessenger, IRoom, IUser } from '../types';

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
  // Unique room identifiers mapped to room information.
  // Only changes when a user leaves or joins.
  private rooms: Map<string, IRoom>;

  // Unique user identifiers mapped to user information.
  // Only changes when a user is added / removed, or connection status changes
  private users: Map<string, IUser>;

  // Unique messenger identfiers (i.e., a room or a user) mapped to messages
  // This is where all messages are persisited, so it changes all the time
  private messages: IMessage[];

  constructor() {
    this.rooms = new Map();
    this.users = new Map();
    this.messages = [];
  }

  public addUser(user: IUser) {
    console.log('I am in Store.addUser with ' + user.name);
    this.users.set(user.uuid, { ...user, connected: true });
    // console.log(this.users);
  }

  public getUsers(): IUser[] {
    return [...this.users.values()];
  }

  public getRooms(): IRoom[] {
    return [...this.rooms.values()];
  }

  public addRoom(room: IRoom) {
    this.rooms.set(room.uuid, room);

    // console.log(this.rooms);
  }

  public saveMessage(message: IMessage) {
    message && this.messages.push(message);
  }

  // This first version returns all messages TO the provided messenger.
  public getMessagesTo(messenger: IMessenger): IMessage[] {
    let results = this.messages.filter(
      (message) => message.to.uuid === messenger.uuid
    );
    console.log('Found ' + results?.length + ' messages to ' + messenger.name);
    return results || [];
  }

  // This second version returns all messages between two messengers.
  public getMessagesBetween(
    messenger1: IMessenger,
    messenger2: IMessenger
  ): IMessage[] {
    let results = this.messages.filter((message) => {
      // Message is from messenger1 to messenger2
      if (
        message.from.uuid === messenger1.uuid &&
        message.to.uuid === messenger2.uuid
      )
        return true;
      // OR message is from messenger2 to messenger1
      if (
        message.from.uuid === messenger2.uuid &&
        message.to.uuid === messenger1.uuid
      )
        return true;

      // Else filter it out
      return false;
    });
    console.log(
      'Found ' +
        results?.length +
        ' messages between ' +
        messenger1.name +
        ' and ' +
        messenger2.name
    );
    return results || [];
  }

  public removeUser(user: IUser) {
    this.users.delete(user.uuid);
  }

  public markUserOffline(user: IUser) {
    // If the user doesn't exist, then skip this
    if (this.users.get(user.uuid)) {
      this.users.set(user.uuid, { ...user, connected: false });
    }
  }

  public removeRoom(room: IRoom) {
    this.rooms.delete(room.uuid);
  }

  // TODO: The adding / removing of useIds to a room does not have any effect currently
  public addUserToRoom(user: IUser, room: IMessenger) {
    let targetRoom = this.rooms.get(room.uuid);
    targetRoom?.userIds.add(user.uuid);
  }

  public removeUserFromRoom(user: IUser, room: IRoom) {
    let targetRoom = this.rooms.get(room.uuid);
    targetRoom?.userIds.delete(user.uuid);
  }
}
