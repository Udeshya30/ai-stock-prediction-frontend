import React from 'react';

const StockNews = ({ news }) => {
  return (
    <div className="stock-news">
      <h3>Latest News</h3>
      <ul>
        {news.map((article, index) => (
          <li key={index}>
            <strong>{article.title}</strong> - {article.source} ({article.date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockNews;
