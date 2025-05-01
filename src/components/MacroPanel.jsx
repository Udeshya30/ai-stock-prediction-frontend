import React from 'react';
import './MacroPanel.scss';

const metrics = [
  { label: 'NIFTY', value: '19,425', change: '+0.8%' },
  { label: 'USD/INR', value: '82.15', change: '-0.2%' },
  { label: 'Repo Rate', value: '6.50%', change: '0%' },
  { label: 'Gold', value: '₹58,890', change: '+0.5%' },
  { label: 'Crude', value: '$85.40', change: '+1.2%' },
  { label: 'SENSEX', value: '65,780', change: '+0.6%' },
];

const MacroPanel = () => {
  return (
    <div className="card-dark macro-panel">
      <h6 className="mb-3">Macro & Global</h6>
      <div className="row g-3">
        
      <div className="row g-3">
  {metrics.map((m, idx) => (
    <div className="col-6 col-sm-4 col-lg-2" key={idx}>
      <div className="macro-box">
        <div className="macro-label">{m.label}</div>
        <div className="macro-value">{m.value}</div>
        <div className={`macro-change ${getChangeClass(m.change)}`}>
          {m.change}
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

const getChangeClass = (change) => {
  if (change.startsWith('+')) return 'text-success';
  if (change.startsWith('-')) return 'text-danger';
  return 'text-warning';
};

export default MacroPanel;
