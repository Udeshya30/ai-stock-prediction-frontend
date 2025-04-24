import React, { useState } from 'react';
import './StockSearchBar.scss'; 

const StockSearchBar = () => {
  const [symbol, setSymbol] = useState('');

  const handleSearch = () => {
    console.log('Searching for stock symbol:', symbol);
  };

  return (
    <section className="search-bar-panel container py-3">
      <div className="row justify-content-center text-center">
        <div className="col-12 col-md-8 mb-3">
          <input
            type="text"
            placeholder="Enter stock symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="stock-input"
          />
        </div>
        <div className="col-12 col-md-4">
          <button onClick={handleSearch} className="stock-search-button w-100">
            Analyze Stock
          </button>
        </div>
      </div>
    </section>
  );
};

export default StockSearchBar;
