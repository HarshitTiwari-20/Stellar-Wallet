import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './ThemeContext';

export const metadata: Metadata = {
  title: 'Stellar Payment Dashboard',
  description: 'Build a payment dashboard on Stellar blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}