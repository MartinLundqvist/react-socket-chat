import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChatContextProvider } from './contexts/ChatContext';
import { SocketClientContextProvider } from './contexts/SocketClientContext';

ReactDOM.render(
  <React.StrictMode>
    <SocketClientContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </SocketClientContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
