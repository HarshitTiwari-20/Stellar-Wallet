'use client';

import { useState, useEffect } from 'react';
import WalletConnection from '@/components/WalletConnection';
import BalanceDisplay from '@/components/BalanceDisplay';
import Chart from '@/components/Chart';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory from '@/components/TransactionHistory';
import Header from '@/components/Header';
import { useTheme } from '@/app/ThemeContext';

export default function HomeContent() {
  const { isDark } = useTheme();
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConnect = (key: string) => {
    setPublicKey(key);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setPublicKey('');
    setIsConnected(false);
  };

  const handlePaymentSuccess = () => {
    // Refresh balance and transaction history
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-black to-blue-900'
          : 'bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50'
      }`}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {!isConnected && (
          <div
            className={`mb-8 border rounded-2xl p-8 text-center transition-colors duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500/30'
                : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300'
            }`}
          >
            <h2
              className={`text-3xl font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Welcome to Stellar Payment Dashboard! 👋
            </h2>
            <p
              className={`max-w-2xl mx-auto transition-colors duration-300 ${
                isDark ? 'text-white/70' : 'text-gray-600'
              }`}
            >
              Connect your wallet to view your balance, send XLM payments, and track your transaction history.
              All on Stellar's lightning-fast blockchain.
            </p>
          </div>
        )}

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>

        {/* Dashboard Content - Only show when connected */}
        {isConnected && publicKey && (
          <div className="space-y-8">
            {/* Balance Section */}
            <div key={`balance-${refreshKey}`}>
              <BalanceDisplay publicKey={publicKey} />
            </div>

            {/* Chart Section */}
            <div>
              <Chart isDark={isDark} />
            </div>

            {/* Two Column Layout for Payment Form and Transaction History */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div>
                <PaymentForm publicKey={publicKey} onSuccess={handlePaymentSuccess} />
              </div>

              {/* Transaction History */}
              <div key={`history-${refreshKey}`}>
                <TransactionHistory publicKey={publicKey} />
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div
                className={`backdrop-blur-lg rounded-xl p-6 border transition-colors duration-300 ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/80 border-gray-300/30'
                }`}
              >
                <div className="text-3xl mb-3">⚡</div>
                <h3
                  className={`font-semibold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Lightning Fast
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-white/60' : 'text-gray-600'
                  }`}
                >
                  Transactions settle in 3-5 seconds on Stellar network
                </p>
              </div>

              <div
                className={`backdrop-blur-lg rounded-xl p-6 border transition-colors duration-300 ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/80 border-gray-300/30'
                }`}
              >
                <div className="text-3xl mb-3">💰</div>
                <h3
                  className={`font-semibold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Low Fees
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-white/60' : 'text-gray-600'
                  }`}
                >
                  Transaction fees are just 0.00001 XLM (~$0.000001)
                </p>
              </div>

              <div
                className={`backdrop-blur-lg rounded-xl p-6 border transition-colors duration-300 ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/80 border-gray-300/30'
                }`}
              >
                <div className="text-3xl mb-3">🔒</div>
                <h3
                  className={`font-semibold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Secure
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-white/60' : 'text-gray-600'
                  }`}
                >
                  Built on proven blockchain technology with wallet encryption
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Getting Started Guide - Only show when not connected */}
        {!isConnected && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className={`backdrop-blur-lg rounded-xl p-6 border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-300/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-2xl transition-colors duration-300 ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-200'
                }`}
              >
                1️⃣
              </div>
              <h3
                className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Install a Wallet
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}
              >
                Choose any Stellar wallet: Freighter, xBull, Lobstr, Albedo, and more!
              </p>
            </div>

            <div
              className={`backdrop-blur-lg rounded-xl p-6 border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-300/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-2xl transition-colors duration-300 ${
                  isDark ? 'bg-purple-500/20' : 'bg-purple-200'
                }`}
              >
                2️⃣
              </div>
              <h3
                className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Connect
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}
              >
                Click the connect button above and approve the connection request
              </p>
            </div>

            <div
              className={`backdrop-blur-lg rounded-xl p-6 border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-300/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-2xl transition-colors duration-300 ${
                  isDark ? 'bg-pink-500/20' : 'bg-pink-200'
                }`}
              >
                3️⃣
              </div>
              <h3
                className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Get Testnet XLM
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}
              >
                Use Friendbot to fund your testnet account with free XLM
              </p>
            </div>

            <div
              className={`backdrop-blur-lg rounded-xl p-6 border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-300/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-2xl transition-colors duration-300 ${
                  isDark ? 'bg-indigo-500/20' : 'bg-indigo-200'
                }`}
              >
                4️⃣
              </div>
              <h3
                className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Start Sending
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}
              >
                Send XLM payments and track your transactions in real-time
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t mt-16 transition-colors duration-300 ${
          isDark
            ? 'border-white/10'
            : 'border-gray-300/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div
            className={`text-center text-sm transition-colors duration-300 ${
              isDark ? 'text-white/40' : 'text-gray-600'
            }`}
          >
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
