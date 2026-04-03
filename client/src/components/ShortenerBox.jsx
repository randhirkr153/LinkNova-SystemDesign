import React, { useState } from 'react';
import axios from 'axios';
import { Link2, Copy, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function ShortenerBox() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);

    if (!url) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/url/shorten`, { long_url: url });
      setResult(`${API_BASE}/${res.data.short_url}`);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to shorten url. Please ensure it is a valid URL.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="hero-content">
        <h1 className="hero-title">Shorten Your Links</h1>
        <p className="hero-subtitle">Fast, secure, and reliable link management with powerful analytics.</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} className="input-group">
          <div className="styled-input-wrapper">
            <Link2 className="styled-input-icon" />
            <input
              type="url"
              className="styled-input"
              placeholder="Paste your long URL here (http://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="primary-btn" disabled={loading || !url}>
            {loading ? <div className="spinner"></div> : 'Shorten URL'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {result && (
          <div className="result-container">
            <a href={result} target="_blank" rel="noopener noreferrer" className="short-url">
              {result}
            </a>
            <button onClick={copyToClipboard} className="copy-btn" title="Copy to clipboard">
              {copied ? <CheckCircle size={20} color="var(--success)" /> : <Copy size={20} />}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ShortenerBox;
