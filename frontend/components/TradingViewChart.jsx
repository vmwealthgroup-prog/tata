'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function TradingViewChart({
  data = [
    { time: '2026-09-15', open: 110.1, high: 112.5, low: 108.2, close: 111.4 },
    { time: '2026-09-16', open: 111.4, high: 115.0, low: 110.5, close: 114.2 },
    { time: '2026-09-17', open: 114.2, high: 116.8, low: 113.1, close: 115.8 },
    { time: '2026-09-18', open: 115.8, high: 118.0, low: 114.0, close: 113.5 },
    { time: '2026-09-21', open: 113.5, high: 116.2, low: 112.8, close: 115.0 },
    { time: '2026-09-22', open: 115.0, high: 117.4, low: 114.5, close: 116.8 },
  ],
}) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize Chart Container with dark theme styling
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' }, // Slate-900
        textColor: '#94a3b8', // Slate-400
      },
      grid: {
        vertLines: { color: '#1e293b' }, // Slate-800
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // 2. Add Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981', // Emerald-500
      downColor: '#ef4444', // Red-500
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeries.setData(data);

    // 3. Handle Window Resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-200 font-bold text-lg">TATA.NS — Candlestick Chart</h3>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-mono border border-emerald-500/20">
          Live Stream
        </span>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
}
