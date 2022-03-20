import { IMessage } from '../../types';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { ShadowsMessageIn, ShadowsMessageOut } from './Mixins';

const Wrapper = styled.div`
  flex-shrink: 0;
  /* flex-grow: 1; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.8rem;
  max-width: 60%;
  ${ShadowsMessageIn}
  font-size: var(--size-font);

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.8em;
  }

  &.me {
    ${ShadowsMessageOut}
    text-align: right;
    margin-left: auto;
  }

  /* .initials {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    padding: 0.5rem;
    background-color: var(--color-text);
    color: var(--color-bg);
    width: 2rem;
    height: 2rem;
  } */
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
      <div className='header'>
        <span>{message.from.name}</span>
        <span>{new Date(message.time).toTimeString().split(' ')[0]}</span>
      </div>
      <div className='content'>{message.content}</div>
    </Wrapper>
  );
};

export default Message;
