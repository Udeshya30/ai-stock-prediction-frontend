// src/components/StockNews.jsx
import React from 'react';
import './StockNews.scss';

const newsItems = [
  {
    title: 'Infosys Announces Strategic Partnership with Global Tech Giant',
    sentiment: 'positive',
    source: 'Economic Times',
    time: '2 hours ago',
  },
  {
    title: 'IT Sector Outlook Remains Strong Despite Global Headwinds',
    sentiment: 'neutral',
    source: 'Bloomberg',
    time: '4 hours ago',
  },
  {
    title: 'Market Leaders Discuss AI Integration in Financial Services',
    sentiment: 'positive',
    source: 'Reuters',
    time: '6 hours ago',
  },
  {
    title: 'Infosys Launches New AI Lab in Bengaluru',
    sentiment: 'positive',
    source: 'LiveMint',
    time: '8 hours ago',
  },
  {
    title: 'Tech Stocks Decline Amid Rate Concerns',
    sentiment: 'negative',
    source: 'CNBC',
    time: '12 hours ago',
  },
];

const StockNews = () => {
  return (
    <div className="card-dark stock-news">
      <h6 className="section-title mb-3">Stock News & Sentiment</h6>
      <div className="news-scroll">
        {newsItems.map((item, index) => (
          <div key={index} className="news-item d-flex justify-content-between align-items-start mb-3">
            <div className="news-content">
              <div className="news-title">{item.title}</div>
              <div className="news-meta text-muted">{item.source} • {item.time}</div>
            </div>
            <span className={`sentiment-tag ${item.sentiment}`}>{item.sentiment}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockNews;
