import React, { useState } from 'react';

const StockSearchBar = () => {
  const [symbol, setSymbol] = useState('');

  const handleSearch = () => {
    // You can add logic to fetch new stock data here based on the symbol entered
    console.log('Searching for stock symbol:', symbol);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter stock symbol (e.g. AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={handleSearch}>Analyze Stock</button>
    </div>
  );
};

export default StockSearchBar;
