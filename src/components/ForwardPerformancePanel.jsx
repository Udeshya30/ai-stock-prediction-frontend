import React, { useEffect, useState } from 'react';
import { Activity, Target, TrendingUp } from 'lucide-react';
import { apiUrl } from '../config/api';
import { useStock } from '../context/StockContext';
import PanelBarLoader from './PanelBarLoader';
import './ForwardPerformancePanel.scss';

const fmtPct = (value) => (value == null ? 'N/A' : `${Number(value).toFixed(2)}%`);

const ForwardPerformancePanel = () => {
  const { selectedStock, stockData, pipelineRunning } = useStock();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedStock) return;
    let cancelled = false;
    setLoading(true);
    fetch(apiUrl(`/api/forward-performance?ticker=${encodeURIComponent(selectedStock.ticker)}`))
      .then((res) => res.json())
      .then((payload) => {
        if (!cancelled && payload.success) setSummary(payload.data);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedStock, stockData?.forward_tracking]);

  if (!selectedStock) return null;

  if (loading && !summary) {
    return (
      <section className="forward-performance-card">
        <div className="fwp-heading">
          <Activity size={18} />
          <span className="section-label">Forward Paper Tracking</span>
        </div>
        <PanelBarLoader label="Loading forward performance" rows={3} />
      </section>
    );
  }

  const recent = summary?.recent || [];

  return (
    <section className="forward-performance-card">
      <div className="fwp-top">
        <div className="fwp-heading">
          <Activity size={18} />
          <span className="section-label">Forward Paper Tracking</span>
        </div>
        {pipelineRunning && <span className="fwp-live">Updating after analysis</span>}
      </div>

      <div className="fwp-metrics">
        <div>
          <Target size={16} />
          <span>{summary?.actionable_records || 0}</span>
          <small>Actionable tracked</small>
        </div>
        <div>
          <TrendingUp size={16} />
          <span>{fmtPct(summary?.win_rate != null ? summary.win_rate * 100 : null)}</span>
          <small>Forward win rate</small>
        </div>
        <div>
          <span>{fmtPct(summary?.average_return_pct)}</span>
          <small>Avg return after costs</small>
        </div>
        <div>
          <span>{summary?.profit_factor ?? 'N/A'}</span>
          <small>Profit factor</small>
        </div>
      </div>

      <div className="fwp-note">
        {summary?.closed_records
          ? 'This uses recommendations recorded before the outcome was known.'
          : 'No completed forward outcomes yet. Treat current recommendations as research only until this builds history.'}
      </div>

      {recent.length > 0 && (
        <div className="fwp-recent">
          {recent.slice(0, 4).map((item) => (
            <div key={item.id} className="fwp-row">
              <span>{item.horizon?.replace('_', ' ')}</span>
              <strong>{item.recommendation || 'N/A'}</strong>
              <em>{item.outcome_status?.replaceAll('_', ' ') || 'pending'}</em>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ForwardPerformancePanel;
