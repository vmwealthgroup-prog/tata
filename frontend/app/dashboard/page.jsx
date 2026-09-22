'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import StockSearch from '@/components/StockSearch';
import TradingChart from '@/components/TradingChart';
import ScannerTable from '@/components/ScannerTable';

const TIMEFRAMES = [
  { label: '1M', interval: '1m', period: '1d' },
  { label: '5M', interval: '5m', period: '5d' },
  { label: '15M', interval: '15m', period: '1mo' },
  { label: '1D', interval: '1d', period: '6mo' },
];

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('TATA.NS');
  const [activeTf, setActiveTf] = useState(TIMEFRAMES[2]); // Default 15M
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candle & signal data whenever selectedSymbol OR activeTf changes
  useEffect(() => {
    async function fetchSymbolData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/signals/${selectedSymbol}?interval=${activeTf.interval}&period=${activeTf.period}`
        );

        const formattedData = response.data.data.map((item) => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          ema5: item.ema5,
          ema20: item.ema20,
          signal: item.signal,
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
        setError('Failed to load chart data for ' + selectedSymbol);
      } finally {
        setLoading(false);
      }
    }

    if (selectedSymbol) {
      fetchSymbolData();
    }
  }, [selectedSymbol, activeTf]);

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">VM Algo Research Lab</h1>
          <p className="text-xs text-slate-400">Live NSE & BSE EMA Crossover Dashboard</p>
        </div>

        {/* Stock Search Component */}
        <StockSearch onSelectSymbol={(symbol) => setSelectedSymbol(symbol)} />
      </div>

      {/* Control Strip: Active Symbol + Timeframes */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 uppercase font-semibold">Active Symbol:</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">{selectedSymbol}</span>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-md border border-slate-800">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.interval}
              onClick={() => setActiveTf(tf)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                activeTf.interval === tf.interval
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chart Canvas + Real-Time Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Trading Chart */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[480px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
              <p className="text-slate-400 text-sm animate-pulse">
                Fetching {activeTf.label} candles for {selectedSymbol}...
              </p>
            </div>
          ) : error ? (
            <div className="h-[480px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          ) : (
            <TradingChart initialData={chartData} symbol={selectedSymbol} />
          )}
        </div>

        {/* Right Column (1/3): Live EMA Scanner Widget */}
        <div className="lg:col-span-1">
          <ScannerTable onSelectSymbol={(symbol) => setSelectedSymbol(symbol)} />
        </div>
      </div>
    </div>
  );
}
