export type TMessengers = 'User' | 'Room';

export interface IMessenger {
  name: string;
  uuid: string;
  type: TMessengers;
}

export interface IRoom extends IMessenger {
  max_users?: number;
  userIds: Set<string>; // This will refer to the user ID
  // messages: IMessage[];
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
