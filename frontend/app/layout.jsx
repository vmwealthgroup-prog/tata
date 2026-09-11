import './page.css';

export const metadata = {
  title: 'VM Algo Profit',
  description: 'AI-powered algorithmic trading platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
