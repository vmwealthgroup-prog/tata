"use client";

import { useState } from "react";
import "./page.css";

const modules = [
  {
    title: "Market Data",
    description: "Live indices, futures, volatility and market breadth.",
    status: "Connected",
    color: "green",
  },
  {
    title: "Bank Nifty Analysis",
    description: "Trend, support, resistance and intraday market structure.",
    status: "Ready",
    color: "blue",
  },
  {
    title: "Option Chain Scanner",
    description: "OI change, PCR, IV, strikes and unusual activity.",
    status: "Ready",
    color: "purple",
  },
  {
    title: "AI Trading Signals",
    description: "Rule-based and ML-assisted trade opportunities.",
    status: "Monitoring",
    color: "orange",
  },
  {
    title: "Backtesting Engine",
    description: "Evaluate strategies using historical market data.",
    status: "Available",
    color: "cyan",
  },
];

function ModuleCard({ module }) {
  return (
    <article className={`module-card ${module.color}`}>
      <div className="card-header">
        <span className="module-icon">◆</span>
        <span className={`status ${module.color}`}>{module.status}</span>
      </div>

      <h3>{module.title}</h3>
      <p>{module.description}</p>

      <button
        type="button"
        className="open-button"
        onClick={() => alert(`${module.title} is coming soon`)}
      >
        Open module <span>→</span>
      </button>
    </article>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Overview");

  const menuItems = [
    "Overview",
    "Market Data",
    "Option Chain",
    "Signals",
    "Backtesting",
  ];

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">VS</div>

          <div>
            <h2>VM Spot</h2>
            <span>AI Trading Platform</span>
          </div>
        </div>

        <nav className="navigation" aria-label="Main navigation">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item}
              className={activeTab === item ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab(item)}
            >
              <span>▦</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="pulse" />
            All systems operational
          </div>

          <small>VM Spot v1.0.0</small>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Trading workspace</p>
            <h1>{activeTab}</h1>
          </div>

          <div className="topbar-actions">
            <span className="market-state">
              <span className="pulse" />
              Market connected
            </span>

            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
            >
              ♢
            </button>

            <div className="avatar">VS</div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Trading intelligence platform</p>

            <h2>Trade with data. Execute with discipline.</h2>

            <p>
              Monitor the Indian markets, scan derivatives and test your
              strategies from one professional workspace.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setActiveTab("Market Data")}
              >
                View market overview
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setActiveTab("Backtesting")}
              >
                Run a backtest
              </button>
            </div>
          </div>

          <div className="hero-chart" aria-label="Market chart preview">
            <div className="chart-label">NIFTY 50</div>
            <div className="chart-value">24,850.35</div>
            <div className="chart-change">+1.24%</div>
            <div className="chart-line" />
          </div>
        </section>

        <section className="section-heading">
          <div>
            <p className="eyebrow">Platform modules</p>
            <h2>Everything you need to research</h2>
          </div>

          <button type="button" className="view-all">
            View all →
          </button>
        </section>

        <section className="module-grid">
          {modules.map((module) => (
            <ModuleCard key={module.title} module={module} />
          ))}
        </section>

        <section className="metrics">
          <div>
            <span>Tracked instruments</span>
            <strong>184</strong>
          </div>

          <div>
            <span>Active strategies</span>
            <strong>12</strong>
          </div>

          <div>
            <span>Signals today</span>
            <strong>27</strong>
          </div>

          <div>
            <span>Backtests completed</span>
            <strong>1,284</strong>
          </div>
        </section>
      </section>
    </main>
  );
}
