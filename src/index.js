import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Editor from './Editor';
import Navbar from './Navbar';
import Help from './Help';
import './styles/lcars-colors.css';
import './styles/app.css';
import './styles/styles.css';
import Tips from './Tips';

const Routing = () => {
  return(
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sto-bind" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </HashRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar />
    <Routing />
  </React.StrictMode>
);