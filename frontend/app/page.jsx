'use client';

import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Award 
} from 'lucide-react';

const MetricCard = ({ label, value, change, isPositive }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300 backdrop-blur-md">
    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
    <div className="mt-2 flex items-baseline justify-between">
      <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

export default function HomePage() {
  // ... rest of component
}
