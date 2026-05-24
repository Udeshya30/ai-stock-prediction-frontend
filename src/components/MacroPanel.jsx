import React, { useEffect, useState } from "react";
import "./MacroPanel.scss";

const MacroPanel = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/macro-trends")
      .then(r => r.json())
      .then(data => {
        if (!data.success) return;
        const d = data.data;
        setMetrics([
          {
            label: "USD / INR",
            value: d["USD/INR"]?.price || "—",
            score: d["USD/INR"]?.score,
            sentiment: d["USD/INR"]?.sentiment || "",
            icon: "💵",
          },
          {
            label: "Repo Rate",
            value: d["RBI Repo Rate"]?.price || d["RBI Repo Rate"]?.rate || "6.50%",
            score: 0,
            sentiment: d["RBI Repo Rate"]?.sentiment || "",
            icon: "🏦",
          },
          {
            label: "Gold",
            value: d["Gold"]?.price || "—",
            score: d["Gold"]?.score,
            sentiment: d["Gold"]?.sentiment || "",
            icon: "🥇",
          },
          {
            label: "Brent Crude",
            value: d["Brent Crude"]?.price || "—",
            score: d["Brent Crude"]?.score,
            sentiment: d["Brent Crude"]?.sentiment || "",
            icon: "🛢️",
          },
        ]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scoreClass = (score) => {
    if (score == null) return "";
    if (score > 0.1) return "positive";
    if (score < -0.1) return "negative";
    return "neutral";
  };

  const scoreLabel = (score) => {
    if (score == null) return "";
    const sign = score > 0 ? "+" : "";
    return `${sign}${score.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="macro-panel">
        <div className="macro-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="macro-box macro-box--skeleton">
              <span className="shimmer" style={{ display: 'block', height: 10, width: '60%', borderRadius: 4, marginBottom: 8 }} />
              <span className="shimmer" style={{ display: 'block', height: 18, width: '80%', borderRadius: 4, marginBottom: 6 }} />
              <span className="shimmer" style={{ display: 'block', height: 10, width: '40%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="macro-panel">
      <div className="macro-grid">
        {metrics.map(m => {
          const cls = scoreClass(m.score);
          return (
            <div key={m.label} className="macro-box">
              <div className="macro-top">
                <span className="macro-icon">{m.icon}</span>
                <span className="macro-label">{m.label}</span>
              </div>
              <div className="macro-value">{m.value}</div>
              {m.score != null && (
                <div className={`macro-score score-${cls}`}>
                  {scoreLabel(m.score)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacroPanel;
