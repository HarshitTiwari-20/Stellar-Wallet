"use client";

import { useEffect, useState } from "react";
import { isAllowed, setAllowed, requestAccess, getAddress } from "@stellar/freighter-api";
import { Horizon } from "@stellar/stellar-sdk";
import { Wallet, RefreshCw, Send, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export function Dashboard() {
    const [pubKey, setPubKey] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>("0.00");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Payment state
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [isSending, setIsSending] = useState(false);

    // History state
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        checkFreighter();
    }, []);

    useEffect(() => {
        if (pubKey) {
            fetchAccountData();
        }
    }, [pubKey]);

    const checkFreighter = async () => {
        if (await isAllowed()) {
            const data = await getAddress();
            if (data && data.address) {
                setPubKey(data.address);
            }
        }
    };

    const handleConnect = async () => {
        try {
            await setAllowed();
            const access = await requestAccess();
            if (access) {
                await checkFreighter();
            }
        } catch (error) {
            console.error("Connection failed", error);
        }
    };

    const fetchAccountData = async () => {
        if (!pubKey) return;
        setIsRefreshing(true);
        try {
            // Fetch Balance
            const account = await server.loadAccount(pubKey);
            const nativeBalance = account.balances.find(b => b.asset_type === "native");
            if (nativeBalance) {
                setBalance(parseFloat(nativeBalance.balance).toFixed(2));
            }

            // Fetch History
            const payments = await server.payments().forAccount(pubKey).order("desc").limit(5).call();
            setHistory(payments.records);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            // testnet account might not exist
            setBalance("0.00");
        } finally {
            setIsRefreshing(false);
        }
    };

    const truncate = (str: string) => `${str.slice(0, 4)}...${str.slice(-4)}`;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-black font-sans min-h-[calc(100vh-100px)]">
            <div className="w-full max-w-sm space-y-4">

                {/* Connect Wallet Card */}
                <div className=" border border-[#222222] rounded-xl p-3 shadow-lg">
                    {pubKey ? (
                        <div className="flex items-center justify-between px-2 py-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-gray-300 text-sm font-medium pr-4">{truncate(pubKey)}</span>
                            </div>
                            <button onClick={() => setPubKey(null)} className="text-xs text-gray-500 hover:text-gray-300">Disconnect</button>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            className=" bg-[#6727b9] hover:bg-violet-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
                        >
                            <Wallet size={40} className="" /> Connect Wallet
                        </button>
                    )}
                </div>

                {/* Balance Card */}
                <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-white tracking-wide">Balance</h3>
                        <button
                            onClick={fetchAccountData}
                            disabled={isRefreshing || !pubKey}
                            className={`text-gray-500 hover:text-white transition-colors p-1 ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>
                    <div className="flex items-end gap-2 mt-3">
                        <span className="text-3xl font-extrabold text-white leading-none">{balance}</span>
                        <span className="text-gray-400 text-sm font-bold mb-1">XLM</span>
                    </div>
                </div>

                {/* Send XLM Card */}
                <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 tracking-wide">
                        <Send size={14} className="text-blue-400" /> Send XLM
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Recipient Address</label>
                            <input
                                type="text"
                                placeholder="G..."
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#555] transition-colors placeholder-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Amount (XLM)</label>
                            <input
                                type="number"
                                placeholder="0.0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#555] transition-colors placeholder-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Memo (Optional)</label>
                            <input
                                type="text"
                                placeholder="Transaction memo..."
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#555] transition-colors placeholder-gray-600"
                            />
                        </div>

                        <button
                            disabled={!pubKey || !recipient || !amount || isSending}
                            className={`w-full font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-2 transition-all duration-200 ${pubKey && recipient && amount
                                    ? "bg-[#3A3C50] hover:bg-[#4A4C60] text-blue-300"
                                    : "bg-[#2A2A35] text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            <Send size={16} /> {isSending ? "Sending..." : "Send XLM"}
                        </button>
                    </div>
                </div>

                {/* Feature: Recent Transactions */}
                {pubKey && history.length > 0 && (
                    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-sm font-bold text-white mb-4 tracking-wide">Recent Transactions</h3>
                        <div className="space-y-3">
                            {history.map((record) => {
                                const isReceived = record.to === pubKey;
                                return (
                                    <div key={record.id} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-full ${isReceived ? 'bg-green-500/10 text-green-500' : 'bg-[#3A3C50] text-gray-400'}`}>
                                                {isReceived ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-white text-xs font-semibold">{isReceived ? "Received" : "Sent"} XLM</p>
                                                <p className="text-gray-500 text-[10px]">{new Date(record.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${isReceived ? 'text-green-400' : 'text-white'}`}>
                                                {isReceived ? '+' : '-'}{parseFloat(record.amount || "0").toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
