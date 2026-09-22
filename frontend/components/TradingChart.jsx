'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function TradingChart({ initialData, symbol }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || !initialData || initialData.length === 0) return;

    // 1. Initialize Chart Container
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' }, // slate-900
        textColor: '#94a3b8', // slate-400
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 480,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#334155',
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
    });

    // 2. Add Candlestick Series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // 3. Add EMA 5 Line (Fast - Emerald)
    const ema5Series = chart.addLineSeries({
      color: '#34d399', // emerald-400
      lineWidth: 2,
      title: 'EMA 5',
    });

    // 4. Add EMA 20 Line (Slow - Amber)
    const ema20Series = chart.addLineSeries({
      color: '#fbbf24', // amber-400
      lineWidth: 2,
      title: 'EMA 20',
    });

    // Prepare Datasets
    const candleData = [];
    const ema5Data = [];
    const ema20Data = [];
    const markers = [];

    initialData.forEach((item) => {
      candleData.push({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      });

      if (item.ema5 !== undefined && item.ema5 !== null) {
        ema5Data.push({ time: item.time, value: item.ema5 });
      }

      if (item.ema20 !== undefined && item.ema20 !== null) {
        ema20Data.push({ time: item.time, value: item.ema20 });
      }

      // Add Crossover Markers
      if (item.signal === 'BUY') {
        markers.push({
          time: item.time,
          position: 'belowBar',
          color: '#10b981',
          shape: 'arrowUp',
          text: 'BUY',
        });
      } else if (item.signal === 'SELL') {
        markers.push({
          time: item.time,
          position: 'aboveBar',
          color: '#ef4444',
          shape: 'arrowDown',
          text: 'SELL',
        });
      }
    });

    // Set Data
    candleSeries.setData(candleData);
    ema5Series.setData(ema5Data);
    ema20Series.setData(ema20Data);
    
    // Set Markers on Candlestick Series
    if (markers.length > 0) {
      candleSeries.setMarkers(markers);
    }

    // Auto-fit content to screen
    chart.timeScale().fitContent();

    // Handle Window Resizing
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [initialData, symbol]);

  return (
    <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-900 p-2">
      {/* Chart Legend */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-md text-xs font-mono">
        <span className="font-bold text-slate-200">{symbol}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-emerald-400 rounded-full"></span>
          <span className="text-emerald-400 font-semibold">EMA 5</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-amber-400 rounded-full"></span>
          <span className="text-amber-400 font-semibold">EMA 20</span>
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
