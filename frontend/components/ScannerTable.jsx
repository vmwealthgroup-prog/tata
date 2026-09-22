'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export default function ScannerTable({ onSelectSymbol }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [notifPermission, setNotifPermission] = useState('default');

  // Check Indian Market Hours (9:15 AM - 3:30 PM IST, Mon-Fri)
  const checkMarketHours = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const istTimeString = now.toLocaleString('en-US', options);
    const istDate = new Date(istTimeString);

    const day = istDate.getDay(); // 0 = Sun, 6 = Sat
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Mon-Fri: 9:15 AM (555 min) to 3:30 PM (930 min)
    const isWeekday = day >= 1 && day <= 5;
    const isWithinHours = totalMinutes >= 555 && totalMinutes <= 930;

    return isWeekday && isWithinHours;
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
    setIsMarketOpen(checkMarketHours());
  }, []);

  // Synthesize Sound Effects
  const playSignalChime = (type) => {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'BUY') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error('Audio play error:', e);
    }
  };

  // Run Scanner Function
  const runScanner = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/scanner?limit=20&interval=15m');
      const data = res.data;
      setScanResult(data);
      setLastScanTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' }));

      const buyCount = data.summary.buy_count;
      const sellCount = data.summary.sell_count;

      if (buyCount > 0) {
        playSignalChime('BUY');
      } else if (sellCount > 0) {
        playSignalChime('SELL');
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setLoading(false);
    }
  }, [audioEnabled]);

  // Auto Scan Interval Effect (Every 30 seconds during market hours)
  useEffect(() => {
    let intervalId;

    if (autoScan) {
      // Run immediately on toggle
      runScanner();

      intervalId = setInterval(() => {
        const currentlyOpen = checkMarketHours();
        setIsMarketOpen(currentlyOpen);

        // Run scan if market is open (or remove checkMarketHours check during testing)
        if (currentlyOpen) {
          runScanner();
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoScan, runScanner]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-100">Live EMA Crossover Scanner</h2>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                isMarketOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {lastScanTime ? `Last scanned at ${lastScanTime} IST` : 'Auto-polling every 30s during market hours'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Scan Toggle Switch */}
          <button
            onClick={() => setAutoScan(!autoScan)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              autoScan
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoScan ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            {autoScan ? 'Auto 30s: ON' : 'Auto 30s: OFF'}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 text-xs rounded-lg border font-mono transition-colors ${
              audioEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {audioEnabled ? '🔔' : '🔕'}
          </button>

          {/* Manual Run Scan Button */}
          <button
            onClick={runScanner}
            disabled={loading}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            {loading ? 'Scanning...' : 'Run Scan'}
          </button>
        </div>
      </div>

      {/* Signals Display */}
      {scanResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* BUY Signals */}
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

          {/* SELL Signals */}
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
