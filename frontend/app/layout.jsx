import './globals.css';

export const metadata = {
  title: 'VM Algo Research Lab',
  description: 'Trading Dashboard & Strategy Analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
