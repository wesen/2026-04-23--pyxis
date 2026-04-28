import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/global.css';
import 'pyxis-components/tokens/tokens.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
