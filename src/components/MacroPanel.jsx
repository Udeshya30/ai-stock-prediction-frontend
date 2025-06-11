import React, { useEffect, useState } from "react";
import "./MacroPanel.scss";

// Utility to style change values
const getChangeClass = (change) => {
  if (!change) return "text-warning";
  if (change.startsWith("+")) return "text-success";
  if (change.startsWith("-")) return "text-danger";
  return "text-warning";
};

const MacroPanel = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/macro-trends")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const d = data.data;

          const newMetrics = [
            {
              label: "USD/INR",
              value: d["USD/INR"]?.price || "",//"N/A",
              change:
                d["USD/INR"]?.score !== undefined
                  ? d["USD/INR"].score.toFixed(2)
                  : "",
              sentiment: d["USD/INR"]?.sentiment || "",
            },
            {
              label: "Repo Rate",
              value: d["RBI Repo Rate"]?.rate || "",//"N/A",
              change: "0.00",
              sentiment: d["RBI Repo Rate"]?.sentiment || "",
            },
            {
              label: "Gold",
              value: d["Gold"]?.price || "",//"N/A",
              change:
                d["Gold"]?.score !== undefined
                  ? d["Gold"].score.toFixed(2)
                  : "",
              sentiment: d["Gold"]?.sentiment || "",
            },
            {
              label: "Crude",
              value: d["Brent Crude"]?.price || "",//"N/A",
              change:
                d["Brent Crude"]?.score !== undefined
                  ? d["Brent Crude"].score.toFixed(2)
                  : "",
              sentiment: d["Brent Crude"]?.sentiment || "",
            },
          ];

          setMetrics(newMetrics);
        } else {
          setError("Failed to fetch macro trends");
        }
        setLoading(false);
      })
      .catch((e) => {
        setError("Error fetching macro trends");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Macro Data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="card-dark macro-panel">
      <h6 className="mb-3">Macro & Global</h6>
      <div className="row g-3">
        {metrics.map((m, idx) => (
          <div className="col-6 col-sm-4 col-lg-2" key={idx}>
            <div className="macro-box">
              <div className="macro-label">{m.label}</div>
              <div className="macro-value">{m.value}</div>
              <div
                className={`macro-change ${getChangeClass(
                  m.change.startsWith("-") ? m.change : "+" + m.change
                )}`}
              >
                {m.change && (m.change > 0 ? "+" : "") + m.change}
              </div>
              {/* <div className="macro-sentiment small text-muted">
                {m.sentiment}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacroPanel;
