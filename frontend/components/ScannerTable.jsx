'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ScannerTable({ onSelectSymbol }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [notifPermission, setNotifPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Request Desktop Notification Permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  };

  // Synthesize Sound Effects using Web Audio API (No external MP3 files required)
  const playSignalChime = (type) => {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'BUY') {
        // High-pitch double beep for BUY
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // Low-pitch double beep for SELL
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.1); // E4
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error('Audio play error:', e);
    }
  };

  // Send Browser Desktop Notification
  const triggerDesktopNotification = (buyCount, sellCount, topBuySymbol) => {
    if (notifPermission === 'granted' && (buyCount > 0 || sellCount > 0)) {
      const title = buyCount > 0 ? `🚀 ${buyCount} New BUY Signal(s)!` : `⚠️ ${sellCount} New SELL Signal(s)!`;
      const body = topBuySymbol 
        ? `Top signal: ${topBuySymbol}. Click to inspect chart.`
        : `Detected ${buyCount} BUY and ${sellCount} SELL crossovers.`;

      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  const runScanner = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/scanner?limit=20&interval=15m');
      const data = res.data;
      setScanResult(data);

      const buyCount = data.summary.buy_count;
      const sellCount = data.summary.sell_count;

      if (buyCount > 0) {
        playSignalChime('BUY');
        triggerDesktopNotification(buyCount, sellCount, data.buy_signals[0]?.symbol);
      } else if (sellCount > 0) {
        playSignalChime('SELL');
        triggerDesktopNotification(buyCount, sellCount, null);
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-100">Live EMA Crossover Scanner</h2>
          <p className="text-xs text-slate-400">Scans universe for fresh 5/20 EMA crossovers</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Toggle Button */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 text-xs rounded-lg border font-mono transition-colors ${
              audioEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Audio Alerts"
          >
            {audioEnabled ? '🔔 Sound ON' : '🔕 Sound OFF'}
          </button>

          {/* Notification Permission Button */}
          {notifPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="px-2 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-lg"
            >
              Enable Push
            </button>
          )}

          {/* Run Scanner Button */}
          <button
            onClick={runScanner}
            disabled={loading}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            {loading ? 'Scanning...' : 'Run Scan'}
          </button>
        </div>
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
                    <span className="text-emerald-400 font-bold">₹{item.close}</span>
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
                    <span className="text-rose-400 font-bold">₹{item.close}</span>
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
