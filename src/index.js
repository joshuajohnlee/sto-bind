import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Editor from './Editor';
import Navbar from './Navbar';
import './styles/lcars-colors.css';
import './styles/app-styles.css';

const Routing = () => {
  return(
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sto-bind" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
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