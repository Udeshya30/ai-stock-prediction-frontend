// SectorChart.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import './SectorChart.scss';
import { useStock } from '../context/StockContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const v = payload[0].value;
    return (
      <div className="sc-tooltip">
        <div className="sc-tt-label">{label}</div>
        <div className={`sc-tt-value ${v >= 0 ? 'pos' : 'neg'}`}>
          {v >= 0 ? '+' : ''}{v?.toFixed(2)}%
        </div>
      </div>
    );
  }
  return null;
};

const SectorChart = () => {
  const { stockData, selectedStock } = useStock();
  const sa = stockData?.sector_analysis;

  if (!selectedStock) {
    return (
      <div className="sector-chart sector-chart--empty">
        <span className="section-label">Sector Performance</span>
        <div className="sc-empty">Select a stock to compare vs sector</div>
      </div>
    );
  }

  const data = sa
    ? [
        { name: sa.stock_ticker?.replace('.NS', ''), value: parseFloat(sa.stock_change_pct) },
        { name: sa.sector_index?.replace('^', ''), value: parseFloat(sa.sector_change_pct) },
      ]
    : [
        { name: 'Stock', value: 0 },
        { name: 'Sector', value: 0 },
      ];

  const barFills = [
    data[0].value >= 0 ? 'var(--success)' : 'var(--danger)',
    data[1].value >= 0 ? 'var(--accent)'  : 'var(--warning)',
  ];

  return (
    <div className="sector-chart">
      <div className="sc-header">
        <span className="section-label">Sector Performance</span>
        {sa && (
          <span className={`sc-badge ${sa.outperforming ? 'out' : 'under'}`}>
            {sa.outperforming ? '↑ Outperforming' : '↓ Underperforming'}
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data} barGap={12} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            tickFormatter={v => `${v}%`}
            tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
            width={36}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={48}>
            {data.map((_, i) => (
              <Cell key={i} fill={barFills[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="sc-legend">
        {data.map((d, i) => (
          <div key={d.name} className="sc-legend-item">
            <span className="sc-dot" style={{ background: barFills[i] }} />
            <span className="sc-legend-name">{d.name}</span>
            <span className={`sc-legend-val ${d.value >= 0 ? 'pos' : 'neg'}`}>
              {d.value >= 0 ? '+' : ''}{d.value?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorChart;