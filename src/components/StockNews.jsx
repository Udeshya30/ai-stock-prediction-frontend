import React, { useEffect, useState } from "react";
import "./StockNews.scss";
import { useStock } from "../context/StockContext";

const StockNews = () => {
  const { selectedStock } = useStock();
  const ticker = selectedStock?.ticker?.replace(".NS", "") || null;

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) { setNewsList([]); return; }
    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:8000/api/news-sentiment?ticker=${encodeURIComponent(ticker)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const items = (data.data.headlines || [])
            .map(item => ({
              title: item.title,
              date: item.date || "Unknown",
              sentiment: item.sentiment > 0.1 ? "positive" : item.sentiment < -0.1 ? "negative" : "neutral",
              sentimentValue: parseFloat(item.sentiment).toFixed(2),
              emoji: item.emoji,
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setNewsList(items);
        } else {
          setError("Failed to fetch stock news");
        }
      })
      .catch(() => setError("Error fetching stock news"))
      .finally(() => setLoading(false));
  }, [ticker]);

  const sentimentLabel = { positive: "Bullish", neutral: "Neutral", negative: "Bearish" };

  return (
    <div className="stock-news">
      <div className="sn-header">
        <span className="section-label">Stock News & Sentiment</span>
        {ticker && <span className="sn-ticker">{ticker}</span>}
      </div>

      <div className="sn-scroll">
        {!ticker ? (
          <div className="sn-state">Search and select a stock to see news</div>
        ) : loading ? (
          <div className="sn-state">
            {[1,2,3,4].map(i => (
              <div key={i} className="sn-skeleton">
                <span className="shimmer" style={{ display:'block', height:12, width:'90%', borderRadius:4, marginBottom:6 }} />
                <span className="shimmer" style={{ display:'block', height:12, width:'60%', borderRadius:4 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="sn-state sn-error">{error}</div>
        ) : newsList.length === 0 ? (
          <div className="sn-state">No news available for {ticker}</div>
        ) : (
          newsList.map((news, idx) => (
            <div key={idx} className={`sn-item sn-${news.sentiment}`}>
              <div className="sn-title">{news.title}</div>
              <div className="sn-footer">
                <span className="sn-date">{news.date}</span>
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

export default StockNews;
