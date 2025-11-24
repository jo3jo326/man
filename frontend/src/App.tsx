import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { api } from './services/api';
import { ROUTES } from './constants';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.ping();
        setConnectionStatus(`✅ ${response.message}`);
      } catch (error) {
        setConnectionStatus('❌ Backend connection failed');
        console.error('Connection error:', error);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Routes>
      {/* Connection status indicator */}
      <div style={{ 
        position: 'fixed', 
        bottom: '1rem', 
        right: '1rem', 
        padding: '0.5rem 1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {loading ? 'Connecting...' : connectionStatus}
      </div>
    </Router>
  );
}

export default App;
