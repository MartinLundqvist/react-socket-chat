import styled from 'styled-components';
import Chat from './components/Chat';
import { useChat } from './contexts/ChatContext';
import Header from './components/Header';
import Rooms from './components/Rooms';
import Send from './components/Send';

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  gap: 1.5rem;
  padding: 2rem;
  grid-template-rows: 4rem 30rem 4rem;
  grid-template-columns: 15rem minmax(30rem, 1fr);
  /* overflow: hidden; */
`;

const App = (): JSX.Element => {
  const { me } = useChat();

  return (
    <Wrapper>
      <Header />
      {me.connected && (
        <>
          <Rooms />
          <Chat />
          <Send />
        </>
      )}
    </Wrapper>
  );
};

export default App;
