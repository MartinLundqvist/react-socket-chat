import { useEffect } from 'react';
import styled from 'styled-components';
import { IMessenger } from '../../types';
import { useChat } from '../contexts/ChatContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 1rem;
  padding: 2rem;
  grid-column: 1 / 2;
  grid-rows: 2 / -1;
  border-radius: 50px;
  background: #e0e0e0;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  overflow-y: scroll;
`;

const RoomLink = styled.div`
  font-size: 1.25rem;

  &:hover {
    cursor: pointer;
  }

  &.active {
    animation: animate 1s ease-in-out infinite;
  }

  @keyframes animate {
    0% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(0.9);
    }
  }
`;

const Rooms = (): JSX.Element => {
  const { rooms, users, activeRoom, setActiveRoom, me } = useChat();

  useEffect(() => {
    if (rooms.length > 0) setActiveRoom(rooms[0]);
  }, [rooms]);

  const changeRoom = (room: IMessenger) => {
    console.log('Changing to room: ' + room.name);
    setActiveRoom(room);
  };

  return (
    <Wrapper>
      <div>Rooms</div>
      {rooms.map((room) => (
        <RoomLink
          className={activeRoom.uuid === room.uuid ? 'active' : ''}
          key={room.uuid}
          onClick={() => changeRoom(room)}
        >
          {room.name}
        </RoomLink>
      ))}
      <div>Knights</div>
      {users
        .filter((user) => user.uuid !== me.uuid)
        .map((room) => (
          <RoomLink
            className={activeRoom.uuid === room.uuid ? 'active' : ''}
            key={room.uuid}
            onClick={() => changeRoom(room)}
          >
            {room.name} ({room.connected ? 'Online' : 'Offline'})
          </RoomLink>
        ))}
    </Wrapper>
  );
};

export default Rooms;
