"use client";

import { useState } from "react";
import axios from "axios";

export default function StockSearch({ onSelectSymbol }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/stocks/search?q=${val}`);
      setResults(res.data.results);
    } catch (err) {
      console.error("Failed to search stocks", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search NSE/BSE stock (e.g. TATA, RELIANCE, 500325)..."
        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
      />

      {/* Autocomplete Dropdown */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.symbol}
              onClick={() => {
                onSelectSymbol(item.symbol);
                setResults([]);
                setQuery(item.raw_symbol);
              }}
              className="w-full px-4 py-2.5 text-left flex justify-between items-center hover:bg-slate-800 border-b border-slate-800/50 last:border-0"
            >
              <div>
                <p className="text-sm font-bold text-white">{item.raw_symbol}</p>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.name}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                item.exchange === 'NSE' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {item.exchange}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
