'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import StockSearch from '@/components/StockSearch';
import TradingChart from '@/components/TradingChart';

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('TATA.NS');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candle & signal data whenever selectedSymbol updates
  useEffect(() => {
    async function fetchSymbolData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/signals/${selectedSymbol}`
        );
        
        // Transform API response into Lightweight Charts format
        const formattedData = response.data.data.map((item) => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
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
  }, [selectedSymbol]);

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">VM Algo Research Lab</h1>
          <p className="text-xs text-slate-400">Live NSE & BSE EMA Crossover Dashboard</p>
        </div>

        {/* Stock Search Component */}
        <StockSearch onSelectSymbol={(symbol) => setSelectedSymbol(symbol)} />
      </div>

      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-lg w-fit">
        <span className="text-xs text-slate-400 uppercase font-semibold">Active Symbol:</span>
        <span className="text-sm font-bold text-emerald-400">{selectedSymbol}</span>
      </div>

      {/* Chart Canvas Container */}
      {loading ? (
        <div className="h-[480px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
          <p className="text-slate-400 text-sm animate-pulse">Fetching live candles for {selectedSymbol}...</p>
        </div>
      ) : error ? (
        <div className="h-[480px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
          <p className="text-rose-400 text-sm">{error}</p>
        </div>
      ) : (
        <TradingChart initialData={chartData} symbol={selectedSymbol} />
      )}
    </div>
  );
}
