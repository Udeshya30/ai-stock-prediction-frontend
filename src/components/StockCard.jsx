import React from 'react';
import './StockCard.scss';

const StockCard = () => {
  return (
    <div className="card-dark stock-card">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h5 className="mb-0">INFY</h5>
          <small className="text-muted">Infosys Limited</small>
        </div>
        <span className="badge exchange-badge">NSE</span>
      </div>

      <div className="my-3">
        <h3 className="stock-price">₹1,542.65 <span className="price-change">+2.45%</span></h3>
        <div className="separator"></div>
      </div>

      <div className="row g-2">
        <div className="col-6">
          <div className="info-box">
            <small className="label">Market Cap</small>
            <div className="value">₹6.4T</div>
          </div>
        </div>
        <div className="col-6">
          <div className="info-box">
            <small className="label">Sector</small>
            <div className="value">IT</div>
          </div>
        </div>
        <div className="col-6">
          <div className="info-box">
            <small className="label">Volatility</small>
            <div className="value">Moderate</div>
          </div>
        </div>
        <div className="col-6">
          <div className="info-box">
            <small className="label">Volume</small>
            <div className="value">2.8M</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
