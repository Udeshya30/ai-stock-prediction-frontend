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
  const valAccPct = pred.validation_accuracy != null ? Math.round(pred.validation_accuracy * 100) : null;
  const reliabilityPct = pred.recommendation?.reliability_score != null
    ? Math.round(pred.recommendation.reliability_score * 100)
    : null;
  const rawConfPct = pred.raw_confidence != null ? Math.round(pred.raw_confidence * 100) : null;
  const backtest = pred.backtest;
  const risk = pred.risk;
  const market = pred.market;
  const displayGates = [...(market?.gates || []), ...(pred.context_gates || [])];
  const failedGates = pred.recommendation?.failed_gates || [];
  const freshnessLabel = pred.freshness_days == null
    ? 'freshness unknown'
    : pred.freshness_days === 0
      ? 'fresh today'
      : `${pred.freshness_days}d old`;

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

      <div className="tc-meta-row">
        <span className={`tc-pill ${pred.is_stale ? 'is-stale' : 'is-fresh'}`}>{freshnessLabel}</span>
        {valAccPct != null && <span className="tc-pill">Val {valAccPct}%</span>}
        {reliabilityPct != null && <span className="tc-pill">Reliability {reliabilityPct}%</span>}
        {rawConfPct != null && rawConfPct !== confPct && <span className="tc-pill">Raw {rawConfPct}%</span>}
      </div>

      {confPct > 0 && (
        <div className="tc-conf">
          <div className="tc-conf-track">
            <div className="tc-conf-fill" style={{ width: `${confPct}%` }} />
          </div>
          <span className="tc-conf-text">{confPct}% confidence</span>
        </div>
      )}

      {backtest?.available && backtest.trade_count > 0 && (
        <div className="tc-evidence">
          <span>{backtest.validation_method === 'walk_forward' ? 'Walk-forward' : 'Backtest'}: {Math.round((backtest.win_rate || 0) * 100)}% win</span>
          <span>Avg {backtest.average_return_pct}%</span>
          <span>PF {backtest.profit_factor || 'n/a'}</span>
          {backtest.folds != null && <span>{backtest.folds} folds</span>}
        </div>
      )}

      {risk?.reward_risk != null && (
        <div className={`tc-risk ${risk.actionable ? 'tc-risk--ok' : 'tc-risk--weak'}`}>
          <span>R/R {risk.reward_risk}</span>
          {risk.stop_loss != null && <span>SL ₹{risk.stop_loss}</span>}
          {risk.do_not_enter_above != null && <span>No gap &gt; ₹{risk.do_not_enter_above}</span>}
        </div>
      )}

      {displayGates.length > 0 && (
        <div className="tc-gates">
          {displayGates.map(gate => (
            <span key={gate.name} className={gate.passed ? 'is-pass' : 'is-fail'} title={gate.reason}>
              {gate.name}
            </span>
          ))}
        </div>
      )}

      {failedGates.length > 0 && (
        <div className="tc-failed-gates">
          Weak: {failedGates.slice(0, 3).map(g => g.name).join(', ')}
        </div>
      )}

      {pred.recommendation?.label && (
        <div className={`tc-reco tc-reco--${pred.recommendation.action || 'wait'}`}>
          <strong>{pred.recommendation.label}</strong>
          {pred.recommendation.reason && <span>{pred.recommendation.reason}</span>}
        </div>
      )}
    </div>
  );
};

export default TargetCard;
