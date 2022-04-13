import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './main';
import './style/style.css';
// import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// reportWebVitals();