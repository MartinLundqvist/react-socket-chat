import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, IUser, ServerToClientEvents } from '../types';
import './App.css';

function App() {
  const socketRef =
    useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [user, setUser] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000'); // TODO: This needs to be updated for production
    socketRef.current.on('pushUsers', (users: IUser[]) => {
      setUsers(users);
    });
  }, []);

  const addUser = () => {
    const newUser: IUser = {
      name: user,
      uuid: '',
    };
    socketRef.current?.emit('addUser', newUser);
  };

  return (
    <div className='App'>
      <input
        type='text'
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <button onClick={addUser}>Add</button>
      <ul>
        {users.map((usr) => (
          <li key={usr.uuid}>{usr.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
