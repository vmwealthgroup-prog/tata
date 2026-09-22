import '@/app/globals.css'; // or your global styles

export const metadata = {
  title: 'VM Algo Profit',
  description: 'Trading Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
