import './App.css';
import React from 'react';
import Nav from './components/Nav';
import { Outlet } from 'react-router-dom';

import AuthProvider from './components/AuthProvider';

function App(): React.ReactElement {
  return (
    <AuthProvider>
      <Nav></Nav>
      <section className="section p-5 ">
        <Outlet />
      </section>
    </AuthProvider>
  );
}

export default App;
