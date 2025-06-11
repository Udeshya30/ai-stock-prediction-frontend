import React, { useEffect, useState } from "react";
import "./StockNews.scss";

const StockNews = ({ ticker }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/news-sentiment?ticker=${
      ticker || "INFY"
    }`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // const items = (data.data.headlines || []).map((item) => ({
          //   title: item.title,
          //   date: item.date || "Unknown",
          //   sentiment:
          //     item.sentiment > 0.1
          //       ? "positive"
          //       : item.sentiment < -0.1
          //       ? "negative"
          //       : "neutral",
          //   sentimentValue: item.sentiment.toFixed(2),
          //   emoji: item.emoji,
          // }));
          const items = (data.data.headlines || [])
          .map((item) => ({
            title: item.title,
            date: item.date || "Unknown",
            sentiment:
              item.sentiment > 0.1
                ? "positive"
                : item.sentiment < -0.1
                ? "negative"
                : "neutral",
            sentimentValue: item.sentiment.toFixed(2),
            emoji: item.emoji,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending


          setNewsList(items);
        } else {
          setError("Failed to fetch stock news");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching stock news");
        setLoading(false);
      });
  }, [ticker]);

  return (
    <div className="card-dark stock-news">
      <h6 className="section-title mb-3">Stock News & Sentiment</h6>
      <div className="news-scroll">
        {loading ? (
          <div className="text-muted">Loading...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : newsList.length === 0 ? (
          <div className="text-muted">No news available.</div>
        ) : (
          newsList.map((news, idx) => (
            <div key={idx} className="news-item">
              <div className="news-main-row">
                <div className="news-title">{news.title}</div>
                <span className={`sentiment-tag ${news.sentiment}`}>
                  {news.emoji} {news.sentiment} ({news.sentimentValue})
                </span>
              </div>
              <div className="news-date text-muted">{news.date}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockNews;
