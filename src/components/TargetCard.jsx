// src/components/TargetCard.jsx
import React from 'react';

const TargetCard = ({ type }) => {
  const isShort = type === 'short';
  return (
    <div className="card-dark text-white">
      <h6>{isShort ? 'Short Term' : 'Long Term'} Target</h6>
      <p className="mb-1">📈 Bullish</p>
      <p>
        {isShort ? '7 Days Target:' : '30 Days Target:'} <strong>
          {isShort ? '₹1,580 - ₹1,620' : '₹1,650 - ₹1,720'}
        </strong>
      </p>
    </div>
  );
};

export default TargetCard;
