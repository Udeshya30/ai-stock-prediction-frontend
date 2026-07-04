import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Search, Zap, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import './Header.scss';
import { useStock } from '../context/StockContext';
import { apiUrl } from '../config/api';

const Header = ({ onLogout, onMarketScannerClick }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [focused, setFocused] = useState(false);
  const [time, setTime] = useState(dayjs().format('HH:mm'));
  const { selectStock, loading, selectedStock } = useStock();
  const dropdownRef = useRef(null);

  const selectTypedStock = (value) => {
    const raw = value.trim();
    if (!raw) return;

    const normalized = raw.toUpperCase();
    const exactSuggestion = suggestions.find(item => {
      const ticker = item.ticker.toUpperCase();
      const name = item.name.toUpperCase();
      return ticker === normalized || name === normalized;
    });

    const selected = selectedSuggestion && (
      selectedSuggestion.ticker.toUpperCase() === normalized ||
      selectedSuggestion.name.toUpperCase() === normalized
    ) ? selectedSuggestion : null;

    const finalSelection = selected || exactSuggestion;

    setQuery('');
    setSuggestions([]);
    setSelectedSuggestion(null);
    setFocused(false);
    selectStock(finalSelection?.ticker || normalized, finalSelection?.name || raw);
  };

  useEffect(() => {
    const t = setInterval(() => setTime(dayjs().format('HH:mm')), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetch(apiUrl(`/api/stocks/search?query=${encodeURIComponent(query)}`))
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
    setQuery(item.ticker.replace('.NS', ''));
    setSelectedSuggestion(item);
    setSuggestions([]);
    setFocused(true);
  };

  const handleSearch = () => selectTypedStock(query);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <Zap className="brand-icon" size={18} />
          <span className="brand-name">StockWhisper<span className="brand-accent">AI</span></span>
        </div>

        <div className="header-search-wrap" ref={dropdownRef}>
          <div className={`header-search ${focused ? 'is-focused' : ''}`}>
            <Search className="search-icon" size={15} />
            <input
              type="text"
              placeholder="Search stocks or type ticker…"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSelectedSuggestion(null);
              }}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
              aria-label="Search stocks"
            />
            {loading && <span className="search-spinner" aria-hidden="true" />}
          </div>

          <button type="button" className="search-action" onClick={handleSearch} aria-label="Search selected ticker">
            Search
          </button>

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
          <button type="button" className="scanner-btn" onClick={onMarketScannerClick}>
            <BarChart3 size={13} />
            <span>Market Scanner</span>
          </button>
          <div className="header-time">
            <Clock size={12} />
            <span>{time}</span>
          </div>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
