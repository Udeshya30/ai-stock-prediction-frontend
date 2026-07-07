import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { apiUrl } from '../config/api';

const StockContext = createContext(null);

export const StockProvider = ({ children }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState([]);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [pipelineError, setPipelineError] = useState(null);
  const esRef = useRef(null);
  const autoTriggeredRef = useRef(null);

  const selectStock = useCallback(async (ticker, name) => {
    const normalizedTicker = ticker.trim().toUpperCase();
    setSelectedStock({ ticker: normalizedTicker, name: name || normalizedTicker });
    setLoading(true);
    setError(null);
    setStockData(null);
    setPipelineComplete(false);
    setPipelineSteps([]);
    setPipelineRunning(false);
    setPipelineError(null);
    try {
      const res = await fetch(apiUrl(`/api/stock-live?ticker=${encodeURIComponent(normalizedTicker)}`));
      const data = await res.json();
      if (data.success) {
        setStockData(data.data);
      } else {
        setError(data.error || 'Failed to load stock data');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const runPipeline = useCallback((ticker) => {
    if (esRef.current) esRef.current.close();
    setPipelineRunning(true);
    setPipelineSteps([]);
    setPipelineComplete(false);
    setPipelineError(null);

    const es = new EventSource(apiUrl(`/api/run-pipeline-stream?ticker=${encodeURIComponent(ticker)}`));
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);

        if (msg.type === 'progress') {
          setPipelineSteps(prev => [
            ...prev,
            { key: msg.step, label: msg.label, status: 'running', index: msg.index, total: msg.total },
          ]);
        } else if (msg.type === 'step_done') {
          setPipelineSteps(prev =>
            prev.map(s => s.key === msg.step ? { ...s, status: msg.status, error: msg.error || null } : s)
          );
        } else if (msg.type === 'complete') {
          setStockData(prev => prev ? {
            ...prev,
            short_term: msg.predictions.short_term,
            long_term: msg.predictions.long_term,
            pattern: msg.predictions.pattern,
            sector_analysis: msg.predictions.sector_analysis,
            llm_verification: msg.predictions.llm_verification,
            forward_tracking: msg.predictions.forward_tracking,
          } : prev);
          setPipelineComplete(true);
          setPipelineRunning(false);
          es.close();
        } else if (msg.type === 'error') {
          setPipelineError(msg.message);
          setPipelineRunning(false);
          es.close();
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setPipelineRunning(false);
      setPipelineError('Connection error. Check if the server is running.');
      es.close();
    };
  }, []);

  useEffect(() => {
    if (!selectedStock || !stockData || pipelineRunning) return;
    const normalizedTicker = selectedStock.ticker?.trim().toUpperCase();
    const shouldAutoRun = !stockData.short_term && !stockData.long_term;
    if (shouldAutoRun && autoTriggeredRef.current !== normalizedTicker) {
      autoTriggeredRef.current = normalizedTicker;
      runPipeline(normalizedTicker);
    }
  }, [selectedStock, stockData, pipelineRunning, runPipeline]);

  return (
    <StockContext.Provider value={{
      selectedStock, stockData, loading, error, selectStock,
      pipelineRunning, pipelineSteps, pipelineComplete, pipelineError, runPipeline,
    }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);

