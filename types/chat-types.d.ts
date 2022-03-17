export interface IMessenger {
  name: string;
  uuid: string;
}

export interface IRoom extends IMessenger {
  max_users: number;
  users: IUser[];
  messages: IMessage[];
}

export interface IUser extends IMessenger {
  connected?: boolean;
}

export interface IMessage {
  content: string;
  from: IUser;
  to: IMessenger; // Room or User
  time: number; // Datetime in epoc UTC format (ms)
}
