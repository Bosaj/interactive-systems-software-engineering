import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import Tp2 from './App.js';
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
 
    <h1 className='appp'>Boutique</h1>
    <Tp2/>
  </React.StrictMode>
);

reportWebVitals();
