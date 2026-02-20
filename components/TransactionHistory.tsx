"use client";

import { useEffect, useState } from "react";
import { Horizon } from "@stellar/stellar-sdk";
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export default function TransactionHistory({ publicKey }: { publicKey: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        // Fetch recent payments and path payments for this account
        const payments = await server.payments().forAccount(publicKey).order("desc").limit(10).call();
        setHistory(payments.records);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }

    if (publicKey) {
      fetchHistory();
    }
  }, [publicKey]);

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const getTransactionIcon = (record: any) => {
    if (record.type === "payment" && record.to === publicKey) {
      return <ArrowDownLeft className="text-green-500" size={20} />;
    }
    if (record.type === "payment" && record.from === publicKey) {
      return <ArrowUpRight className="text-red-500" size={20} />;
    }
    return <ArrowRightLeft className="text-blue-500" size={20} />;
  };

  const getTransactionLabel = (record: any) => {
    if (record.type === "payment") {
      return record.to === publicKey ? "Received XLM" : "Sent XLM";
    }
    return record.type_i === 0 ? "Account Created" : typeof record.type === "string" ? record.type : "Unknown";
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-6 w-full">No recent transactions found.</div>;
  }

  return (
    <div className="space-y-3 w-full animate-in fade-in duration-500">
      {history.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center">
              {getTransactionIcon(record)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {getTransactionLabel(record)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(record.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="text-right">
            {record.type === "payment" ? (
              <>
                <p className={`font-semibold ${record.to === publicKey ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                  {record.to === publicKey ? '+' : '-'}{parseFloat(record.amount || "0").toFixed(2)} XLM
                </p>
                <p className="text-xs text-gray-400">
                  {record.to === publicKey ? `from ${truncate(record.from)}` : `to ${truncate(record.to)}`}
                </p>
              </>
            ) : record.type_i === 0 ? (
              // Account created (CreateAccount records have 'starting_balance')
              <p className="font-semibold text-green-500">
                +{parseFloat(record.starting_balance || "0").toFixed(2)} XLM
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
