import React from "react";
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

const App = () => {
  const { selectedStock } = useStock();

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
