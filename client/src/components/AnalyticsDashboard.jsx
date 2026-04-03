import React, { useState } from 'react';
import axios from 'axios';
import { BarChart3, Search, Calendar, Link2, MousePointerClick, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function AnalyticsDashboard() {
  const [shortCode, setShortCode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async (e) => {
    e.preventDefault();
    if (!shortCode) return;
    
    // Extract base62 code if they pasted full url
    let codeToFetch = shortCode;
    try {
      const parsedUrl = new URL(shortCode);
      const parts = parsedUrl.pathname.split('/').filter(Boolean);
      codeToFetch = parts[parts.length - 1]; // Assume last path part is code
    } catch(e) {
      // Not a full valid url, just use it as code
      codeToFetch = shortCode;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await axios.get(`${API_BASE}/api/url/analytics/${codeToFetch}`);
      setData(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to fetch analytics for this short code.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hero-content">
        <h1 className="hero-title">Analytics</h1>
        <p className="hero-subtitle">Track your link performance and clicks in real-time.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={fetchAnalytics} className="input-group">
          <div className="styled-input-wrapper">
            <Search className="styled-input-icon" />
            <input
              type="text"
              className="styled-input"
              placeholder="Enter short code or short URL to view metrics"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="primary-btn" disabled={loading || !shortCode}>
            {loading ? <div className="spinner"></div> : 'View Analytics'}
          </button>
        </form>

        {error && (
          <div className="error-message" style={{ marginTop: '1.5rem' }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {data && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-title"><MousePointerClick size={18} color="var(--accent-primary)"/> Total Clicks</div>
              <div className="stat-value">{data.clicks}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-title"><Calendar size={18} color="var(--success)"/> Created Date</div>
              <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
                {new Date(data.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
              <div className="stat-title"><Link2 size={18} color="var(--accent-secondary)"/> Original Destination</div>
              <div className="stat-value" style={{ fontSize: '1.2rem', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                <a href={data.long_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
                  {data.long_url}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AnalyticsDashboard;
