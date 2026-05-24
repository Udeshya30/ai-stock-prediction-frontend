// FiiDiiPanel.jsx – Institutional flow tracker (FII / DII)
import React, { useEffect, useState } from 'react';
import './FiiDiiPanel.scss';

const FiiDiiPanel = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch('http://127.0.0.1:8000/api/fii-dii')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) setData(res.data);
        else setError(res.error || 'Data unavailable');
      })
      .catch(() => setError('Could not reach server'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // ---- helpers ----
  const formatCr = (val) => {
    if (val == null) return '—';
    const abs = Math.abs(val);
    const sign = val >= 0 ? '+' : '-';
    const str = abs >= 1000 ? `${(abs / 1000).toFixed(2)}K` : abs.toFixed(2);
    return `${sign}₹${str} Cr`;
  };

  const dir = (val) => (val == null ? 'neutral' : val >= 0 ? 'buy' : 'sell');

  const overall = (fii, dii) => {
    if (fii == null || dii == null)
      return { label: 'Unknown', cls: 'neutral', desc: 'Institutional flow data not available.' };
    if (fii > 0 && dii > 0)
      return { label: 'Strong Accumulation', cls: 'very-bullish', desc: 'Both FII & DII buying — high institutional conviction. Trend likely to continue upward.' };
    if (fii > 0 && dii < 0)
      return { label: 'Foreign Buying', cls: 'bullish', desc: 'FII inflows positive; DIIs booking profits. Watch for resistance near recent highs.' };
    if (fii < 0 && dii > 0)
      return { label: 'Domestic Support', cls: 'cautious', desc: 'FII selling absorbed by domestic institutions — potential reversal zone. High-risk accumulation zone.' };
    return { label: 'Institutional Exit', cls: 'very-bearish', desc: 'Both FII & DII selling. Avoid fresh positions; wait for reversal confirmation.' };
  };

  // ---- render states ----
  if (loading) {
    return (
      <div className="fiidii-panel">
        <div className="fd-header">
          <span className="section-label">Institutional Flow</span>
        </div>
        <div className="fd-grid">
          {[0, 1].map(i => (
            <div key={i} className="fd-card fd-card--skeleton">
              <span className="shimmer" style={{ display: 'block', height: 10, width: '55%', borderRadius: 4, marginBottom: 8 }} />
              <span className="shimmer" style={{ display: 'block', height: 22, width: '75%', borderRadius: 4, marginBottom: 6 }} />
              <span className="shimmer" style={{ display: 'block', height: 10, width: '40%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fiidii-panel">
        <div className="fd-header">
          <span className="section-label">Institutional Flow</span>
          <span className="fd-tag fd-tag--na">Unavailable</span>
        </div>
        <div className="fd-unavailable">
          <span className="fd-unavail-icon">📡</span>
          <div>
            <div className="fd-unavail-title">FII / DII data could not be loaded</div>
            <div className="fd-unavail-sub">{error || 'NSE may be closed or data service unavailable.'}</div>
          </div>
          <button className="fd-retry" onClick={load}>Retry</button>
        </div>
      </div>
    );
  }

  const fii = data.fii_net;
  const dii = data.dii_net;
  const sentiment = overall(fii, dii);

  const cards = [
    { key: 'fii', icon: '🌍', label: 'FII', sub: 'Foreign Institutional', net: fii, sentiment: data.fii_sentiment },
    { key: 'dii', icon: '🏠', label: 'DII', sub: 'Domestic Institutional', net: dii, sentiment: data.dii_sentiment },
  ];

  return (
    <div className="fiidii-panel">
      <div className="fd-header">
        <span className="section-label">Institutional Flow</span>
        {data.date && <span className="fd-date">📅 {data.date}</span>}
      </div>

      <div className="fd-grid">
        {cards.map(c => (
          <div key={c.key} className={`fd-card fd-card--${dir(c.net)}`}>
            <div className="fd-card-top">
              <span className="fd-icon">{c.icon}</span>
              <div>
                <div className="fd-label">{c.label}</div>
                <div className="fd-sub">{c.sub}</div>
              </div>
            </div>
            <div className={`fd-amount fd-amount--${dir(c.net)}`}>
              {formatCr(c.net)}
            </div>
            <div className={`fd-dir fd-dir--${dir(c.net)}`}>
              {dir(c.net) === 'buy' ? '▲ Buying' : dir(c.net) === 'sell' ? '▼ Selling' : '— Neutral'}
            </div>
          </div>
        ))}
      </div>

      <div className={`fd-interpretation fd-interpretation--${sentiment.cls}`}>
        <div className="fd-interp-label">{sentiment.label}</div>
        <div className="fd-interp-desc">{sentiment.desc}</div>
      </div>
    </div>
  );
};

export default FiiDiiPanel;
