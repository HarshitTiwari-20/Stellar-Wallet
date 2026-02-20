/**
 * Stellar Payment Dashboard - Main Page
 */

'use client';

import Navbar from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main>
        <Dashboard />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p className="mb-2">
              Built with ❤️ using Stellar SDK | Running on Testnet
            </p>
            <p className="text-xs">
              ⚠️ This is a testnet application. Do not use real funds.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
