import React from 'react';

const MarketOverview = ({ data }) => {
  return (
    <div className="market-overview">
      <h3>Market Overview</h3>
      <div className="market-metrics">
        <p>Crude Oil: ${data.oil.value.toFixed(2)} ({data.oil.change > 0 ? '+' : ''}{data.oil.change.toFixed(2)}%)</p>
        <p>Gold: ${data.gold.value.toFixed(2)} ({data.gold.change > 0 ? '+' : ''}{data.gold.change.toFixed(2)}%)</p>
        <p>USD/INR: ₹{data.dollarToRupee.value.toFixed(2)} ({data.dollarToRupee.change > 0 ? '+' : ''}{data.dollarToRupee.change.toFixed(2)}%)</p>
      </div>
    </div>
  );
};

export default MarketOverview;
