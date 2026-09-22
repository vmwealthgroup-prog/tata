'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold tracking-tight text-blue-400">
        VM ALGO PROFIT
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
        <Link 
          href="/" 
          className={`hover:text-white transition-colors ${pathname === '/' ? 'text-blue-400 font-semibold' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/analytics" 
          className={`hover:text-white transition-colors ${pathname === '/analytics' ? 'text-blue-400 font-semibold' : ''}`}
        >
          Analytics
        </Link>
        <Link 
          href="/settings" 
          className={`hover:text-white transition-colors ${pathname === '/settings' ? 'text-blue-400 font-semibold' : ''}`}
        >
          Settings
        </Link>
      </nav>
    </header>
  );
}
