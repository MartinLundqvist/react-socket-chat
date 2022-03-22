import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IMessage } from '../../types';
import { useChat } from '../contexts/ChatContext';
import Message from './Message';

const Wrapper = styled.div`
  display: flex;
  /* height: 100%; */
  gap: 0.8rem;
  flex-direction: column;
  /* justify-content: end; */
  align-items: start;
  padding: 2rem;
  grid-area: chat;
  overflow-y: scroll;
  /* overflow-x: visible; */
  background-color: none;
`;

const Chat = (): JSX.Element => {
  const { activeMessages } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [activeMessages]);

  return (
    <Wrapper>
      {activeMessages.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}
      <div ref={endOfMessagesRef} />
    </Wrapper>
  );
};

export default Chat;
