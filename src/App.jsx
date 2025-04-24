import React, { useState, useEffect } from 'react';
import { getMockStockData, getGlobalNews, getIndiaNews, getMarketData } from './data/mockData'; 
import Header from './components/Header/Header';
import StockSearchBar from './components/StockSearchBar/StockSearchBar';
import StockDetails from './components/StockDetails/StockDetails';
import PredictionBox from './components/PredictionBox/PredictionBox';
import StockNews from './components/StockNews/StockNews';
import MarketOverview from './components/MarketOverview/MarketOverview';
import AIRecommendation from './components/AIRecommendation/AIRecommendation';

function App() {
  const [stockData, setStockData] = useState(null);
  const [globalNews, setGlobalNews] = useState([]);
  const [indiaNews, setIndiaNews] = useState([]);
  const [marketData, setMarketData] = useState(null);

  // Fetch mock data when the component mounts
  useEffect(() => {
    const stock = getMockStockData('AAPL'); 
    setStockData(stock);

    const global = getGlobalNews();
    setGlobalNews(global);

    const india = getIndiaNews();
    setIndiaNews(india);

    const market = getMarketData();
    setMarketData(market);
  }, []);

  return (
    <>
      <Header />
      <StockSearchBar />
      {stockData && (
        <>
          <StockDetails data={stockData} />
          <PredictionBox shortTerm={stockData.shortTerm} longTerm={stockData.longTerm} />
          <StockNews news={stockData.news} />
          {/* Global News Section */}
          <div className="section global-news">
            <h3>Global News</h3>
            <ul>
              {globalNews.map((article, index) => (
                <li key={index}>
                  <strong>{article.title}</strong> - {article.source} ({article.date})
                </li>
              ))}
            </ul>
          </div>

          {/* India News Section */}
          <div className="section india-news">
            <h3>India News</h3>
            <ul>
              {indiaNews.map((article, index) => (
                <li key={index}>
                  <strong>{article.title}</strong> - {article.source} ({article.date})
                </li>
              ))}
            </ul>
          </div>
          <MarketOverview data={marketData} />
          <AIRecommendation recommendation={stockData.recommendation} />
        </>
      )}
    </>
  );
}

export default App;