import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Award 
} from 'lucide-react';

// Types for strategy highlights
interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, isPositive }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300 backdrop-blur-md">
    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
    <div className="mt-2 flex items-baseline justify-between">
      <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Subtle Gradient Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Ticker Bar */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800 text-xs py-2 px-4 flex items-center justify-between overflow-x-auto text-slate-400">
        <div className="flex items-center space-x-6 min-w-max">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SYSTEM OPERATIONAL
          </span>
          <span>NIFTY 50: <strong className="text-white">22,450.10</strong> <span className="text-emerald-400">+0.85%</span></span>
          <span>BANK NIFTY: <strong className="text-white">48,120.40</strong> <span className="text-emerald-400">+1.12%</span></span>
          <span>ALGO EXECUTION LATENCY: <strong className="text-emerald-400">&lt; 12ms</strong></span>
        </div>
        <div className="hidden md:block text-slate-500">
          VM Wealth Group Institutional Terminal v4.2
        </div>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              T
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-white">TATA <span className="text-emerald-400 font-normal">WEALTH</span></span>
              <span className="block text-[10px] text-slate-400 tracking-widest uppercase">VM Algo Research Lab</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#overview" className="hover:text-emerald-400 transition-colors">Overview</a>
            <a href="#strategies" className="hover:text-emerald-400 transition-colors">Algorithmic Models</a>
            <a href="#performance" className="hover:text-emerald-400 transition-colors">Performance Metrics</a>
            <a href="#security" className="hover:text-emerald-400 transition-colors">Infrastructure</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="#contact" 
              className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-all duration-200 shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              Access Terminal
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400 mb-6">
            <Award className="w-3.5 h-3.5" /> Next-Generation Quantitative Trading Infrastructure
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Institutional Precision for <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Algorithmic Capital</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 leading-relaxed">
            Engineered for high-probability setups, quantitative market analysis, and systematic risk management. Eliminating emotional bias through automated strategy execution.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#strategies" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              Explore Strategies
              <ChevronRight className="w-4 h-4" />
            </a>
            <a 
              href="#performance" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              View Backtest Audit
            </a>
          </div>
        </div>

        {/* Live Market Metrics Strip */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="System CAGR (Audited)" value="34.8%" change="+4.2% YoY" isPositive={true} />
          <MetricCard label="Max Drawdown Control" value="< 8.2%" change="Strict Risk Cap" isPositive={true} />
          <MetricCard label="Sharpe Ratio" value="2.41" change="Top 1% Class" isPositive={true} />
          <MetricCard label="Avg. Order Speed" value="11.4 ms" change="Ultra Low Latency" isPositive={true} />
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white">Built Like an Institutional Desk</h2>
            <p className="mt-3 text-slate-400 text-sm">
              Our engineering architecture focuses on core quantitative pillars: risk isolation, high execution speed, and verified multi-indicator signal confluence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Indicator Confluence</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Combines VWAP dynamic bands, RSI momentum divergence, ADX trend filtering, and SuperTrend positioning to isolate zero-noise entry zones.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Institutional Risk Cap</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automated position sizing, dynamic stop-loss trailing, and hard daily equity protection ensure capital preservation in high-volatility events.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sub-15ms Webhook Execution</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Direct integration with broker REST APIs and WebSocket streams for immediate signal trigger execution without manual slip delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-300 text-sm">TATA WEALTH / VM Algo Research Lab</span>
            <p className="mt-1">© 2026 VM Wealth Group. All rights reserved. Built for high-frequency performance.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Risk Disclosure</a>
            <a href="#" className="hover:text-slate-300">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
