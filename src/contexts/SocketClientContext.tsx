import {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { connect, io } from 'socket.io-client';
import {
  ChatSocket,
  IMessage,
  IMessenger,
  IRoom,
  IUser,
  ServerToClientEvents,
  TSuccesses,
} from '../../types';

interface ISocketClientContext {
  me: IUser;
  addUser: (name: string) => void;
  rooms: IRoom[];
  users: IUser[];
  sendMessage: (message: IMessage) => void;
  messageReceived: IMessage | null;
  messagesReceived: IMessage[];
  activeRoom: IMessenger;
  setActiveRoom: (room: IMessenger) => void;
}

const initialContext: ISocketClientContext = {
  me: {
    name: '',
    uuid: '',
    connected: false,
    type: 'User',
  },
  addUser: (name) => {
    console.log('Not implemented');
  },
  rooms: [],
  users: [],
  sendMessage: (name) => {
    console.log('Not implemented');
  },
  messageReceived: null,
  messagesReceived: [],
  activeRoom: {
    name: '',
    uuid: '',
    type: 'Room',
  },
  setActiveRoom: (room) => {
    console.log('Not implemented');
  },
};

const SocketClientContext = createContext(initialContext);

export const useSocket = () => useContext(SocketClientContext);

interface ISocketClientContextProviderProps {
  children: React.ReactNode;
}

type TListener = {
  [key in keyof ServerToClientEvents]: () => void;
};

export const SocketClientContextProvider = ({
  children,
}: ISocketClientContextProviderProps): JSX.Element => {
  const [connected, setConnected] = useState(false);
  const [me, setMe] = useState<IUser>(initialContext.me);
  const [rooms, setRooms] = useState<IRoom[]>(initialContext.rooms);
  const [activeRoom, setActiveRoom] = useState<IMessenger>(
    initialContext.activeRoom
  );
  const [users, setUsers] = useState<IUser[]>(initialContext.users);
  const [messageReceived, setMessageReceived] = useState<IMessage | null>(null);
  const [messagesReceived, setMessagesReceived] = useState<IMessage[]>([]);
  const socketRef = useRef<ChatSocket>();

  const addUser = useCallback((name: string) => {
    socketRef.current?.emit('addUser', name);
  }, []);

  const sendMessage = useCallback((message: IMessage) => {
    socketRef.current?.emit('sendMessage', message);
  }, []);

  // const joinRoom = useCallback((messenger: IMessenger) => {
  //   socketRef.current?.emit('joinRoom', messenger);
  // }, []);

  const fetchPublicMessages = useCallback((messenger: IMessenger) => {
    socketRef.current?.emit('fetchMessagesTo', messenger, (messages) => {
      console.log('Fetched new messages to ' + messenger.name);
      setMessagesReceived(messages);

      // console.log(messages);
    });
  }, []);

  const fetchPrivateMessages = useCallback(
    (messenger1: IMessenger, messenger2: IMessenger) => {
      socketRef.current?.emit(
        'fetchMessagesBetween',
        messenger1,
        messenger2,
        (messages) => {
          console.log(
            'Fetched new messages between ' +
              messenger1.name +
              ' and ' +
              messenger2.name
          );
          setMessagesReceived(messages);

          // console.log(messages);
        }
      );
    },
    []
  );

  const onAnyListener = useCallback((event: any, args: any[]) => {
    console.log(event, args);
  }, []);

  const onPushConnectedListener = useCallback((message: TSuccesses) => {
    setConnected(true);
  }, []);

  const onPushSessionListener = useCallback(
    (sessionId: string, user: IUser) => {
      setMe(user);
    },
    []
  );
  const onPushMessageListener = useCallback((message: IMessage) => {
    setMessageReceived(message);
  }, []);

  const onPushUsersListener = useCallback((users: IUser[]) => {
    setUsers(users);
  }, []);

  const onPushRoomsListener = useCallback((rooms: IRoom[]) => {
    setRooms(rooms);
  }, []);

  useEffect(() => {
    // First we connect to the server
    const URL = 'http://localhost:4000'; // TODO: This needs to be updated for production
    console.log('Connecting to ' + URL);
    socketRef.current = io(URL);

    // Then we try to initialize all the listeners.
    socketRef.current?.onAny(onAnyListener);
    socketRef.current?.on('pushConnected', onPushConnectedListener);
    socketRef.current?.on('pushSession', onPushSessionListener);
    socketRef.current?.on('pushRooms', onPushRoomsListener);
    socketRef.current?.on('pushUsers', onPushUsersListener);
    socketRef.current?.on('pushMessage', onPushMessageListener);

    // Then we check if there is a session to restore
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      console.log('No sessionId found, waiting for user...');
    } else {
      console.log('Found sessionId in localStorage to be ' + sessionId);
    }

    return () => {
      socketRef.current?.offAny(onAnyListener);
      socketRef.current?.off('pushConnected', onPushConnectedListener);
      socketRef.current?.off('pushSession', onPushSessionListener);
      socketRef.current?.off('pushRooms', onPushRoomsListener);
      socketRef.current?.off('pushUsers', onPushUsersListener);
      socketRef.current?.off('pushMessage', onPushMessageListener);
    };
  }, []);

  useEffect(() => {
    console.log('Server is connected: ' + connected);
  }, [connected]);

  useEffect(() => {
    if (activeRoom.uuid) {
      const isPrivateRoom = activeRoom.type === 'User';

      // If the room is a private chat, then we need to fetch all messages between this user and the sender
      isPrivateRoom && fetchPrivateMessages(activeRoom, me);

      // If not, then we fetch all messages for the room
      !isPrivateRoom && fetchPublicMessages(activeRoom);

      // joinRoom(activeRoom);
    }
  }, [activeRoom]);

  return (
    <SocketClientContext.Provider
      value={{
        me,
        addUser,
        rooms,
        users,
        sendMessage,
        messageReceived,
        messagesReceived,
        activeRoom,
        setActiveRoom,
      }}
    >
      {children}
    </SocketClientContext.Provider>
  );
};
