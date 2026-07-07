// PatternDetection.jsx
import React from 'react';
import './PatternDetection.scss';
import { useStock } from '../context/StockContext';
import { BiTrendingUp, BiTrendingDown, BiLineChart } from 'react-icons/bi';
import PanelBarLoader from './PanelBarLoader';

const PatternDetection = () => {
  const { stockData, selectedStock, pipelineRunning } = useStock();
  const pattern = stockData?.pattern;

  if (!selectedStock) return null;

  const name = pattern?.name && pattern.name !== 'None' ? pattern.name : null;
  const explanation = pattern?.explanation || 'No strong candlestick pattern detected recently.';
  const isBullish = name?.toLowerCase().includes('bullish');
  const isBearish = name?.toLowerCase().includes('bearish');
  const typeClass = isBullish ? 'bullish' : isBearish ? 'bearish' : 'neutral';
  const Icon = isBullish ? BiTrendingUp : isBearish ? BiTrendingDown : BiLineChart;
  const strength = pattern?.strength ?? 0;
  const action = pattern?.action || 'ignore';
  const confirmation = (pattern?.confirmation || 'none').replaceAll('_', ' ');
  const verdict = pattern?.verdict || (action === 'ignore' ? 'Ignore' : 'Watch Closely');

  if (!stockData || (pipelineRunning && !pattern)) {
    return (
      <div className="pattern-card pattern-loading">
        <span className="pattern-icon"><BiLineChart /></span>
        <div className="pattern-body">
          <span className="section-label">Pattern Detected</span>
          <PanelBarLoader
            label="Detecting candlestick patterns"
            hint="Waiting for pattern analysis."
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`pattern-card pattern-${typeClass}`}>
      <span className="pattern-icon"><Icon /></span>
      <div className="pattern-body">
        <span className="section-label">Pattern Detected</span>
        <div className="pattern-name">{name || 'No Pattern Detected'}</div>
        {name && (
          <div className="pattern-meta">
            <span className={`pattern-action pattern-action--${action}`}>{verdict}</span>
            <span>Strength {strength}/100</span>
            <span>{confirmation}</span>
          </div>
        )}
        <div className="pattern-desc">{explanation}</div>
        {pattern?.verdict_reason && <div className="pattern-verdict-reason">{pattern.verdict_reason}</div>}
        {pattern?.details && <div className="pattern-details">{pattern.details}</div>}
      </div>
    </div>
  );
};

export default PatternDetection;
