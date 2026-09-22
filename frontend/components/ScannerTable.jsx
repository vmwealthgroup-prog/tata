'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ScannerTable({ onSelectSymbol }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const runScanner = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/scanner?limit=20&interval=15m');
      setScanResult(res.data);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-100">Live EMA Crossover Scanner</h2>
          <p className="text-xs text-slate-400">Scans universe for fresh 5/20 EMA crossovers</p>
        </div>
        <button
          onClick={runScanner}
          disabled={loading}
          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg transition-all"
        >
          {loading ? 'Scanning Universe...' : 'Run Scanner'}
        </button>
      </div>

      {scanResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* BUY Signals Column */}
          <div className="border border-emerald-900/40 bg-emerald-950/20 rounded-lg p-3">
            <span className="font-bold text-emerald-400 flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              BUY Crossovers ({scanResult.summary.buy_count})
            </span>
            {scanResult.buy_signals.length === 0 ? (
              <p className="text-slate-500 py-2">No active BUY signals in this frame.</p>
            ) : (
              <div className="space-y-1.5">
                {scanResult.buy_signals.map((item) => (
                  <div
                    key={item.symbol}
                    onClick={() => onSelectSymbol(item.symbol)}
                    className="flex justify-between items-center p-2 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer border border-slate-800 transition-colors"
                  >
                    <span className="font-bold text-slate-200">{item.symbol}</span>
                    <span className="text-emerald-400">₹{item.close}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SELL Signals Column */}
          <div className="border border-rose-900/40 bg-rose-950/20 rounded-lg p-3">
            <span className="font-bold text-rose-400 flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              SELL Crossovers ({scanResult.summary.sell_count})
            </span>
            {scanResult.sell_signals.length === 0 ? (
              <p className="text-slate-500 py-2">No active SELL signals in this frame.</p>
            ) : (
              <div className="space-y-1.5">
                {scanResult.sell_signals.map((item) => (
                  <div
                    key={item.symbol}
                    onClick={() => onSelectSymbol(item.symbol)}
                    className="flex justify-between items-center p-2 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer border border-slate-800 transition-colors"
                  >
                    <span className="font-bold text-slate-200">{item.symbol}</span>
                    <span className="text-rose-400">₹{item.close}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
