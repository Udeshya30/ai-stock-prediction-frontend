// TargetCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './TargetCard.scss';
import { useStock } from '../context/StockContext';

const TargetCard = ({ type }) => {
  const isShort = type === 'short';
  const { stockData, selectedStock } = useStock();
  const pred = isShort ? stockData?.short_term : stockData?.long_term;
  const label = isShort ? 'Short Term' : 'Long Term';

  if (!selectedStock) {
    return (
      <div className="target-card target-empty">
        <span className="section-label">{label}</span>
        <div className="tc-empty-msg">No stock selected</div>
      </div>
    );
  }

  if (!pred) {
    return (
      <div className="target-card target-empty">
        <span className="section-label">{label}</span>
        <div className="tc-empty-msg">
          {stockData ? 'Run analysis to train model' : 'Loading…'}
        </div>
      </div>
    );
  }

  const isUp   = pred.direction === 'Up';
  const isDown = pred.direction === 'Down';
  const dirClass = isUp ? 'up' : isDown ? 'down' : 'flat';
  const DirIcon  = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  const targetStr = pred.target_low != null && pred.target_high != null
    ? `₹${parseFloat(pred.target_low).toLocaleString('en-IN', { minimumFractionDigits: 2 })} – ₹${parseFloat(pred.target_high).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : '—';

  const confPct = pred.confidence ? Math.round(pred.confidence * 100) : 0;

  return (
    <div className={`target-card target-${dirClass}`}>
      <div className="tc-header">
        <span className="section-label">{label}</span>
        {pred.days && <span className="tc-days">{pred.days}d</span>}
      </div>

      <div className="tc-direction">
        <DirIcon className="tc-dir-icon" size={20} strokeWidth={2.5} />
        <span className="tc-dir-label">{pred.direction}</span>
      </div>

      <div className="tc-range">{targetStr}</div>

      {confPct > 0 && (
        <div className="tc-conf">
          <div className="tc-conf-track">
            <div className="tc-conf-fill" style={{ width: `${confPct}%` }} />
          </div>
          <span className="tc-conf-text">{confPct}% confidence</span>
        </div>
      )}
    </div>
  );
};

export default TargetCard;