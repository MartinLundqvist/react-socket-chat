import { useState } from 'react';
import styled from 'styled-components';
import { useChat } from '../contexts/ChatContext';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0 0 0 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(2px);
  z-index: 1000;
`;

const Dialog = styled.div`
  padding: 1rem;
  border-radius: 50px;
  background-color: var(--color-bg);
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  font-size: var(--size-font);
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px dashed black;
  border-color: var(--color-text-send-alpha);
  /* outline: 1px solid red; */
  width: 100%;
  height: 100%;
  background-color: transparent;
  font: inherit;
  font-size: var(--size-font);
  color: var(--color-text-send);

  &:focus {
    outline: none;
    /* border: none; */
    border-color: var(--color-text-send);
    border-bottom: 1px dashed black;
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

const Form = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

interface ILoginProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Login = ({ open, setOpen }: ILoginProps): JSX.Element => {
  const [name, setName] = useState('');
  const { addNewUser } = useChat();

  const handleLogin = () => {
    if (name.length > 1) {
      console.log('Logging in ' + name);
      addNewUser(name);
      setName('');
      setOpen(false);
    }
  };

  const handleKeyDown = (key: string) => {
    if (key === 'Enter') {
      handleLogin();
    }
  };

  if (!open) return <></>;

  return (
    <Wrapper>
      <Dialog>
        <div>Enter your knight's name </div>
        <Form>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e.key)}
          />
          <Button onClick={() => handleLogin()}>&#8680;</Button>
        </Form>
      </Dialog>
    </Wrapper>
  );
};

export default Login;
