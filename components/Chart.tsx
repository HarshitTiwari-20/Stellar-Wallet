'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaSync } from 'react-icons/fa';
import { Card } from './example-components';

interface PriceData {
  time: string;
  price: number;
  timestamp: number;
}

interface ChartProps {
  isDark?: boolean;
}

export default function Chart({ isDark = true }: ChartProps) {
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const fetchPriceData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch price data from CoinGecko API (free, no auth required)
      // Getting last 24 hours of data
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/stellar/market_chart?vs_currency=usd&days=7&interval=hourly'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const data = await response.json();

      // Transform the data
      const prices = data.prices.map((item: [number, number]) => ({
        time: formatTime(item[0]),
        price: parseFloat(item[1].toFixed(4)),
        timestamp: item[0],
      }));

      setChartData(prices);

      // Calculate current price and change
      if (prices.length > 0) {
        const latestPrice = prices[prices.length - 1].price;
        const oldestPrice = prices[0].price;
        setCurrentPrice(latestPrice);
        setPriceChange(((latestPrice - oldestPrice) / oldestPrice) * 100);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chart data';
      setError(errorMessage);
      console.error('Error fetching price data:', err);
      // Fallback with mock data
      setChartData(generateMockData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateMockData = (): PriceData[] => {
    const data: PriceData[] = [];
    const now = Date.now();
    let price = 0.12;

    for (let i = 168; i >= 0; i--) {
      // 7 days of hourly data
      const timestamp = now - i * 3600000;
      const variation = (Math.random() - 0.5) * 0.02;
      price = Math.max(0.08, price + variation);

      data.push({
        time: formatTime(timestamp),
        price: parseFloat(price.toFixed(4)),
        timestamp,
      });
    }

    setCurrentPrice(price);
    setPriceChange((Math.random() - 0.5) * 10);
    return data;
  };

  useEffect(() => {
    fetchPriceData();
  }, []);

  if (loading) {
    return (
      <Card title="📈 XLM Price Chart">
        <div className="animate-pulse">
          <div className="h-80 bg-white/5 rounded-lg mb-4"></div>
          <div className="h-10 bg-white/5 rounded-lg w-1/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📈 XLM Price Chart (7 Days)
          </h2>
          <div className="mt-4 flex items-baseline gap-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Current Price</p>
              <p className="text-4xl font-bold text-white">
                ${currentPrice.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">7d Change</p>
              <p
                className={`text-2xl font-bold ${
                  priceChange >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchPriceData}
          disabled={refreshing}
          className="text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
          title="Refresh price chart"
        >
          <FaSync className={`text-2xl ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-200/90 text-xs">
            ⚠️ Using mock data due to: {error}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="w-full h-80 bg-white/5 border border-white/10 rounded-xl p-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              />
              <XAxis
                dataKey="time"
                stroke={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
                tick={{ fontSize: 12 }}
                domain={['dataMin - 0.01', 'dataMax + 0.01']}
                label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{
                  color: isDark ? 'white' : 'black',
                }}
                formatter={(value: number | undefined) => {
                  if (value === undefined) return ['N/A', 'XLM Price'];
                  return [`$${value.toFixed(4)}`, 'XLM Price'];
                }}
              />
              <Legend
                wrapperStyle={{
                  color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                name="XLM Price"
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/40">No data available</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-200/90 text-xs">
          💡 <strong>Tip:</strong> Data updates every hour. Prices are in USD.
        </p>
      </div>
    </Card>
  );
}
