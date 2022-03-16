export interface IRoom {
  name: string;
  uuid: string;
  max_users: number;
  users: IUser[];
  state: {
    messages: IMessage[];
  };
}

export interface IUser {
  name: string;
  uuid: string;
  connected?: boolean;
}

export interface IMessage {
  content: string;
  from: IUser;
  to: string; // RoomID or user ID
  time: number; // Datetime in epoc UTC format (ms)
}
