import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { ChatSocket, IUser } from '../types';
import './App.css';

function App() {
  /**
   * First check if there is a valid session
   * - if yes: skip right to the chat
   * - if no: ask for a user name, and then jump to the chat
   */

  const socketRef = useRef<ChatSocket>();
  const [name, setName] = useState('');
  const [user, setUser] = useState<IUser>();
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    console.log('SessionId is ' + sessionId);
    const URL = 'http://localhost:4000'; // TODO: This needs to be updated for production
    socketRef.current = io(URL, { autoConnect: false });

    if (sessionId) {
      socketRef.current.auth = { sessionId };
      socketRef.current.connect();
      setConnected(true);
    }
  }, []);

  const newUser = () => {
    if (socketRef.current) {
      socketRef.current.auth = { name };
      socketRef.current.connect();
      setConnected(true);
    } else {
      console.log('Socket not initialized');
    }
  };

  useEffect(() => {
    const initListeners = () => {
      socketRef.current?.on('error', (error) => {
        // If the server responds with user not found, the sessionId is likely expired or wrong
        if (error === 'User not found') {
          localStorage.removeItem('sessionId');
          setConnected(false);
        }
      });
      socketRef.current?.on('pushSession', (sessionId, user) => {
        localStorage.setItem('sessionId', sessionId);
        setUser(user);
      });
      socketRef.current?.on('pushUsers', (users) => setUsers(users));

      // Debug..
      socketRef.current?.onAny((event, ...args) => {
        console.log(event, args);
      });
    };

    connected && socketRef.current && initListeners();

    return () => {
      socketRef.current?.removeAllListeners('pushUsers');
      socketRef.current?.removeAllListeners('pushSession');
      socketRef.current?.removeAllListeners('error');
    };
  }, [connected]);

  return (
    <div className='App'>
      {!connected ? (
        <>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={newUser}>Add</button>
        </>
      ) : (
        <>
          <h1>Welcome {user?.name}!</h1>
          <ul>
            {users.map((usr) => (
              <li key={usr.uuid}>
                {usr.name} ({usr.connected ? 'online' : 'offline'}){' '}
                {usr.uuid === user?.uuid && '(you)'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
