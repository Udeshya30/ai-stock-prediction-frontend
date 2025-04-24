import React from 'react';

const PredictionBox = ({ shortTerm, longTerm }) => {
  return (
    <div className="prediction-box">
      <h3>Short-Term Prediction (by {shortTerm.targetDate})</h3>
      <p>Min: ${shortTerm.min.toFixed(2)} | Max: ${shortTerm.max.toFixed(2)}</p>
      
      <h3>Long-Term Prediction (by {longTerm.targetDate})</h3>
      <p>Min: ${longTerm.min.toFixed(2)} | Max: ${longTerm.max.toFixed(2)}</p>
    </div>
  );
};

export default PredictionBox;
