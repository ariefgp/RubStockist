import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider, Modal } from './context/Modal';
import Darkreader from 'react-darkreader';
import './index.css';
import App from './App';
import configureStore from './store';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider >
        <BrowserRouter>
          <App />
          <Modal />
        </BrowserRouter>
      </ModalProvider >
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
