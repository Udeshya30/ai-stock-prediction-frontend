import React from 'react';
import { AlertTriangle, BrainCircuit, ShieldCheck } from 'lucide-react';
import { useStock } from '../context/StockContext';
import PanelBarLoader from './PanelBarLoader';
import './LLMVerificationPanel.scss';

const verdictClass = (verdict = '') => {
  const normalized = verdict.toLowerCase();
  if (normalized.includes('buy')) return 'buy';
  if (normalized.includes('avoid') || normalized.includes('no trade')) return 'avoid';
  return 'watch';
};

const renderList = (title, items, className) => {
  if (!items?.length) return null;
  return (
    <div className={`llm-verify-list ${className || ''}`}>
      <span>{title}</span>
      <ul>
        {items.slice(0, 5).map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const LLMVerificationPanel = () => {
  const { stockData, selectedStock, pipelineRunning } = useStock();
  const verification = stockData?.llm_verification;

  if (!selectedStock) return null;

  if (!verification && pipelineRunning) {
    return (
      <section className="llm-verification-card">
        <div className="llm-verify-heading">
          <BrainCircuit size={18} />
          <span className="section-label">LLM Verification</span>
        </div>
        <PanelBarLoader label="Verifying prediction with LLM" rows={4} />
      </section>
    );
  }

  if (!verification) return null;

  const klass = verdictClass(verification.verdict);
  const isLive = verification.available;

  return (
    <section className={`llm-verification-card llm-verification-card--${klass}`}>
      <div className="llm-verify-top">
        <div className="llm-verify-heading">
          <BrainCircuit size={18} />
          <span className="section-label">LLM Verification</span>
        </div>
        <div className="llm-verify-badges">
          <span className={`llm-verify-verdict llm-verify-verdict--${klass}`}>
            {verification.verdict || 'Watch Closely'}
          </span>
          {verification.confidence != null && (
            <span className="llm-verify-confidence">{verification.confidence}% review confidence</span>
          )}
        </div>
      </div>

      {!isLive && (
        <div className="llm-verify-notice">
          <AlertTriangle size={16} />
          <span>LLM verifier is not active. Showing fallback review from current model evidence.</span>
        </div>
      )}

      <p className="llm-verify-final">
        {verification.final_response || verification.summary || 'Verification completed from available evidence.'}
      </p>

      <div className="llm-verify-grid">
        {renderList('Why it qualifies', verification.key_reasons, 'is-positive')}
        {renderList('Risk checks', verification.risks, 'is-risk')}
        {renderList('Missing evidence', verification.missing_evidence, 'is-muted')}
      </div>

      {isLive && (
        <div className="llm-verify-foot">
          <ShieldCheck size={15} />
          <span>Reviewed by {verification.model || 'configured LLM'} using the latest generated prediction evidence.</span>
        </div>
      )}
    </section>
  );
};

export default LLMVerificationPanel;
