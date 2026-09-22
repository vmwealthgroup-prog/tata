"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import chart component without SSR
const TradingChart = dynamic(() => import("@/components/TradingChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
      Loading TradingView Engine...
    </div>
  ),
});

export default function DashboardPage() {
  const [chartData, setChartData] = useState([
    { time: "2026-09-18", open: 102.5, high: 105.0, low: 101.2, close: 104.8 },
    { time: "2026-09-19", open: 104.8, high: 107.4, low: 104.0, close: 106.2 },
    { time: "2026-09-20", open: 106.2, high: 108.0, low: 105.5, close: 107.9 },
    { time: "2026-09-21", open: 107.9, high: 110.2, low: 107.0, close: 109.5 },
    { time: "2026-09-22", open: 109.5, high: 112.0, low: 108.8, close: 111.4 },
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Algorithmic Trading Terminal</h1>
          <p className="text-slate-400 text-sm">VM Algo Research Lab Engine</p>
        </div>
      </div>
      <TradingChart data={chartData} symbol="TATA.NS" />
    </div>
  );
}
