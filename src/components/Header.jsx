import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import './Header.scss';
import { useStock } from '../context/StockContext';

const Header = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const [time, setTime] = useState(dayjs().format('HH:mm'));
  const { selectStock, loading, selectedStock } = useStock();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(dayjs().format('HH:mm')), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetch(`http://localhost:8000/api/stocks/search?query=${encodeURIComponent(query)}`)
          .then(r => r.ok ? r.json() : [])
          .then(setSuggestions)
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (item) => {
    setQuery('');
    setSuggestions([]);
    setFocused(false);
    selectStock(item.ticker, item.name);
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <Zap className="brand-icon" size={18} />
          <span className="brand-name">StockWhisper<span className="brand-accent">AI</span></span>
        </div>

        <div className={`header-search ${focused ? 'is-focused' : ''}`} ref={dropdownRef}>
          <Search className="search-icon" size={15} />
          <input
            type="text"
            placeholder="Search stocks or companies…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            aria-label="Search stocks"
          />
          {loading && <span className="search-spinner" aria-hidden="true" />}

          {suggestions.length > 0 && (
            <ul className="suggestions-list" role="listbox">
              {suggestions.map(item => (
                <li key={item.ticker} onClick={() => handleSelect(item)} role="option">
                  <span className="sug-ticker">{item.ticker.replace('.NS', '')}</span>
                  <span className="sug-name">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="header-right">
          {selectedStock && (
            <span className="active-chip">
              <span className="chip-pulse" />
              {selectedStock.ticker.replace('.NS', '')}
            </span>
          )}
          <div className="header-time">
            <Clock size={12} />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
