import React, { useMemo, useState } from "react";
import "./styles/main.scss";

import { useStock } from "./context/StockContext";
import Header from "./components/Header";
import StockCard from "./components/StockCard";
import MacroPanel from "./components/MacroPanel";
import FiiDiiPanel from "./components/FiiDiiPanel";
import PatternDetection from "./components/PatternDetection";
import SectorChart from "./components/SectorChart";
import TargetCard from "./components/TargetCard";
import NewsFeed from "./components/NewsFeed";
import StockNews from "./components/StockNews";
import PipelineRunner from "./components/PipelineRunner";
import LoginPage from "./components/LoginPage";

const LOGIN_SESSION_KEY = "stockwhisper_auth";

const App = () => {
  const { selectedStock } = useStock();

  const envUsername = import.meta.env.VITE_LOGIN_USERNAME || "";
  const envPassword = import.meta.env.VITE_LOGIN_PASSWORD || "";

  const envConfigured = useMemo(() => {
    return Boolean(envUsername && envPassword);
  }, [envPassword, envUsername]);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(LOGIN_SESSION_KEY) === "1";
  });

  const handleLogin = (username, password) => {
    const ok = username === envUsername && password === envPassword;
    if (ok) {
      sessionStorage.setItem(LOGIN_SESSION_KEY, "1");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} envConfigured={envConfigured} />;
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">

        {/* ── Always visible: Market overview ── */}
        <MacroPanel />
        <FiiDiiPanel />

        {/* ── Stock selected: AI analysis ── */}
        {selectedStock && (
          <>
            <StockCard />
            <PipelineRunner />
            <div className="analysis-grid">
              <div className="analysis-left">
                <SectorChart />
                <div className="targets-row">
                  <TargetCard type="short" />
                  <TargetCard type="long" />
                </div>
              </div>
              <div className="analysis-right">
                <PatternDetection />
                <StockNews />
              </div>
            </div>
          </>
        )}

        {/* ── Always visible: News feed ── */}
        <div className="news-grid">
          <NewsFeed title="India News & Sentiment" />
          <NewsFeed title="Global News & Sentiment" />
        </div>

      </main>
    </div>
  );
};

export default App;
