'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="text-xl font-bold text-emerald-400 hover:text-emerald-300 transition">
          VM Algo Pro
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/watchlist" className="hover:text-white transition">
            Watchlist
          </Link>
          <Link href="/analytics" className="hover:text-white transition">
            Analytics
          </Link>
        </nav>

        {/* Client Action Button using useRouter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/settings')}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
          >
            Settings
          </button>
        </div>

      </div>
    </header>
  );
}
