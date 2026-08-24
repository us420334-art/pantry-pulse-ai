import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <nav className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <Link to="/" className="text-xl font-bold tracking-wide">
            🥗 Pantry Pulse AI
          </Link>
          <div>
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Logout
              </button>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:underline text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-white text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition">Register</Link>
              </div>
            )}
          </div>
        </nav>

        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/login" />} />
            <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;