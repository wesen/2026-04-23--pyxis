import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { routerBasename } from './routing';
import { store } from './store';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={routerBasename()}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
