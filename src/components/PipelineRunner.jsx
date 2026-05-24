import React from 'react';
import { useStock } from '../context/StockContext';
import './PipelineRunner.scss';

const STEP_ICONS = { running: '⏳', done: '✅', error: '❌', pending: '○' };

const PipelineRunner = () => {
  const {
    selectedStock,
    stockData,
    pipelineRunning,
    pipelineSteps,
    pipelineComplete,
    pipelineError,
    runPipeline,
  } = useStock();

  if (!selectedStock || !stockData) return null;

  const needsTraining = !stockData.short_term && !stockData.long_term;
  const showPanel = needsTraining || pipelineRunning || pipelineComplete || pipelineError;
  if (!showPanel) return null;

  const doneCount = pipelineSteps.filter(s => s.status === 'done').length;
  const total = pipelineSteps[0]?.total ?? 7;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const currentStep = pipelineSteps.find(s => s.status === 'running');

  return (
    <div className="pipeline-runner">

      {/* Idle: no model yet */}
      {!pipelineRunning && !pipelineComplete && !pipelineError && needsTraining && (
        <div className="pr-idle">
          <div className="pr-idle-info">
            <span className="pr-idle-icon">🤖</span>
            <div>
              <div className="pr-idle-title">No AI model trained for <strong>{stockData.base_ticker}</strong></div>
              <div className="pr-idle-sub">Run the full pipeline to fetch data, compute indicators, and train prediction models.</div>
            </div>
          </div>
          <button className="pr-btn" onClick={() => runPipeline(selectedStock.ticker)}>
            Run Full Analysis
          </button>
        </div>
      )}

      {/* Running */}
      {pipelineRunning && (
        <div className="pr-running">
          <div className="pr-running-header">
            <div>
              <div className="pr-running-title">Training AI models for {stockData.base_ticker}</div>
              {currentStep && <div className="pr-running-sub">{currentStep.label}</div>}
            </div>
            <span className="pr-counter">{doneCount}/{total}</span>
          </div>

          <div className="pr-track">
            <div className="pr-fill" style={{ width: `${progress}%` }} />
          </div>

          {pipelineSteps.length > 0 && (
            <div className="pr-steps">
              {pipelineSteps.map((step, i) => (
                <div key={step.key} className={`pr-step pr-step--${step.status}`}>
                  <span className="pr-step-icon">{STEP_ICONS[step.status] || '○'}</span>
                  <span className="pr-step-num">{i + 1}</span>
                  <span className="pr-step-label">{step.label}</span>
                  {step.status === 'error' && step.error && (
                    <span className="pr-step-error" title={step.error}>⚠</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Complete */}
      {pipelineComplete && (
        <div className="pr-complete">
          <span className="pr-complete-icon">✅</span>
          <span>
            Analysis complete for <strong>{stockData.base_ticker}</strong> — predictions loaded
          </span>
        </div>
      )}

      {/* Error */}
      {pipelineError && (
        <div className="pr-error">
          <div className="pr-error-msg">❌ {pipelineError}</div>
          <button className="pr-btn pr-btn--outline" onClick={() => runPipeline(selectedStock.ticker)}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default PipelineRunner;
