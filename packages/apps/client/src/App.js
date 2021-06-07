import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <div>
          <Layout handleisLoggedIn={setIsLoggedIn} />
        </div>
      ) : (
        <Login handleisLoggedIn={setIsLoggedIn} />
      )}
    </BrowserRouter>
  );
}

export default App;