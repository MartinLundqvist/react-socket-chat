import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IMessage, IMessenger, IRoom, IUser } from '../../types';
import { messageIsBetween, messageIsTo } from '../utils';
import { useSocket } from './SocketClientContext';

interface IChatContext {
  me: IUser;
  users: IUser[];
  rooms: IRoom[];
  activeRoom: IMessenger;
  setActiveRoom: (room: IMessenger) => void;
  activeMessages: IMessage[];
  sendMessage: (message: IMessage) => void;
  login: (sessionId: string) => void;
  addNewUser: (userName: string) => void;
}

const initialContext: IChatContext = {
  me: {
    name: 'The King',
    uuid: 'as3er',
    connected: false,
    type: 'User',
  },
  users: [],
  rooms: [],
  activeRoom: {
    name: 'General',
    uuid: 'a',
    type: 'Room',
  },
  setActiveRoom: (room) => {
    console.log('Not implemented');
  },
  activeMessages: [],
  sendMessage: (message) => {
    console.log('Not implemented');
  },
  login: (sessionId) => {
    console.log('Not implemented');
  },
  addNewUser: (userName) => {
    console.log('Not implemented');
  },
};

const ChatContext = createContext(initialContext);

export const useChat = () => useContext(ChatContext);

interface IChatContextProvider {
  children: React.ReactNode;
}

export const ChatContextProvider = ({
  children,
}: IChatContextProvider): JSX.Element => {
  const {
    me,
    addUser,
    rooms,
    users,
    sendMessage,
    messageReceived,
    activeRoom,
    setActiveRoom,
    messagesReceived,
  } = useSocket();

  const [activeMessages, setActiveMessages] = useState<IMessage[]>(
    initialContext.activeMessages
  );

  useEffect(() => {
    // This useEffect deals with LIVE, incoming messages that are emitted by the "pushMessage" event.
    // Therefore, we cannot rely on the server to sort out whether we are in a public or private chat room
    // We need to take care of that sorting in here

    const refreshMessages = () => {
      if (activeRoom.type === 'User') {
        // If we are in a private room, only show the messages between me and the active user room
        if (messageIsBetween(messageReceived!, me, activeRoom))
          setActiveMessages((activeMessages) => [
            ...activeMessages,
            messageReceived!,
          ]);
      } else {
        // Else only show the messages which a are intended for the room
        if (messageIsTo(messageReceived!, activeRoom))
          setActiveMessages((activeMessages) => [
            ...activeMessages,
            messageReceived!,
          ]);
      }
    };

    messageReceived && refreshMessages();
  }, [messageReceived]);

  useEffect(() => {
    // This useEffect deals with refreshing of PERSISTED messages coming in from the server whenever the activeRoom is changed.
    // In this case, our SocketClientContext will specifically ask for private or public messages to be refreshed.
    // Hence, we do not need to worry about sorting here
    setActiveMessages(messagesReceived);
  }, [activeRoom, messagesReceived]);

  const login = async (sessionId: string) => {
    console.log('Logging in with sessionid ' + sessionId);
  };

  const addNewUser = async (userName: string) => {
    console.log('Adding new user ' + userName);
    addUser(userName);
  };

  return (
    <ChatContext.Provider
      value={{
        me,
        users,
        rooms,
        activeRoom,
        setActiveRoom,
        activeMessages,
        sendMessage,
        login,
        addNewUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
