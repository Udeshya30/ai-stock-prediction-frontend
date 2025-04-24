import React from 'react';

const AIRecommendation = ({ recommendation }) => {
  return (
    <div className="ai-recommendation">
      <h3>AI Stock Recommendation</h3>
      <p>Action: <strong>{recommendation.action}</strong> ({recommendation.confidence}% confidence)</p>
      <p>Reasoning: {recommendation.reasoning}</p>
    </div>
  );
};

export default AIRecommendation;
