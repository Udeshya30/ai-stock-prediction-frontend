// Header.jsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import './Header.scss';

const Header = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const currentTime = dayjs().locale('en').format('ddd, MMM D • HH:mm');

  // Debounced fetch suggestions
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetch(`http://localhost:8000/api/stocks/search?query=${encodeURIComponent(query)}`)
          .then(async (res) => {
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setSuggestions(data);
          })
          .catch((err) => {
            console.error("Failed to fetch suggestions", err.message);
            setSuggestions([]); // fallback to empty list
          });
      } else {
        setSuggestions([]);
      }
    }, 300); // wait 300ms after typing

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="header-bar d-flex justify-content-between align-items-center border-bottom pb-2">
      <h4>AI Stock Whisper</h4>
      <div className="d-flex align-items-center position-relative">
        <div className="input-group me-3">
          <label htmlFor="search-input" className="visually-hidden">Search stocks...</label>
          <span className="input-group-text bg-dark border-dark">
            <Search className="text-white" size={16} />
          </span>
          <input
            type="text"
            id="search-input"
            className="form-control bg-dark border-dark text-white"
            placeholder="Search stocks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* 🔽 Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="suggestions-dropdown list-group position-absolute bg-dark text-white w-100" style={{ top: '100%', left: 0, zIndex: 1000 }}>
            {suggestions.map((item) => (
              <li key={item.ticker} className="list-group-item bg-dark text-white border-secondary">
                {item.name} ({item.ticker})
              </li>
            ))}
          </ul>
        )}

        <span className="current-time text-secondary ms-2">{currentTime}</span>
      </div>
    </div>
  );
};

export default Header;
