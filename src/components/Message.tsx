import { IMessage } from '../../types';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';

const Wrapper = styled.div`
  flex-shrink: 0;
  /* flex-grow: 1; */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.7rem;
  border-radius: 25px 25px 25px 0;
  padding: 1rem;
  /* max-width: 80%; */
  background: #e0e0e0;
  box-shadow: 10px 10px 30px #bebebe, -10px -10px 30px #ffffff;
  font-size: 1.25rem;
  &.me {
    margin-left: auto;
    border-radius: 25px 25px 0 25px;
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
