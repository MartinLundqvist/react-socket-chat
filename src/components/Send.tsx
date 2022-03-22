import { useState } from 'react';
import styled from 'styled-components';
import { IMessage } from '../../types';
import { useChat } from '../contexts/ChatContext';
import { Shadows } from './Mixins';

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: start;
  align-items: center;
  padding: 0 2rem 0 2rem;
  grid-area: send;
  ${Shadows}
  font-size: var(--size-font);
`;

const Input = styled.input`
  border: none;
  /* outline: 1px solid red; */
  width: 100%;
  /* height: 100%; */
  background: transparent;
  font: inherit;
  font-size: var(--size-font);
  color: var(--color-text-send);
  border-bottom: 1px dashed;
  border-color: var(--color-text-send-alpha);

  &:focus {
    outline: none;
    border: none;
    border-bottom: 1px dashed black;
    border-color: var(--color-text-send);
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  border: none;
  border-radius: 100%;
  font: inherit;
  font-size: var(--size-font-large);
  color: var(--color-bg);
  background-color: var(--color-text);

  &:hover {
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

const Send = (): JSX.Element => {
  const [message, setMessage] = useState('');
  const { sendMessage, me, activeRoom } = useChat();

  const handleSend = () => {
    if (message) {
      const newMessage: IMessage = {
        from: me,
        to: activeRoom,
        content: message,
        time: new Date().getTime(),
      };
      sendMessage(newMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (key: string) => {
    if (key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Wrapper>
      <div>Enter message:</div>
      <Input
        autoFocus
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e.key)}
      />
      <Button onClick={() => handleSend()}>&#8680;</Button>
    </Wrapper>
  );
};

export default Send;
