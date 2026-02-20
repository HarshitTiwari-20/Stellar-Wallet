"use client";

import { useState, useEffect } from "react";
import { isAllowed, setAllowed, requestAccess, getAddress } from "@stellar/freighter-api";
import { Wallet } from "lucide-react";

export function WalletConnect() {
    const [pubKey, setPubKey] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        if (await isAllowed()) {
            const data = await getAddress();
            if (data && data.address) {
                setPubKey(data.address);
                // We could dispatch an event or use Context to let the rest of the app know
                window.dispatchEvent(new CustomEvent('walletConnected', { detail: data.address }));
            }
        }
    };

    const connectWallet = async () => {
        setIsConnecting(true);
        try {
            await setAllowed();
            const access = await requestAccess();
            if (access) {
                await checkConnection();
            }
        } catch (error) {
            console.error("Failed to connect Freighter:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        // Freighter doesn't have a specific disconnect, so we just clear local state 
        // real decoupling requires the user to revoke inside the extension
        setPubKey(null);
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
    };

    const truncateAddress = (address: string) => {
        if (!address) return "";
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    if (pubKey) {
        return (
            <button
                onClick={disconnectWallet}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium border border-gray-300 dark:border-gray-600"
            >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {truncateAddress(pubKey)}
            </button>
        );
    }

    return (
        <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
        >
            <Wallet size={18} />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
    );
}
