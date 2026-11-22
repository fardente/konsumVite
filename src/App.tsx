import React from 'react';
import Nav from './components/Nav';
import { Outlet } from 'react-router-dom';

import AuthProvider from './components/AuthProvider';
import VersionBadge from './components/VersionBadge';

function App(): React.ReactElement {
  return (
    <>
      <AuthProvider>
        <Nav></Nav>
        <section className="section p-5 outer">
          <Outlet />
        </section>
      </AuthProvider>
      <VersionBadge />
    </>
  );
}

export default App;
