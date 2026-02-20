"use client";

import { useEffect, useState } from "react";
import { Horizon } from "@stellar/stellar-sdk";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export default function BalanceCard({ publicKey }: { publicKey: string }) {
    const [balance, setBalance] = useState<string>("0.0000000");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBalance() {
            try {
                setLoading(true);
                setError(null);
                const account = await server.loadAccount(publicKey);
                const nativeBalance = account.balances.find(b => b.asset_type === "native");
                if (nativeBalance) {
                    setBalance(nativeBalance.balance);
                }
            } catch (err: any) {
                console.error("Failed to load account:", err);
                // It's common on testnet for an account to not exist until funded
                if (err?.response?.status === 404) {
                    setError("Account not found on testnet. Please fund it.");
                } else {
                    setError("Failed to fetch balance.");
                }
            } finally {
                setLoading(false);
            }
        }

        if (publicKey) {
            fetchBalance();
        }
    }, [publicKey]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center h-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Available Balance</h3>
            {loading ? (
                <div className="animate-pulse h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            ) : error ? (
                <div className="text-red-500 text-sm text-center">{error}</div>
            ) : (
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {balance} <span className="text-xl text-gray-500 font-normal">XLM</span>
                </div>
            )}
            <p className="text-sm text-gray-400 mt-4 break-all text-center">
                {publicKey}
            </p>
        </div>
    );
}
