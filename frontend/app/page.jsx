'use client';

import { useState } from 'react';
import StockSearch from '@/components/StockSearch';
import TradingChart from '@/components/TradingChart'; // Your chart component

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('TATA.NS');

  return (
    <div className="p-6 bg-slate-950 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">VM Algo Research Lab</h1>
        
        {/* Stock Search Component */}
        <StockSearch onSelectSymbol={(symbol) => setSelectedSymbol(symbol)} />
      </div>

      <p className="text-sm text-slate-400">Active Symbol: <span className="text-emerald-400 font-bold">{selectedSymbol}</span></p>

      {/* Render Chart for Selected Stock */}
      <TradingChart symbol={selectedSymbol} />
    </div>
  );
}
