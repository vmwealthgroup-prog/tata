'use client';
import Link from 'next/link';
import { Coins } from 'lucide-react';

// Inside your Header component in frontend/app/page.jsx:
<div className="flex items-center gap-3">
  {/* Existing Logo & Title */}

  {/* Navigation Link to BTC Page */}
  <Link 
    href="/btc"
    className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-semibold transition-all"
  >
    <Coins className="h-4 w-4" />
    <span>BTC Crypto Terminal</span>
  </Link>
</div>

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, ShieldAlert, Zap, AlertTriangle, 
  BarChart2, Activity, CheckCircle2, Cpu, Database, Search, Power, Sliders, Terminal
} from 'lucide-react';

const INITIAL_WATCHLIST = [
  { symbol: 'TATA.NS', name: 'Tata Motors Ltd.', price: 984.50, change: 18.25, pct: 1.89, ema5: 982.10, ema20: 975.40, rsi: 62.4, signal: 'BUY', trend: 'Bullish Crossover', status: 'Active', volume: '4.2M' },
  { symbol: 'NIFTY50', name: 'Nifty 50 Index', price: 23450.80, change: 124.60, pct: 0.53, ema5: 23410.00, ema20: 23380.50, rsi: 58.9, signal: 'BUY', trend: 'Bullish Crossover', status: 'Active', volume: '18.5M' },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', price: 51200.15, change: -145.30, pct: -0.28, ema5: 51240.00, ema20: 51310.00, rsi: 44.2, signal: 'SELL', trend: 'Bearish Crossover', status: 'Active', volume: '12.1M' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2940.00, change: 32.10, pct: 1.10, ema5: 2935.50, ema20: 2910.20, rsi: 66.8, signal: 'BUY', trend: 'Bullish Crossover', status: 'Paused', volume: '3.1M' },
  { symbol: 'INFY.NS', name: 'Infosys Limited', price: 1540.25, change: -8.40, pct: -0.54, ema5: 1542.00, ema20: 1548.00, rsi: 41.5, signal: 'HOLD', trend: 'Consolidating', status: 'Active', volume: '2.8M' },
  { symbol: 'SILVER.NS', name: 'Silver Futures', price: 89450.00, change: 820.00, pct: 0.93, ema5: 89200.00, ema20: 88600.00, rsi: 61.1, signal: 'BUY', trend: 'Bullish Crossover', status: 'Active', volume: '890K' },
];

const INITIAL_LOGS = [
  { id: 'LOG-9942', timestamp: '15:29:41', symbol: 'TATA.NS', action: 'BUY', qty: 25, price: 984.50, mode: 'PAPER', status: 'EXECUTED', message: 'EMA 5 crossed above EMA 20 (15m timeframe)' },
  { id: 'LOG-9941', timestamp: '15:15:02', symbol: 'NIFTY50', action: 'BUY', qty: 50, price: 23410.00, mode: 'PAPER', status: 'EXECUTED', message: 'Strategy Signal Crossover Confirmed' },
  { id: 'LOG-9940', timestamp: '14:45:18', symbol: 'BANKNIFTY', action: 'SELL', qty: 15, price: 51310.00, mode: 'PAPER', status: 'EXECUTED', message: 'Stop Loss Trailing Triggered' },
  { id: 'LOG-9939', timestamp: '14:00:00', symbol: 'RELIANCE.NS', action: 'HOLD', qty: 0, price: 2910.20, mode: 'SYSTEM', status: 'SKIPPED', message: 'Auto-trade paused for symbol' },
];

// SVG Chart Visualizer Component
function ChartVisualizer({ stock }) {
  const isBullish = stock.signal === 'BUY';
  return (
    <div className="w-full h-full pt-8 pb-2 px-2 flex flex-col justify-end">
      <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 150">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isBullish ? "#06b6d4" : "#f43f5e"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isBullish ? "#06b6d4" : "#f43f5e"} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Background Grid Lines */}
        <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
        <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="3 3" />

        {/* Price Area Fill */}
        <path
          d={isBullish ? "M 0,110 Q 120,90 250,60 T 500,20 L 500,150 L 0,150 Z" : "M 0,20 Q 120,50 250,90 T 500,130 L 500,150 L 0,150 Z"}
          fill="url(#chartGradient)"
        />

        {/* 20 EMA Line (Fuchsia) */}
        <path
          d={isBullish ? "M 0,115 Q 150,105 280,80 T 500,45" : "M 0,30 Q 150,45 280,75 T 500,115"}
          fill="none"
          stroke="#e0e7ff"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* 5 EMA Line (Cyan) */}
        <path
          d={isBullish ? "M 0,125 Q 130,95 260,55 T 500,15" : "M 0,15 Q 130,55 260,95 T 500,135"}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
        />

        {/* Crossover Point Highlight */}
        <circle cx="260" cy={isBullish ? 55 : 95} r="5" fill="#38bdf8" className="animate-ping" />
        <circle cx="260" cy={isBullish ? 55 : 95} r="4" fill="#0284c7" />
      </svg>
    </div>
  );
}

export default function App() {
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [selectedSymbol, setSelectedSymbol] = useState('TATA.NS');
  const [isLiveExecution, setIsLiveExecution] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Risk Parameters
  const [maxOrderQty, setMaxOrderQty] = useState(50);
  const [dailyMaxLoss, setDailyMaxLoss] = useState(5000);
  const [stopLossPct, setStopLossPct] = useState(1.5);
  const [takeProfitPct, setTakeProfitPct] = useState(3.0);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  // System Stats
  const [latency, setLatency] = useState(24);
  const [unrealizedPnL, setUnrealizedPnL] = useState(14250.00);

  // Simulated live market price ticker pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 12) + 18);
      setUnrealizedPnL(prev => prev + (Math.random() > 0.48 ? 45.50 : -38.20));

      setWatchlist(prevList =>
        prevList.map(item => {
          if (Math.random() > 0.6) {
            const delta = (Math.random() - 0.49) * (item.price * 0.002);
            const newPrice = Number((item.price + delta).toFixed(2));
            const newChange = Number((item.change + delta).toFixed(2));
            const newPct = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
            return { ...item, price: newPrice, change: newChange, pct: newPct };
          }
          return item;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAutoExecution = () => {
    if (!isLiveExecution) {
      setShowConfirmModal(true);
    } else {
      setIsLiveExecution(false);
      addLog('SYSTEM', 'Execution Mode Changed to PAPER TRADING', 'INFO');
    }
  };

  const confirmLiveTrading = () => {
    setIsLiveExecution(true);
    setShowConfirmModal(false);
    addLog('SYSTEM', '⚠️ LIVE BROKER EXECUTION ENGINE ACTIVATED', 'WARN');
  };

  const handleKillSwitch = () => {
    if (confirm('EMERGENCY: Are you sure you want to trigger the Kill Switch? All open positions will be squared off immediately and auto-trading paused.')) {
      setKillSwitchActive(true);
      setIsLiveExecution(false);
      setWatchlist(prev => prev.map(w => ({ ...w, status: 'Paused' })));
      addLog('EMERGENCY', 'SQUARED OFF ALL POSITIONS & PAUSED ENGINE', 'DANGER');
    }
  };

  const addLog = (symbol, message, action = 'INFO', price = 0, qty = 0) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      symbol: symbol,
      action: action,
      qty: qty || maxOrderQty,
      price: price || (watchlist.find(w => w.symbol === symbol)?.price || 0),
      mode: isLiveExecution ? 'LIVE' : 'PAPER',
      status: action === 'DANGER' ? 'HALTED' : 'EXECUTED',
      message: message
    };
    setLogs(prev => [newEntry, ...prev]);
  };

  const handleManualTrigger = (symbol, action) => {
    const stock = watchlist.find(w => w.symbol === symbol);
    addLog(symbol, `Manual ${action} signal dispatched by trader`, action, stock?.price, maxOrderQty);
  };

  const toggleStockAutoStatus = (symbol) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.symbol === symbol
          ? { ...item, status: item.status === 'Active' ? 'Paused' : 'Active' }
          : item
      )
    );
  };

  const currentStock = watchlist.find(w => w.symbol === selectedSymbol) || watchlist[0];
  const filteredWatchlist = watchlist.filter(item => 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30">
      
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <Cpu className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                  VM ALGO RESEARCH LAB
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-semibold">
                  PROFIT v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Market: <strong className="text-slate-200">OPEN (NSE/BSE)</strong></span>
                <span className="text-slate-600">|</span>
                <span>Latency: <strong className="font-mono text-cyan-400">{latency}ms</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Total Capital</div>
                <div className="text-sm font-semibold font-mono text-slate-200">₹5,00,000.00</div>
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Margin Used</div>
                <div className="text-sm font-semibold font-mono text-slate-300">₹1,20,000.00</div>
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Unrealized P&L</div>
                <div className={`text-sm font-bold font-mono flex items-center gap-1 ${unrealizedPnL >= 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-rose-400'}`}>
                  {unrealizedPnL >= 0 ? '+' : ''}₹{unrealizedPnL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-mono">
              <Database className="h-3.5 w-3.5" />
              <span>ANGEL ONE API: <strong className="text-emerald-300">CONNECTED</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Engine Controls Section */}
        <div className="lg:col-span-12 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 lg:p-5 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${isLiveExecution ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-100">Auto-Execution Engine</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider ${
                    isLiveExecution 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {isLiveExecution ? 'LIVE ORDERS' : 'PAPER TRADING'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isLiveExecution 
                    ? 'Orders will be dispatched directly to your broker API account' 
                    : 'Simulated execution active. No real capital is at risk'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={handleToggleAutoExecution}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  isLiveExecution ? 'bg-rose-600' : 'bg-slate-700'
                }`}
              >
                <span className="sr-only">Toggle Auto Trade</span>
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    isLiveExecution ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>

              <button
                onClick={handleKillSwitch}
                disabled={killSwitchActive}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-900/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Power className="h-4 w-4" />
                <span>{killSwitchActive ? 'ENGINE HALTED' : 'KILL SWITCH'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5">
              <span className="text-slate-400 flex items-center justify-between">
                <span>Max Order Qty:</span>
                <Sliders className="h-3 w-3 text-cyan-400" />
              </span>
              <div className="flex items-center gap-1 mt-1">
                <input 
                  type="number" 
                  value={maxOrderQty} 
                  onChange={(e) => setMaxOrderQty(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-16 focus:outline-none focus:border-cyan-500 border-b border-slate-700"
                />
                <span className="text-slate-500">units</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5">
              <span className="text-slate-400 flex items-center justify-between">
                <span>Daily Max Loss Cap:</span>
                <ShieldAlert className="h-3 w-3 text-amber-400" />
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-slate-400">₹</span>
                <input 
                  type="number" 
                  value={dailyMaxLoss} 
                  onChange={(e) => setDailyMaxLoss(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-20 focus:outline-none focus:border-cyan-500 border-b border-slate-700"
                />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5">
              <span className="text-slate-400 flex items-center justify-between">
                <span>Stop Loss %:</span>
                <TrendingDown className="h-3 w-3 text-rose-400" />
              </span>
              <div className="flex items-center gap-1 mt-1">
                <input 
                  type="number" 
                  step="0.1"
                  value={stopLossPct} 
                  onChange={(e) => setStopLossPct(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-16 focus:outline-none focus:border-cyan-500 border-b border-slate-700"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5">
              <span className="text-slate-400 flex items-center justify-between">
                <span>Take Profit %:</span>
                <TrendingUp className="h-3 w-3 text-emerald-400" />
              </span>
              <div className="flex items-center gap-1 mt-1">
                <input 
                  type="number" 
                  step="0.1"
                  value={takeProfitPct} 
                  onChange={(e) => setTakeProfitPct(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-16 focus:outline-none focus:border-cyan-500 border-b border-slate-700"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-cyan-400" />
                <span>Strategy Watchlist</span>
              </h3>
              <div className="relative w-48">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500/50 text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1">
              {filteredWatchlist.map((stock) => {
                const isSelected = selectedSymbol === stock.symbol;
                return (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-100">{stock.symbol}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            stock.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            stock.signal === 'SELL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {stock.signal}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{stock.name}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-slate-100">₹{stock.price.toFixed(2)}</div>
                        <div className={`text-xs font-mono font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.pct}%)
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/40 text-[10px] font-mono text-slate-400">
                      <div>5 EMA: <span className="text-cyan-300">₹{stock.ema5}</span></div>
                      <div>20 EMA: <span className="text-fuchsia-300">₹{stock.ema20}</span></div>
                      <div>RSI: <span className="text-slate-200">{stock.rsi}</span></div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs pt-1">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${stock.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        Auto: {stock.status}
                      </span>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleStockAutoStatus(stock.symbol)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                        >
                          {stock.status === 'Active' ? 'Pause' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleManualTrigger(stock.symbol, stock.signal)}
                          className="px-2 py-0.5 rounded bg-cyan-600/80 hover:bg-cyan-500 text-white font-semibold text-[10px]"
                        >
                          Trigger
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    <span>{currentStock.symbol}</span>
                    <span className="text-xs text-slate-400 font-normal">15m Crossover Strategy</span>
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    5 EMA: <span className="text-cyan-400">₹{currentStock.ema5}</span> | 20 EMA: <span className="text-fuchsia-400">₹{currentStock.ema20}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">RSI(14): {currentStock.rsi}</span>
                <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400">Vol: {currentStock.volume}</span>
              </div>
            </div>

            <div className="w-full h-64 bg-slate-950 rounded-lg p-2 border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-4 text-[10px] font-mono bg-slate-900/80 p-1.5 rounded border border-slate-800">
                <span className="flex items-center gap-1 text-slate-200">
                  <span className="h-0.5 w-3 bg-slate-200 inline-block" /> Price Action
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="h-0.5 w-3 bg-cyan-400 inline-block" /> 5 EMA
                </span>
                <span className="flex items-center gap-1 text-fuchsia-400">
                  <span className="h-0.5 w-3 bg-fuchsia-400 inline-block" /> 20 EMA
                </span>
              </div>

              <ChartVisualizer stock={currentStock} />

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-1">
                <span>09:15 AM</span>
                <span>11:30 AM</span>
                <span>01:45 PM</span>
                <span>03:30 PM</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${currentStock.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {currentStock.signal === 'BUY' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Strategy Signal: <span className={currentStock.signal === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>{currentStock.signal} ({currentStock.trend})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Suggested Entry: ₹{currentStock.price.toFixed(2)} | Target: ₹{(currentStock.price * (1 + takeProfitPct/100)).toFixed(2)} | SL: ₹{(currentStock.price * (1 - stopLossPct/100)).toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleManualTrigger(currentStock.symbol, currentStock.signal)}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-900/30"
              >
                Execute Trade
              </button>
            </div>
          </div>
        </div>

        {/* Live Execution Terminal */}
        <div className="lg:col-span-12 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Live Trade Execution & Strategy Signal Terminal</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Auto-scrolling active</span>
          </div>

          <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-56 border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800 pb-2">
                  <th className="pb-2 font-normal">TIME</th>
                  <th className="pb-2 font-normal">ID</th>
                  <th className="pb-2 font-normal">SYMBOL</th>
                  <th className="pb-2 font-normal">ACTION</th>
                  <th className="pb-2 font-normal">QTY</th>
                  <th className="pb-2 font-normal">PRICE</th>
                  <th className="pb-2 font-normal">MODE</th>
                  <th className="pb-2 font-normal">STATUS</th>
                  <th className="pb-2 font-normal">MESSAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2 text-slate-400">{log.timestamp}</td>
                    <td className="py-2 text-slate-500">{log.id}</td>
                    <td className="py-2 font-bold text-slate-200">{log.symbol}</td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.action === 'SELL' ? 'bg-rose-500/20 text-rose-400' :
                        log.action === 'DANGER' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2 text-slate-300">{log.qty}</td>
                    <td className="py-2 text-slate-300">₹{log.price ? log.price.toFixed(2) : '-'}</td>
                    <td className="py-2">
                      <span className={`text-[10px] ${log.mode === 'LIVE' ? 'text-rose-400 font-bold' : 'text-cyan-400'}`}>
                        {log.mode}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2 text-slate-400 truncate max-w-xs">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-8 w-8 animate-bounce" />
              <div>
                <h3 className="font-bold text-lg text-slate-100">Switch to Live Broker Execution?</h3>
                <p className="text-xs text-rose-300">Real money will be deployed on incoming signals.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              You are about to enable <strong>LIVE EXECUTION ENGINE</strong>. Signals generated by VM Algo Research Lab will automatically place real orders on your connected broker account (Angel One API) up to your configured Max Order Quantity ({maxOrderQty} units).
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel (Keep Paper Trading)
              </button>
              <button
                onClick={confirmLiveTrading}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-900/40"
              >
                Confirm Live Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
