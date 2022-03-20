import styled from 'styled-components';
import Chat from './components/Chat';
import { useChat } from './contexts/ChatContext';
import Header from './components/Header';
import Rooms from './components/Rooms';
import Send from './components/Send';

const Wrapper = styled.div`
  display: grid;
  gap: 1.5rem;
  margin: 2rem;
  grid-template-rows: 4rem minmax(30rem, 1fr) 4rem;
  grid-template-columns: 15rem minmax(30rem, 1fr);
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
