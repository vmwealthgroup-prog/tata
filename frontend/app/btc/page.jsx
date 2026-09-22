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
  BarChart2, Activity, CheckCircle2, Cpu, Database, Search, Power, Sliders, Terminal, Coins
} from 'lucide-react';

const INITIAL_BTC_PAIRS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin / Tether Spot', price: 67450.00, change: 1250.50, pct: 1.89, ema5: 67200.00, ema20: 66800.00, rsi: 64.2, signal: 'BUY', trend: 'Bullish Momentum', status: 'Active', volume: '24.5k BTC' },
  { symbol: 'BTCUSDT-PERP', name: 'BTC Perpetual Futures', price: 67485.20, change: 1280.10, pct: 1.93, ema5: 67210.00, ema20: 66790.00, rsi: 65.8, signal: 'BUY', trend: 'Bullish Momentum', status: 'Active', volume: '142.1k BTC' },
  { symbol: 'ETHBTC', name: 'Ethereum / Bitcoin', price: 0.0524, change: -0.0008, pct: -1.50, ema5: 0.0526, ema20: 0.0531, rsi: 41.2, signal: 'SELL', trend: 'Underperforming BTC', status: 'Active', volume: '8.4k ETH' },
  { symbol: 'BTC241227', name: 'BTC Quarterly Futures', price: 68120.00, change: 1310.00, pct: 1.96, ema5: 67900.00, ema20: 67400.00, rsi: 66.1, signal: 'BUY', trend: 'Contango Expansion', status: 'Paused', volume: '4.2k BTC' },
];

const INITIAL_LOGS = [
  { id: 'BTC-8801', timestamp: '15:29:41', symbol: 'BTCUSDT-PERP', action: 'BUY', qty: '0.25 BTC', price: 67450.00, mode: 'PAPER', status: 'EXECUTED', message: 'MACD Golden Cross + 15m Trendline Break' },
  { id: 'BTC-8800', timestamp: '14:15:02', symbol: 'BTCUSDT', action: 'BUY', qty: '0.10 BTC', price: 66900.00, mode: 'PAPER', status: 'EXECUTED', message: 'RSI Oversold Bounce Confirmed' },
  { id: 'BTC-8799', timestamp: '12:45:18', symbol: 'ETHBTC', action: 'SELL', qty: '2.50 ETH', price: 0.0528, mode: 'PAPER', status: 'EXECUTED', message: 'Stop Loss Trailing Triggered' },
];

function BTCChartVisualizer({ pair }) {
  const isBullish = pair.signal === 'BUY';
  return (
    <div className="w-full h-full pt-8 pb-2 px-2 flex flex-col justify-end">
      <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 150">
        <defs>
          <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isBullish ? "#f7931a" : "#f43f5e"} stopOpacity="0.35" />
            <stop offset="100%" stopColor={isBullish ? "#f7931a" : "#f43f5e"} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
        <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="3 3" />

        <path
          d={isBullish ? "M 0,120 Q 100,100 220,50 T 500,15 L 500,150 L 0,150 Z" : "M 0,15 Q 100,50 220,100 T 500,135 L 500,150 L 0,150 Z"}
          fill="url(#btcGradient)"
        />

        <path
          d={isBullish ? "M 0,125 Q 120,105 250,60 T 500,20" : "M 0,20 Q 120,60 250,105 T 500,130"}
          fill="none"
          stroke="#f7931a"
          strokeWidth="2.5"
        />

        <circle cx="250" cy={isBullish ? 60 : 105} r="5" fill="#f7931a" className="animate-ping" />
        <circle cx="250" cy={isBullish ? 60 : 105} r="4" fill="#d97706" />
      </svg>
    </div>
  );
}

export default function BTCAutoTradingPage() {
  const [pairs, setPairs] = useState(INITIAL_BTC_PAIRS);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT-PERP');
  const [isLiveExecution, setIsLiveExecution] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const [leverage, setLeverage] = useState(10);
  const [tradeSizeBTC, setTradeSizeBTC] = useState(0.25);
  const [maxDailyLossUSDT, setMaxDailyLossUSDT] = useState(1000);
  const [stopLossPct, setStopLossPct] = useState(2.0);
  const [takeProfitPct, setTakeProfitPct] = useState(5.0);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  const [latency, setLatency] = useState(18);
  const [unrealizedPnL, setUnrealizedPnL] = useState(2450.80);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 12);
      setUnrealizedPnL(prev => prev + (Math.random() > 0.47 ? 18.40 : -14.10));

      setPairs(prevList =>
        prevList.map(item => {
          if (Math.random() > 0.5) {
            const factor = item.symbol.includes('ETH') ? 0.0001 : 15;
            const delta = (Math.random() - 0.48) * factor;
            const newPrice = Number((item.price + delta).toFixed(item.symbol.includes('ETH') ? 4 : 2));
            const newChange = Number((item.change + delta).toFixed(item.symbol.includes('ETH') ? 4 : 2));
            const newPct = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
            return { ...item, price: newPrice, change: newChange, pct: newPct };
          }
          return item;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const confirmLiveTrading = () => {
    setIsLiveExecution(true);
    setShowConfirmModal(false);
    addLog('SYSTEM', '⚠️ BINANCE / BYBIT LIVE API EXECUTION ENGINE ACTIVATED', 'WARN');
  };

  const handleKillSwitch = () => {
    if (confirm('EMERGENCY: Close all open BTC perpetual positions and halt crypto auto-trading engine immediately?')) {
      setKillSwitchActive(true);
      setIsLiveExecution(false);
      setPairs(prev => prev.map(p => ({ ...p, status: 'Paused' })));
      addLog('EMERGENCY', 'CLOSED ALL CRYPTO POSITIONS & HALTED ENGINE', 'DANGER');
    }
  };

  const addLog = (symbol, message, action = 'INFO', price = 0) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry = {
      id: `BTC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      symbol: symbol,
      action: action,
      qty: `${tradeSizeBTC} BTC`,
      price: price || (pairs.find(p => p.symbol === symbol)?.price || 0),
      mode: isLiveExecution ? 'LIVE API' : 'PAPER',
      status: action === 'DANGER' ? 'HALTED' : 'EXECUTED',
      message: message
    };
    setLogs(prev => [newEntry, ...prev]);
  };

  const currentPair = pairs.find(p => p.symbol === selectedSymbol) || pairs[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
              <Coins className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-500 bg-clip-text text-transparent">
                  BTC ALGO RESEARCH LAB
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-semibold">
                  BTC PROFIT v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Market: <strong className="text-slate-200">24/7 CRYPTO SPOT & PERP</strong></span>
                <span className="text-slate-600">|</span>
                <span>WebSocket Latency: <strong className="font-mono text-amber-400">{latency}ms</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">USDT Balance</div>
                <div className="text-sm font-semibold font-mono text-slate-200">$50,000.00</div>
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Leverage</div>
                <div className="text-sm font-semibold font-mono text-amber-400">{leverage}x Cross</div>
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Open P&L</div>
                <div className={`text-sm font-bold font-mono flex items-center gap-1 ${unrealizedPnL >= 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-rose-400'}`}>
                  {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)} USDT
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-950/40 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-mono">
              <Database className="h-3.5 w-3.5" />
              <span>BINANCE FUTURES API: <strong className="text-amber-300">ONLINE</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Engine Controls */}
        <div className="lg:col-span-12 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 lg:p-5 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${isLiveExecution ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-100">BTC Auto-Execution Engine</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider ${
                    isLiveExecution 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {isLiveExecution ? 'LIVE BROKER API' : 'PAPER TRADING'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-frequency strategy execution engine optimized for Bitcoin spot & perpetual futures
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => isLiveExecution ? setIsLiveExecution(false) : setShowConfirmModal(true)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isLiveExecution ? 'bg-rose-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${isLiveExecution ? 'translate-x-9' : 'translate-x-1'}`} />
              </button>

              <button
                onClick={handleKillSwitch}
                disabled={killSwitchActive}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-900/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Power className="h-4 w-4" />
                <span>{killSwitchActive ? 'HALTED' : 'KILL SWITCH'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4 text-xs">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5">
              <span className="text-slate-400 flex items-center justify-between">
                <span>Leverage:</span>
                <Sliders className="h-3 w-3 text-amber-400" />
              </span>
              <div className="flex items-center gap-1 mt-1">
                <input 
                  type="number" 
                  value={leverage} 
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono font-semibold text-amber-400 w-12 focus:outline-none border-b border-slate-700"
                />
                <span className="text-slate-500">x Cross</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5">
              <span className="text-slate-400 flex items-center justify-between">
                <span>Order Size (BTC):</span>
                <Coins className="h-3 w-3 text-amber-400" />
              </span>
              <div className="flex items-center gap-1 mt-1">
                <input 
                  type="number" 
                  step="0.05"
                  value={tradeSizeBTC} 
                  onChange={(e) => setTradeSizeBTC(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-16 focus:outline-none border-b border-slate-700"
                />
                <span className="text-slate-500">BTC</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5">
              <span className="text-slate-400 flex items-center justify-between">
                <span>Max Loss Limit:</span>
                <ShieldAlert className="h-3 w-3 text-amber-400" />
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-slate-400">$</span>
                <input 
                  type="number" 
                  value={maxDailyLossUSDT} 
                  onChange={(e) => setMaxDailyLossUSDT(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-16 focus:outline-none border-b border-slate-700"
                />
                <span className="text-slate-500">USDT</span>
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
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-12 focus:outline-none border-b border-slate-700"
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
                  className="bg-transparent text-sm font-mono font-semibold text-slate-100 w-12 focus:outline-none border-b border-slate-700"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pairs Watchlist */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-amber-400" />
                <span>Crypto Pairs & Futures</span>
              </h3>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[480px]">
              {pairs.map((pair) => {
                const isSelected = selectedSymbol === pair.symbol;
                return (
                  <div
                    key={pair.symbol}
                    onClick={() => setSelectedSymbol(pair.symbol)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/30'
                        : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-100">{pair.symbol}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            pair.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {pair.signal}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{pair.name}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-slate-100">
                          {pair.symbol.includes('ETH') ? '' : '$'}{pair.price.toLocaleString('en-US')}
                        </div>
                        <div className={`text-xs font-mono font-medium ${pair.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pair.change >= 0 ? '+' : ''}{pair.change} ({pair.pct}%)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs pt-2 border-t border-slate-800/40">
                      <span className="text-[10px] text-slate-500">Auto Trade: <strong className="text-emerald-400">{pair.status}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addLog(pair.symbol, `Manual ${pair.signal} signal triggered for ${tradeSizeBTC} BTC`, pair.signal, pair.price);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] uppercase"
                      >
                        Trigger Signal
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BTC Chart & Signal Box */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    <span>{currentPair.symbol}</span>
                    <span className="text-xs text-slate-400 font-normal">Crypto Trend Model</span>
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    5 EMA: <span className="text-amber-400">${currentPair.ema5}</span> | 20 EMA: <span className="text-orange-400">${currentPair.ema20}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-amber-400">RSI: {currentPair.rsi}</span>
                <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">{currentPair.volume}</span>
              </div>
            </div>

            <div className="w-full h-64 bg-slate-950 rounded-lg p-2 border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
              <BTCChartVisualizer pair={currentPair} />
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-1">
                <span>00:00 UTC</span>
                <span>06:00 UTC</span>
                <span>12:00 UTC</span>
                <span>18:00 UTC</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Signal: <span className="text-emerald-400">{currentPair.signal} ({currentPair.trend})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: ${(currentPair.price * (1 + takeProfitPct/100)).toFixed(2)} \vert{} SL:${(currentPair.price * (1 - stopLossPct/100)).toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => addLog(currentPair.symbol, `Manual position opened for ${tradeSizeBTC} BTC`, currentPair.signal, currentPair.price)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-amber-900/30"
              >
                Execute BTC Trade
              </button>
            </div>
          </div>
        </div>

        {/* Execution Terminal */}
        <div className="lg:col-span-12 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-amber-400" />
              <span>BTC Live Order & Signal Stream</span>
            </h3>
          </div>

          <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-52 border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800 pb-2">
                  <th className="pb-2 font-normal">TIME</th>
                  <th className="pb-2 font-normal">ID</th>
                  <th className="pb-2 font-normal">PAIR</th>
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
                        'bg-red-600 text-white'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2 text-slate-300">{log.qty}</td>
                    <td className="py-2 text-slate-300">${log.price ? log.price.toLocaleString('en-US') : '-'}</td>
                    <td className="py-2"><span className="text-amber-400 font-bold">{log.mode}</span></td>
                    <td className="py-2"><span className="text-emerald-400">{log.status}</span></td>
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
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="h-8 w-8 animate-bounce" />
              <div>
                <h3 className="font-bold text-lg text-slate-100">Connect Binance / Crypto API?</h3>
                <p className="text-xs text-amber-300">Live order routing will be activated for crypto futures.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              You are switching to <strong>LIVE CRYPTO API EXECUTION</strong>. Auto-signals will submit market orders with <strong>{leverage}x Cross Leverage</strong> at <strong>{tradeSizeBTC} BTC per trade</strong> directly to your connected exchange API.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmLiveTrading}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-900/40"
              >
                Enable BTC Live API
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
