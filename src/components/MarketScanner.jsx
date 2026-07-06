import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Play,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { apiUrl } from '../config/api';
import { useStock } from '../context/StockContext';
import './MarketScanner.scss';

const universeOptions = [
  { value: 'large_cap', label: 'Large Cap' },
  { value: 'mid_cap', label: 'Mid Cap' },
  { value: 'small_cap', label: 'Small Cap' },
  { value: 'nifty50', label: 'Nifty 50' },
  { value: 'nifty_next50', label: 'Nifty Next 50' },
  { value: 'all_nse', label: 'All NSE Stocks' },
];

const investmentOptions = [
  { value: 'swing', label: 'Swing' },
  { value: 'short_term', label: 'Short Term' },
  { value: 'long_term', label: 'Long Term' },
];

const topSectionLabels = {
  technical: 'Top 10 Technical',
  fundamentals: 'Top 10 Fundamentals',
  ai_picks: 'Top 10 AI Picks',
  news_driven: 'Top 10 News Driven',
  breakouts: 'Top 10 Breakouts',
  value: 'Top 10 Value Stocks',
  growth: 'Top 10 Growth Stocks',
  lowest_risk: 'Top 10 Lowest Risk',
  highest_confidence: 'Top 10 Highest Confidence',
  best_overall: 'Top 10 Best Overall',
};

const topSectionScoreKeys = {
  technical: 'technical_score',
  fundamentals: 'fundamental_score',
  ai_picks: 'ml_score',
  news_driven: 'news_score',
  breakouts: 'breakout_score',
  value: 'value_score',
  growth: 'growth_score',
  lowest_risk: 'risk_score',
  highest_confidence: 'confidence_score',
  best_overall: 'opportunity_score',
};

const columns = [
  { key: 'rank', label: 'Rank' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'company', label: 'Company' },
  { key: 'sector', label: 'Sector' },
  { key: 'current_price', label: 'Price' },
  { key: 'technical_score', label: 'Technical', score: true },
  { key: 'fundamental_score', label: 'Fundamental', score: true },
  { key: 'ml_score', label: 'ML', score: true },
  { key: 'news_score', label: 'News', score: true },
  { key: 'sector_score', label: 'Sector', score: true },
  { key: 'risk_score', label: 'Risk', score: true },
  { key: 'backtest_score', label: 'Backtest', score: true },
  { key: 'confidence_score', label: 'Confidence', score: true },
  { key: 'overall_score', label: 'Overall', score: true },
  { key: 'recommendation', label: 'Recommendation' },
];

const detailCategories = [
  ['technical', 'Technical'],
  ['fundamental', 'Fundamental'],
  ['ml', 'Machine Learning'],
  ['news', 'News'],
  ['sector', 'Sector'],
  ['risk', 'Risk'],
  ['backtest', 'Backtest'],
  ['confidence', 'Confidence'],
];

const defaultForm = {
  universe: 'large_cap',
  investmentType: 'swing',
  maxStocks: 10,
  minimumScore: 70,
};

const defaultProgress = { scanned: 0, total: 0, label: '' };
const defaultSort = { key: 'overall_score', dir: 'desc' };

const toFormFromSavedConfig = (config = {}) => ({
  universe: config.universe || defaultForm.universe,
  investmentType: config.investment_type || config.investmentType || defaultForm.investmentType,
  maxStocks: config.max_stocks || config.maxStocks || defaultForm.maxStocks,
  minimumScore: config.minimum_score || config.minimumScore || defaultForm.minimumScore,
});

const scannerKeyPart = (value, fallback) => {
  const nextValue = value === undefined || value === null || value === '' ? fallback : value;
  const numeric = Number(nextValue);
  if (Number.isFinite(numeric) && Number.isInteger(numeric)) {
    return String(numeric);
  }
  return String(nextValue);
};

const scannerKeyFromForm = (formValue = defaultForm) => [
  scannerKeyPart(formValue.universe, defaultForm.universe),
  scannerKeyPart(formValue.investmentType, defaultForm.investmentType),
  scannerKeyPart(formValue.maxStocks, defaultForm.maxStocks),
  scannerKeyPart(formValue.minimumScore, defaultForm.minimumScore),
].join('|');

const optionLabel = (options, value) => options.find((option) => option.value === value)?.label || value;

const formatSavedAt = (value) => {
  if (!value) return 'Saved scan';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Saved scan';
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPrice = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '-';
  return `Rs. ${numeric.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

const formatScore = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 'N/A';
  return numeric.toFixed(numeric % 1 === 0 ? 0 : 1);
};

const scoreClass = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 'score-na';
  if (numeric >= 90) return 'score-dark-green';
  if (numeric >= 80) return 'score-green';
  if (numeric >= 70) return 'score-light-green';
  if (numeric >= 60) return 'score-yellow';
  if (numeric >= 40) return 'score-orange';
  return 'score-red';
};

const ScorePill = ({ value }) => (
  <span className={`ms-score ${scoreClass(value)}`}>{formatScore(value)}</span>
);

const formatMetric = (value) => {
  if (value == null || value === '') return 'N/A';
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value);
  return Math.abs(numeric) >= 1000 ? numeric.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : numeric.toFixed(2);
};

const flattenRow = (row) => {
  const categories = row.research?.categories || {};
  return {
    Rank: row.rank,
    Symbol: row.symbol,
    Company: row.company,
    Sector: row.sector,
    Price: row.current_price,
    Technical: row.technical_score,
    Fundamental: row.fundamental_score,
    ML: row.ml_score,
    News: row.news_score,
    SectorScore: row.sector_score,
    Risk: row.risk_score,
    Backtest: row.backtest_score,
    Confidence: row.confidence_score,
    Overall: row.overall_score,
    Recommendation: row.recommendation,
    WhyThisStock: row.why_this_stock,
    WhyNotHigher: row.why_not_higher,
    TechnicalReasons: (categories.technical?.reasons || []).join('; '),
    FundamentalReasons: (categories.fundamental?.reasons || []).join('; '),
    MLReasons: (categories.ml?.reasons || []).join('; '),
    NewsReasons: (categories.news?.reasons || []).join('; '),
    RiskReasons: (categories.risk?.reasons || []).join('; '),
    BacktestReasons: (categories.backtest?.reasons || []).join('; '),
  };
};

const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadBlob = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const MarketScanner = ({ onBackToPrediction }) => {
  const { selectStock } = useStock();
  const [form, setForm] = useState(defaultForm);
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState(null);
  const [progress, setProgress] = useState(defaultProgress);
  const [error, setError] = useState('');
  const [sort, setSort] = useState(defaultSort);
  const [expandedSymbol, setExpandedSymbol] = useState('');
  const [restoringSavedScan, setRestoringSavedScan] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeHistoryKey, setActiveHistoryKey] = useState('');
  const eventSourceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const fetchScanHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(apiUrl('/api/market-scanner/history'));
      const payload = await response.json();
      if (payload?.success) {
        setScanHistory(Array.isArray(payload.data) ? payload.data : []);
      }
    } catch {
      // History is helpful, but scanner should remain usable if the backend is temporarily unavailable.
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const rows = report?.rows || [];
  const topSections = report?.top_sections || {};
  const summary = report?.research_summary || {};
  const progressPct = progress.total > 0 ? Math.round((progress.scanned / progress.total) * 100) : 0;

  const sortedRows = useMemo(() => {
    const sorted = [...rows];
    sorted.sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      const aNumber = Number(aValue);
      const bNumber = Number(bValue);
      if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
        return sort.dir === 'asc' ? aNumber - bNumber : bNumber - aNumber;
      }
      return sort.dir === 'asc'
        ? String(aValue ?? '').localeCompare(String(bValue ?? ''))
        : String(bValue ?? '').localeCompare(String(aValue ?? ''));
    });
    return sorted;
  }, [rows, sort]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setActiveHistoryKey('');
    setReport(null);
    setProgress(defaultProgress);
    setExpandedSymbol('');
  };

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  const loadHistoryItem = async (item) => {
    if (!item?.key) return;
    setError('');
    setRestoringSavedScan(true);
    try {
      const response = await fetch(apiUrl(`/api/market-scanner/history/${encodeURIComponent(item.key)}`));
      const payload = await response.json();
      const saved = payload?.data;
      if (!payload?.success || !saved?.report) {
        throw new Error(payload?.error || 'Saved scan not found.');
      }

      const restoredForm = toFormFromSavedConfig(saved.config);
      const restoredProgress = {
        scanned: saved.report.scanned || saved.summary?.scanned || 0,
        total: saved.report.scanned || saved.summary?.scanned || 0,
        label: saved.saved_at ? `Loaded saved scan from ${new Date(saved.saved_at).toLocaleString()}` : 'Loaded saved scan',
      };
      setForm(restoredForm);
      setReport(saved.report);
      setProgress(restoredProgress);
      setExpandedSymbol('');
      setActiveHistoryKey(saved.key || item.key);
    } catch (historyError) {
      setError(historyError.message || 'Could not load saved scanner result.');
    } finally {
      setRestoringSavedScan(false);
    }
  };

  const runScan = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setScanning(true);
    setError('');
    setExpandedSymbol('');
    setActiveHistoryKey(scannerKeyFromForm(form));
    const startingProgress = { scanned: 0, total: 0, label: 'Starting scan' };
    setProgress(startingProgress);

    const params = new URLSearchParams({
      universe: form.universe,
      investment_type: form.investmentType,
      max_stocks: String(form.maxStocks),
      minimum_score: String(form.minimumScore),
    });

    const stream = new EventSource(apiUrl(`/api/market-scanner/stream?${params.toString()}`));
    eventSourceRef.current = stream;

    stream.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'started') {
        const nextProgress = { scanned: 0, total: message.total || 0, label: 'Preparing scanner' };
        setProgress(nextProgress);
      } else if (message.type === 'progress') {
        const nextProgress = {
          scanned: message.scanned || 0,
          total: message.total || 0,
          label: `${message.symbol} ${message.status}`,
        };
        setProgress(nextProgress);
      } else if (message.type === 'complete') {
        setReport(message.report);
        setScanning(false);
        const completeProgress = {
          scanned: message.report?.scanned || progress.total || 0,
          total: message.report?.scanned || progress.total || 0,
          label: 'Scan complete',
        };
        setProgress(completeProgress);
        fetchScanHistory();
        stream.close();
      } else if (message.type === 'error') {
        setError(message.message || 'Market scan failed.');
        setScanning(false);
        stream.close();
      }
    };

    stream.onerror = () => {
      setError('Scanner connection lost. Check the backend server and try again.');
      setScanning(false);
      stream.close();
    };
  };

  const startScan = (e) => {
    e.preventDefault();
    runScan();
  };

  const viewAnalysis = async (row) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    onBackToPrediction();
    await selectStock(row.symbol, row.company);
  };

  const exportCsv = () => {
    const flatRows = rows.map(flattenRow);
    if (!flatRows.length) return;
    const headers = Object.keys(flatRows[0]);
    const csv = [
      headers.map(csvEscape).join(','),
      ...flatRows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
    ].join('\n');
    downloadBlob('market-scanner-research.csv', csv, 'text/csv;charset=utf-8');
  };

  const exportExcel = () => {
    const flatRows = rows.map(flattenRow);
    if (!flatRows.length) return;
    const headers = Object.keys(flatRows[0]);
    const html = `
      <table>
        <thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
        <tbody>
          ${flatRows.map((row) => `<tr>${headers.map((header) => `<td>${row[header] ?? ''}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `;
    downloadBlob('market-scanner-research.xls', html, 'application/vnd.ms-excel;charset=utf-8');
  };

  const exportPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const flatRows = rows.map(flattenRow);
    const body = flatRows.map((row) => `
      <section>
        <h2>${row.Rank}. ${row.Symbol} - ${row.Company}</h2>
        <p><strong>Overall:</strong> ${row.Overall} | <strong>Recommendation:</strong> ${row.Recommendation}</p>
        <p>${row.WhyThisStock}</p>
        <p>${row.WhyNotHigher}</p>
        <table>
          <tr><td>Technical</td><td>${row.Technical}</td><td>${row.TechnicalReasons}</td></tr>
          <tr><td>Fundamental</td><td>${row.Fundamental}</td><td>${row.FundamentalReasons}</td></tr>
          <tr><td>ML</td><td>${row.ML}</td><td>${row.MLReasons}</td></tr>
          <tr><td>News</td><td>${row.News}</td><td>${row.NewsReasons}</td></tr>
          <tr><td>Risk</td><td>${row.Risk}</td><td>${row.RiskReasons}</td></tr>
          <tr><td>Backtest</td><td>${row.Backtest}</td><td>${row.BacktestReasons}</td></tr>
        </table>
      </section>
    `).join('');
    printWindow.document.write(`
      <html>
        <head>
          <title>Market Scanner Research</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; }
            section { page-break-inside: avoid; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; }
            td, th { border: 1px solid #d1d5db; padding: 6px; font-size: 12px; }
          </style>
        </head>
        <body><h1>Market Research Summary</h1>${body}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const toggleExpanded = (symbol) => {
    setExpandedSymbol((current) => (current === symbol ? '' : symbol));
  };

  return (
    <section className="market-scanner">
      <div className="ms-titlebar">
        <div>
          <button type="button" className="ms-back" onClick={onBackToPrediction}>
            <ArrowLeft size={15} />
            Prediction
          </button>
          <div className="ms-heading">
            <span><Search size={18} /></span>
            <div>
              <h1>Market Opportunity Scanner</h1>
              <p>Rank stocks using technicals, ML, sentiment, sector, macro, and risk context.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ms-scan-panel">
        <form className="ms-controls" onSubmit={startScan}>
          <div className="ms-control-group">
            <span className="ms-label">Universe</span>
            <div className="ms-radio-grid">
              {universeOptions.map((option) => (
                <label key={option.value} className={form.universe === option.value ? 'is-active' : ''}>
                  <input
                    type="radio"
                    name="universe"
                    value={option.value}
                    checked={form.universe === option.value}
                    onChange={() => updateForm('universe', option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ms-control-group">
            <span className="ms-label">Investment Type</span>
            <div className="ms-radio-grid ms-radio-grid--compact">
              {investmentOptions.map((option) => (
                <label key={option.value} className={form.investmentType === option.value ? 'is-active' : ''}>
                  <input
                    type="radio"
                    name="investmentType"
                    value={option.value}
                    checked={form.investmentType === option.value}
                    onChange={() => updateForm('investmentType', option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ms-number-grid">
            <label>
              <span>Maximum Stocks</span>
              <input
                type="number"
                min="1"
                max="50"
                value={form.maxStocks}
                onChange={(e) => updateForm('maxStocks', e.target.value)}
              />
            </label>
            <label>
              <span>Minimum Score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.minimumScore}
                onChange={(e) => updateForm('minimumScore', e.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="ms-start" disabled={scanning}>
            {scanning || report ? <RefreshCw size={15} className={scanning ? 'ms-spin' : ''} /> : <Play size={15} />}
            {scanning ? 'Scanning...' : report ? 'Refresh Scan' : 'Start Scan'}
          </button>
        </form>

        <aside className="ms-history">
          <div className="ms-history-head">
            <div>
              <span>Previous Scans</span>
              <p>Latest 5 saved combinations.</p>
            </div>
            <button type="button" onClick={fetchScanHistory} disabled={loadingHistory}>
              <RefreshCw size={13} className={loadingHistory ? 'ms-spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="ms-history-list">
            {scanHistory.map((item) => {
              const itemForm = toFormFromSavedConfig(item.config);
              const summary = item.summary || {};
              return (
                <button
                  type="button"
                  key={item.key}
                  className={activeHistoryKey === item.key ? 'is-active' : ''}
                  onClick={() => loadHistoryItem(item)}
                >
                  <strong>
                    {optionLabel(universeOptions, itemForm.universe)}
                    <span>/</span>
                    {optionLabel(investmentOptions, itemForm.investmentType)}
                  </strong>
                  <small>
                    Max {itemForm.maxStocks} - Min {itemForm.minimumScore} - {formatSavedAt(item.saved_at)}
                  </small>
                  <em>
                    {summary.top_symbol ? `${summary.top_symbol} ` : ''}
                    {Number.isFinite(Number(summary.top_score)) ? formatScore(summary.top_score) : `${summary.row_count || 0} rows`}
                  </em>
                </button>
              );
            })}
            {!scanHistory.length && (
              <p>{loadingHistory ? 'Loading saved scans...' : 'No saved scanner history yet. Start a scan to create one.'}</p>
            )}
          </div>
        </aside>
      </div>

      {(scanning || progress.total > 0) && (
        <div className="ms-progress">
          <div className="ms-progress-head">
            <span>Scanning {progress.scanned} / {progress.total} stocks</span>
            <strong>{progressPct}%</strong>
          </div>
          <div className="ms-progress-track">
            <div style={{ width: `${progressPct}%` }} />
          </div>
          {progress.label && <p>{progress.label}</p>}
        </div>
      )}

      {error && <div className="ms-error">{error}</div>}

      {restoringSavedScan && !report && (
        <div className="ms-progress">
          <div className="ms-progress-head">
            <span>Restoring saved scanner result</span>
            <strong>...</strong>
          </div>
        </div>
      )}

      {report && (
        <>
          <div className="ms-research-summary">
            <div className="ms-section-head">
              <span>Market Research Summary</span>
              <div className="ms-export-actions">
                <button type="button" onClick={exportCsv}><Download size={13} />CSV</button>
                <button type="button" onClick={exportExcel}><FileSpreadsheet size={13} />Excel</button>
                <button type="button" onClick={exportPdf}><FileText size={13} />PDF</button>
              </div>
            </div>
            <div className="ms-summary-grid">
              <div><span>Analyzed</span><strong>{summary.analyzed ?? report.scanned}</strong></div>
              <div><span>Average Score</span><strong>{formatScore(summary.average_market_score)}</strong></div>
              <div><span>Bullish</span><strong>{summary.bullish ?? 0}</strong></div>
              <div><span>Neutral</span><strong>{summary.neutral ?? 0}</strong></div>
              <div><span>Bearish</span><strong>{summary.bearish ?? 0}</strong></div>
              <div><span>Strong Buy</span><strong>{summary.strong_buy_candidates ?? 0}</strong></div>
              <div><span>High Confidence</span><strong>{summary.high_confidence_opportunities ?? 0}</strong></div>
              <div><span>Strongest Sector</span><strong>{summary.strongest_sector || 'N/A'}</strong></div>
              <div><span>Weakest Sector</span><strong>{summary.weakest_sector || 'N/A'}</strong></div>
              <div><span>Momentum Sector</span><strong>{summary.highest_momentum_sector || 'N/A'}</strong></div>
            </div>
          </div>

          <div className="ms-top-sections ms-top-sections--research">
            {Object.entries(topSectionLabels).map(([key, label]) => {
              const scoreKey = topSectionScoreKeys[key];
              return (
                <article key={key} className="ms-top-card">
                  <div className="ms-card-title">
                    <BarChart3 size={14} />
                    <span>{label}</span>
                  </div>
                  <div className="ms-mini-list">
                    {(topSections[key] || []).slice(0, 10).map((item, index) => (
                      <button type="button" key={`${key}-${item.symbol}`} onClick={() => viewAnalysis(item)}>
                        <span>{index + 1}</span>
                        <strong>{item.symbol}</strong>
                        <em>{formatScore(item[scoreKey] ?? item.opportunity_score)}</em>
                      </button>
                    ))}
                    {(topSections[key] || []).length === 0 && <p>No matches</p>}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="ms-table-wrap">
            <div className="ms-table-title">
              <div>
                <SlidersHorizontal size={15} />
                <span>Ranked Research Opportunities</span>
              </div>
            </div>

            <div className="ms-table-scroll">
              <table>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>
                        <button type="button" onClick={() => handleSort(column.key)}>
                          {column.label}
                        </button>
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row) => {
                    const expanded = expandedSymbol === row.symbol;
                    return (
                      <Fragment key={row.symbol}>
                        <tr className="ms-data-row" onClick={() => toggleExpanded(row.symbol)}>
                          {columns.map((column) => (
                            <td key={`${row.symbol}-${column.key}`}>
                              {column.score ? (
                                <ScorePill value={row[column.key]} />
                              ) : column.key === 'current_price' ? (
                                formatPrice(row.current_price)
                              ) : column.key === 'symbol' ? (
                                <strong>{row.symbol}</strong>
                              ) : column.key === 'recommendation' ? (
                                <span className={`ms-rec ms-rec--${String(row.recommendation).toLowerCase().replace(/\s+/g, '-')}`}>
                                  {row.recommendation}
                                </span>
                              ) : (
                                row[column.key]
                              )}
                            </td>
                          ))}
                          <td>
                            <button
                              type="button"
                              className="ms-view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                viewAnalysis(row);
                              }}
                            >
                              <Eye size={13} />
                              View Analysis
                            </button>
                          </td>
                        </tr>
                        {expanded && (
                          <tr className="ms-expanded-row">
                            <td colSpan={columns.length + 1}>
                              <div className="ms-expanded-panel">
                                <div className="ms-expanded-lead">
                                  <div>
                                    <h2>{row.company}</h2>
                                    <p>{row.why_this_stock}</p>
                                    <p>{row.why_not_higher}</p>
                                  </div>
                                  <ScorePill value={row.overall_score} />
                                </div>

                                <div className="ms-detail-grid">
                                  {detailCategories.map(([key, label]) => {
                                    const category = row.research?.categories?.[key];
                                    if (!category) return null;
                                    return (
                                      <article key={`${row.symbol}-${key}`} className="ms-detail-card">
                                        <div className="ms-detail-head">
                                          <span>{label}</span>
                                          <ScorePill value={category.score} />
                                        </div>
                                        <div className="ms-detail-body">
                                          <strong>Reason</strong>
                                          <ul>
                                            {(category.reasons || []).map((reason) => <li key={reason}>{reason}</li>)}
                                            {(category.reasons || []).length === 0 && <li>No positive driver recorded.</li>}
                                          </ul>
                                          {(category.weaknesses || []).length > 0 && (
                                            <>
                                              <strong>Weakness</strong>
                                              <ul>
                                                {category.weaknesses.map((weakness) => <li key={weakness}>{weakness}</li>)}
                                              </ul>
                                            </>
                                          )}
                                          {category.metrics && Object.keys(category.metrics).length > 0 && (
                                            <div className="ms-metrics">
                                              {Object.entries(category.metrics).slice(0, 8).map(([metric, value]) => (
                                                <span key={metric}>
                                                  <em>{metric.replace(/_/g, ' ')}</em>
                                                  <b>{formatMetric(value)}</b>
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </article>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MarketScanner;
