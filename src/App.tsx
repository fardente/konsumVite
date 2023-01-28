import './App.css';
import React, { ReactElement } from 'react';
import Nav from './components/Nav';
import { Outlet } from 'react-router-dom';

function App(): ReactElement {
  return (
    <div className="App">
      <Nav></Nav>
      <Outlet />
    </div>
  );
}

export default App;
