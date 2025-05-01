import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import './SectorChart.scss';

const data = [
  { name: 'INFY', value: 5.2 },
  { name: 'CNXIT', value: 2.2 },
];

const barColors = {
  INFY: '#06b6d4',  // Cyan
  CNXIT: '#3b82f6', // Blue
};

const SectorChart = () => {
  return (
    <div className="card-dark sector-chart">
      <h6 className="mb-3">Sector Performance</h6>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
            labelStyle={{ color: '#fff' }}
            cursor={{ fill: '#37415133' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="legend d-flex justify-content-around mt-3">
        {data.map((item) => (
          <div key={item.name} className="d-flex align-items-center gap-2">
            <span
              className="legend-dot"
              style={{ backgroundColor: barColors[item.name] }}
            ></span>
            <small>{item.name}</small>
            <span className="fw-medium">{`+${item.value}%`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorChart;
