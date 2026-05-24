// PatternDetection.jsx
import React from 'react';
import './PatternDetection.scss';
import { useStock } from '../context/StockContext';

const PatternDetection = () => {
  const { stockData, selectedStock } = useStock();
  const pattern = stockData?.pattern;

  if (!selectedStock) return null;

  const name = pattern?.name && pattern.name !== 'None' ? pattern.name : null;
  const explanation = pattern?.explanation || 'No strong candlestick pattern detected recently.';
  const isBullish = name?.toLowerCase().includes('bullish');
  const isBearish = name?.toLowerCase().includes('bearish');
  const typeClass = isBullish ? 'bullish' : isBearish ? 'bearish' : 'neutral';
  const icon = isBullish ? '📈' : isBearish ? '📉' : '🕯️';

  return (
    <div className={`pattern-card pattern-${typeClass}`}>
      <span className="pattern-icon">{icon}</span>
      <div className="pattern-body">
        <span className="section-label">Pattern Detected</span>
        <div className="pattern-name">{name || 'No Pattern Detected'}</div>
        <div className="pattern-desc">{explanation}</div>
      </div>
    </div>
  );
};

export default PatternDetection;