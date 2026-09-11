import { Inter } from 'next/font/google';
import './globals.css';

// Preload subset and swap font display to unblock initial render
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'VM Algo - Quantitative Trading & Research Platform',
  description: 'Algorithmic trading strategies and analytics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
