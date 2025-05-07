// // src/components/PatternDetection.jsx
// import React from 'react';

// const PatternDetection = () => {
//   return (
//     <div className="card-dark mb-3">
//       <h6>Bullish Engulfing Pattern</h6>
//       <p className="mb-0 text-muted">
//         Detected 2 hours ago – Suggests potential upward momentum. Previous downtrend may be reversing.
//       </p>
//     </div>
//   );
// };

// export default PatternDetection;


// src/components/PatternDetection.jsx
import React from 'react';
import './PatternDetection.scss';

const PatternDetection = () => {
  return (
    <div className="card-dark pattern-alert">
      <h6>Bullish Engulfing Pattern</h6>
      <p className="mb-0 text-muted">
        Detected 2 hours ago – Suggests potential upward momentum. Previous downtrend may be reversing.
      </p>
    </div>
  );
};

export default PatternDetection;