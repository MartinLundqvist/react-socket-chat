import { IMessage } from '../../types';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
  border-radius: 50px 50px 50px 0;
  padding: 1rem;
  max-width: 80%;
  background: #e0e0e0;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  overflow: scroll;
  font-size: 1.25rem;
  &.me {
    margin-left: auto;
    border-radius: 50px 50px 0 50px;
    text-align: right;
  }
`;

const User = styled.div`
  border-radius: 100%;
  padding: 0.5rem;
  background-color: var(--color-text);
  color: var(--color-bg);
`;

interface IMessageProps {
  message: IMessage;
}

const Message = ({ message }: IMessageProps): JSX.Element => {
  const { me } = useChat();
  const [isMyMessage, setIsMyMessage] = useState(false);
  const [fromInitials, setFromInitials] = useState('');

  useEffect(() => {
    const getInitials = (nameString: string): string => {
      let names = nameString.split(' ');
      if (names.length > 1) {
        console.log(names[0]);
        let initials = names.reduce((prev, current) => prev[0] + current[0]);
        return initials;
      }
      return names[0][0];
    };

    setIsMyMessage(message.from.uuid === me.uuid);
    setFromInitials(getInitials(message.from.name));
  }, [message, me]);

  return (
    <Wrapper className={isMyMessage ? 'me' : ''}>
      {!isMyMessage && <User>{fromInitials}</User>}
      <div>{message.content}</div>
    </Wrapper>
  );
};

export default Message;
