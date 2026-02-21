'use client';

import { Github, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/ThemeContext';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`border-b backdrop-blur-sm transition-colors duration-300 ${
        isDark
          ? 'border-white/10 bg-black/20'
          : 'border-gray-300/30 bg-white/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <h1
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Stellar Dashboard
              </h1>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}
              >
                Testnet Payment Interface
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors duration-300 ${
                isDark
                  ? 'text-white/60 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About Stellar
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors duration-300 flex items-center gap-1 ${
                isDark
                  ? 'text-white/60 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Github size={16} /> GitHub
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
