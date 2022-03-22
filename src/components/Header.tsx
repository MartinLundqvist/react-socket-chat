import { useState } from 'react';
import styled from 'styled-components';
import { useChat } from '../contexts/ChatContext';
import Login from './Login';
import { Shadows } from './Mixins';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem 0 2rem;
  grid-area: header;

  ${Shadows}
`;

const Button = styled.div`
  &:hover {
    cursor: pointer;
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

const Header = (): JSX.Element => {
  const { me } = useChat();
  const [login, setLogin] = useState(false);

  return (
    <Wrapper>
      <div>The Knights' chat</div>
      {!me.connected ? (
        <Button onClick={() => setLogin(true)}>Log in</Button>
      ) : (
        <div>{me.name}</div>
      )}
      {<Login open={login} setOpen={setLogin} />}
    </Wrapper>
  );
};

export default Header;
