import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Layout';
import Layout from './pages/Layout';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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