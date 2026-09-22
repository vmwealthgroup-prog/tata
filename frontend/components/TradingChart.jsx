"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

export default function TradingChart({ initialData = [], symbol = "TATA.NS" }) {
  const chartContainerRef = useRef(null);
  const seriesRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#090d16" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 480,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    if (initialData.length > 0) {
      candlestickSeries.setData(initialData);
    }
    seriesRef.current = candlestickSeries;

    // 2. Connect to FastAPI WebSocket Stream
    const ws = new WebSocket(`ws://localhost:8000/ws/market-data/${symbol}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const liveCandle = JSON.parse(event.data);
      // Real-time update into TradingView series
      candlestickSeries.update(liveCandle);
    };

    // 3. Handle Responsive Resizing
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (wsRef.current) wsRef.current.close();
      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{symbol}</h3>
          <p className="text-xs text-slate-400">WebSocket Live Tick Feed</p>
        </div>
        <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Streaming
        </span>
      </div>
      <div ref={chartContainerRef} className="w-full rounded-lg overflow-hidden" />
    </div>
  );
}
