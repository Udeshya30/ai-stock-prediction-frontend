import React from 'react';

const StockDetails = ({ data }) => {
  return (
    <div className="stock-details">
      <h2>{data.name} ({data.symbol})</h2>
      <p>Price: ${data.currentPrice.toFixed(2)} ({data.change > 0 ? '+' : ''}{data.change.toFixed(2)} {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)</p>
      <p>Last updated: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default StockDetails;
