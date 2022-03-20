import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IMessage } from '../../types';
import { useChat } from '../contexts/ChatContext';
import Message from './Message';

const Wrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  justify-content: end;
  align-items: start;
  padding: 2rem;
  grid-column: 2 / -1;
  grid-rows: 2 / -1;
`;

const Chat = (): JSX.Element => {
  const { activeMessages, activeRoom } = useChat();
  // const [messagesToShow, setMessagesToShow] = useState<IMessage[]>();

  return (
    <Wrapper>
      {activeMessages.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}
    </Wrapper>
  );
};

export default Chat;
