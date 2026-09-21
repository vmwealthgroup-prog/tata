'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Zap, 
  LogOut, 
  RefreshCw,
  BarChart2
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [backendStatus, setBackendStatus] = useState('Connecting...');
  const [isLive, setIsLive] = useState(false);

  // Check connectivity with your Flask backend on mount
  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:5000/health');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus(data.status || 'Connected');
          setIsLive(true);
        } else {
          setBackendStatus('Backend Error');
          setIsLive(false);
        }
      } catch (err) {
        setBackendStatus('Backend Offline (Port 5000)');
        setIsLive(false);
      }
    }

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">VM Algo Pro</h1>
            <p className="text-xs text-slate-400">Algorithmic Trading Dashboard</p>
          </div>
        </div>

        {/* Backend Health Badge */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-300 font-medium">{backendStatus}</span>
          </div>

          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-medium">NIFTY 50 Index</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">24,850.40</p>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 mt-1 inline-block">
              +0.85% (+210.30)
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-medium">BANK NIFTY</span>
              <BarChart2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">52,140.10</p>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 mt-1 inline-block">
              +0.42% (+218.00)
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-medium">Active Strategy</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">VWAP + RSI Breakout</p>
            <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 mt-1 inline-block">
              Running (15m)
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-medium">Risk Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">Safe</p>
            <span className="text-xs text-slate-400 mt-1 block">Max Drawdown Limit: 2.0%</span>
          </div>
        </div>

        {/* Chart Container Placeholder */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 min-h-[420px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Live Execution & Chart</h2>
              <p className="text-xs text-slate-400">Real-time OHLC feeds & execution markers</p>
            </div>
            <button className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Chart Data</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-6 border border-dashed border-slate-800 rounded-lg p-12 text-center">
            <div>
              <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">Lightweight Charts Container Ready</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Pass your candlestick data array from Flask to initialize the chart canvas here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
