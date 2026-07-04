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
import HomePage from "./components/HomePage";
import MarketScanner from "./components/MarketScanner";

const LOGIN_SESSION_KEY = "stockwhisper_auth";
const VIEW_HOME = "home";
const VIEW_LOGIN = "login";
const VIEW_DASHBOARD = "dashboard";
const VIEW_SCANNER = "scanner";

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
  const [view, setView] = useState(() => (
    sessionStorage.getItem(LOGIN_SESSION_KEY) === "1" ? VIEW_DASHBOARD : VIEW_HOME
  ));

  const handleLogin = (username, password) => {
    const ok = username === envUsername && password === envPassword;
    if (ok) {
      sessionStorage.setItem(LOGIN_SESSION_KEY, "1");
      setIsAuthenticated(true);
      setView(VIEW_DASHBOARD);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    setIsAuthenticated(false);
    setView(VIEW_HOME);
  };

  const openLogin = () => setView(VIEW_LOGIN);

  const backToHome = () => setView(VIEW_HOME);
  const openScanner = () => setView(VIEW_SCANNER);
  const openDashboard = () => setView(VIEW_DASHBOARD);

  if (!isAuthenticated && view === VIEW_HOME) {
    return <HomePage onLoginClick={openLogin} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        envConfigured={envConfigured}
        onBackHome={backToHome}
      />
    );
  }

  return (
    <div className="app-layout">
      <Header onLogout={handleLogout} onMarketScannerClick={openScanner} />
      <main className="main-content">

        {view === VIEW_SCANNER ? (
          <MarketScanner onBackToPrediction={openDashboard} />
        ) : selectedStock ? (
          <>
            <div className="dashboard-top-grid">
              <StockCard />
              <div className="dashboard-signal-stack">
                <MacroPanel />
                <PatternDetection />
              </div>
            </div>

            <div className="dashboard-news-grid">
              <div className="dashboard-news-left">
                <SectorChart />
                <div className="targets-row">
                  <TargetCard type="short" />
                  <TargetCard type="long" />
                </div>
              </div>

              <div className="dashboard-news-right">
                <StockNews />
              </div>
            </div>

            <PipelineRunner />
            <FiiDiiPanel />
          </>
        ) : (
          <>
            <MacroPanel />
            <FiiDiiPanel />
            <StockCard />
          </>
        )}

        {view !== VIEW_SCANNER && (
          <div className="news-grid">
            <NewsFeed title="India News & Sentiment" />
            <NewsFeed title="Global News & Sentiment" />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
