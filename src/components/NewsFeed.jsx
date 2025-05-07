// import React from 'react';
// import './NewsFeed.scss';

// const newsData = {
//   "India News & Sentiment": [
//     { title: "RBI Maintains Repo Rate, Forecast at 7.2%", sentiment: "negative" },
//     { title: "Sensex Hits Record High, Crosses 75,000", sentiment: "neutral" },
//     { title: "IT Sector Revenue Growth Raised for FY26", sentiment: "positive" },
//     { title: "Sensex Hits Record High, Crosses 75,000", sentiment: "neutral" },
//     { title: "IT Sector Revenue Growth Raised for FY26", sentiment: "positive" },
//     { title: "Sensex Hits Record High, Crosses 75,000", sentiment: "neutral" },
//     { title: "IT Sector Revenue Growth Raised for FY26", sentiment: "positive" },
//   ],
//   "Global News & Sentiment": [
//     { title: "Fed Signals Rate Cut in September", sentiment: "positive" },
//     { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
//     { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
//     { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
//     { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
//     { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
//     { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
//     { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
//     { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
//   ],
// };

// const NewsFeed = ({ title }) => {
//   return (
//     <div className="card-dark news-feed">
//       <h6 className="section-title mb-3">{title}</h6>
//       <div className="news-scroll">
//         {newsData[title].map((news, idx) => (
//           <div key={idx} className="news-item d-flex justify-content-between align-items-start mb-3">
//             <div className="news-title">{news.title}</div>
//             <span className={`sentiment-tag ${news.sentiment}`}>{news.sentiment}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NewsFeed;


// NewsFeed.jsx
import React from 'react';
import './NewsFeed.scss';

const newsData = {
  "India News & Sentiment": [
    { title: "RBI Maintains Repo Rate, Forecast at 7.2%", sentiment: "negative" },
    { title: "Sensex Hits Record High, Crosses 75,000", sentiment: "neutral" },
    { title: "IT Sector Revenue Growth Raised for FY26", sentiment: "positive" },
    { title: "Sensex Hits Record High, Crosses 75,000", sentiment: "neutral" },
    { title: "IT Sector Revenue Growth Raised for FY26", sentiment: "positive" },
    { title: "Sensex Hits Record High, Crosses 75,000", sentiment: "neutral" },
    { title: "IT Sector Revenue Growth Raised for FY26", sentiment: "positive" },
  ],
  "Global News & Sentiment": [
    { title: "Fed Signals Rate Cut in September", sentiment: "positive" },
    { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
    { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
    { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
    { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
    { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
    { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
    { title: "EU Approves $25B Tech Merger", sentiment: "neutral" },
    { title: "US Consumer Confidence Beats Forecast", sentiment: "negative" },
  ],
};

const NewsFeed = ({ title }) => {
  return (
    <div className="card-dark news-feed">
      <h6 className="section-title mb-3">{title}</h6>
      <div className="news-scroll">
        {newsData[title].map((news, idx) => (
          <div key={idx} className="news-item d-flex justify-content-between align-items-start mb-3">
            <div className="news-title">{news.title}</div>
            <span className={`sentiment-tag ${news.sentiment}`}>{news.sentiment}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;