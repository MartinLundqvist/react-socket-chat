import { useEffect } from 'react';
import styled from 'styled-components';
import { IMessenger } from '../../types';
import { useChat } from '../contexts/ChatContext';
import { Shadows } from './Mixins';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 1rem;
  padding: 2rem;
  grid-area: rooms;
  ${Shadows}
  overflow-y: scroll;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: flex-start;
    padding: 0 2rem 0 2rem;
    overflow-x: scroll;

    div {
      flex-grow: 1;
      flex-shrink: 0;
    }
  }
`;

const RoomLink = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  font-size: var(--size-font);

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
            {room.name}({room.connected ? 'Online' : 'Offline'})
          </RoomLink>
        ))}
    </Wrapper>
  );
};

export default Rooms;
