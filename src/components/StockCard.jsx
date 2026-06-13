// StockCard.jsx – Stock overview banner
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StockCard.scss';
import { useStock } from '../context/StockContext';
import { AiOutlineRise } from "react-icons/ai";

const Skeleton = ({ w, h = 14 }) => (
  <span className="shimmer" style={{ display: 'block', width: w, height: h, borderRadius: 6 }} />
);

const StockCard = () => {
  const { stockData, selectedStock, loading } = useStock();

  if (!selectedStock && !loading) {
    return (
      <div className="stock-banner stock-banner--empty">
        <div className="sb-empty">
          <span className="sb-empty-icon"><AiOutlineRise /></span>
          <p>Search and select a stock to begin</p>
          <small>Live prices · AI predictions · Sentiment analysis</small>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="stock-banner stock-banner--skeleton">
        <div className="sb-skel-left">
          <Skeleton w="80px" h={28} />
          <Skeleton w="180px" h={12} />
          <Skeleton w="48px" h={18} />
        </div>
        <div className="sb-skel-center">
          <Skeleton w="140px" h={32} />
          <Skeleton w="100px" h={14} />
        </div>
        <div className="sb-skel-right">
          {[1, 2, 3].map(i => (
            <div key={i} className="sb-skel-metric">
              <Skeleton w="50px" h={10} />
              <Skeleton w="70px" h={16} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const d = stockData;
  if (!d) return null;

  const pct = d.change_pct ?? 0;
  const isUp = pct > 0;
  const isDown = pct < 0;
  const dirClass = isUp ? 'up' : isDown ? 'down' : 'flat';
  const DirIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <div className={`stock-banner stock-banner--${dirClass}`}>
      <div className="sb-identity">
        <span className="sb-ticker">{d.base_ticker}</span>
        <span className="sb-name">{d.name}</span>
        <span className="sb-exchange">NSE</span>
      </div>

      <div className="sb-price-block">
        <div className="sb-price">
          {d.price != null
            ? `₹${d.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : '—'}
        </div>
        <div className={`sb-change sb-change--${dirClass}`}>
          <DirIcon size={13} strokeWidth={2.5} />
          <span>{isUp ? '+' : ''}{pct.toFixed(2)}%</span>
          <span className="sb-change-abs">
            ({isUp ? '+' : isDown ? '' : ''}₹{Math.abs(d.change ?? 0).toFixed(2)})
          </span>
        </div>
      </div>

      <div className="sb-divider" />

      <div className="sb-metrics">
        {[
          { label: 'Market Cap', value: d.market_cap || '—' },
          { label: 'Sector',     value: d.sector     || '—' },
          { label: 'Volume',     value: d.volume     || '—' },
        ].map(m => (
          <div key={m.label} className="sb-metric">
            <span className="sb-metric-label">{m.label}</span>
            <span className="sb-metric-value">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockCard;