import React from 'react';
import './PanelBarLoader.scss';

const PanelBarLoader = ({ label = 'Loading panel', rows = 3 }) => {
  return (
    <div className="panel-bar-loader" role="status" aria-label={label} aria-live="polite">
      {Array.from({ length: rows }).map((_, index) => (
        <span
          key={index}
          className={`pbl-line pbl-line--${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PanelBarLoader;
