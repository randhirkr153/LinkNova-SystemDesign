import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Link2, LayoutDashboard } from 'lucide-react';
import ShortenerBox from './components/ShortenerBox';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function Navigation() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="logo-container">
        <Link2 size={32} color="var(--accent-primary)" />
        <span>TinyURL</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Create</Link>
        <Link to="/analytics" className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}>Analytics</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <main className="container">
        <Routes>
          <Route path="/" element={<ShortenerBox />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
