import React, { useEffect, useState } from 'react';
import './NewsFeed.scss';

const NewsFeed = ({ title }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert date string to India time zone string
  const toIndiaTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      // Options for IST display: day, month (short), year, time in 24h
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/global-news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const mappedTitle =
            title === "India News & Sentiment" ? "India Markets" : "US Markets";

          // const items = data.data[mappedTitle]?.map((item) => {
          //   let sentimentLabel = "neutral";
          //   if (item.sentiment > 0.1) sentimentLabel = "positive";
          //   else if (item.sentiment < -0.1) sentimentLabel = "negative";

          //   return {
          //     title: item.title,
          //     date: toIndiaTime(item.date),
          //     sentiment: sentimentLabel,
          //     sentimentValue: item.sentiment.toFixed(2),
          //     emoji: item.emoji,
          //   };
          // }) || [];
          const items =
          data.data[mappedTitle]
            ?.slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by raw date (newest to oldest)
            .map((item) => {
              let sentimentLabel = "neutral";
              if (item.sentiment > 0.1) sentimentLabel = "positive";
              else if (item.sentiment < -0.1) sentimentLabel = "negative";

              return {
                title: item.title,
                date: toIndiaTime(item.date), // Convert to IST only after sorting
                sentiment: sentimentLabel,
                sentimentValue: item.sentiment.toFixed(2),
                emoji: item.emoji,
              };
            }) || [];


          setNewsList(items);
        } else {
          setError("Failed to fetch news data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching news data");
        setLoading(false);
      });
  }, [title]);

  const sentimentLabel = { positive: 'Bullish', neutral: 'Neutral', negative: 'Bearish' };
  const titleIcon = title.includes('India') ? '🇮🇳' : '🌐';

  return (
    <div className="news-feed">
      <div className="nf-header">
        <span className="section-label">{title}</span>
        <span className="nf-icon">{titleIcon}</span>
      </div>
      <div className="news-scroll">
        {loading ? (
          <div className="nf-state">Loading…</div>
        ) : error ? (
          <div className="nf-state nf-error">{error}</div>
        ) : newsList.length === 0 ? (
          <div className="nf-state">No news available</div>
        ) : (
          newsList.map((news, idx) => (
            <div key={idx} className={`news-item ${news.sentiment}`}>
              <div className="news-title">{news.title}</div>
              <div className="news-footer">
                <span className="news-date">{news.date}</span>
                <span className={`sentiment-tag ${news.sentiment}`}>
                  {news.emoji} {sentimentLabel[news.sentiment] || news.sentiment}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
