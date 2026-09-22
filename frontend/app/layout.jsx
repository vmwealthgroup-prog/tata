import './globals.css'; // Adjust path if globals.css is inside app/ or styles/

export const metadata = {
  title: 'VM Algo Pro | Trading Platform',
  description: 'Real-time algorithmic dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
