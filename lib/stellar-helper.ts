/**
 * Stellar Helper - Blockchain Logic with Stellar Wallets Kit
 * ⚠️ DO NOT MODIFY THIS FILE! ⚠️
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import {
    StellarWalletsKit,
    Networks
} from '@creit-tech/stellar-wallets-kit';
import {
    FreighterModule,
    FREIGHTER_ID
} from '@creit-tech/stellar-wallets-kit/modules/freighter';

export class StellarHelper {
    private server: StellarSdk.Horizon.Server;
    private networkPassphrase: string;
    private network: Networks;
    private publicKey: string | null = null;

    constructor(network: 'testnet' | 'mainnet' = 'testnet') {
        this.server = new StellarSdk.Horizon.Server(
            network === 'testnet'
                ? 'https://horizon-testnet.stellar.org'
                : 'https://horizon.stellar.org'
        );
        this.networkPassphrase =
            network === 'testnet'
                ? StellarSdk.Networks.TESTNET
                : StellarSdk.Networks.PUBLIC;

        this.network = network === 'testnet'
            ? Networks.TESTNET
            : Networks.PUBLIC;

        // Stellar Wallets Kit'i initialize et
        StellarWalletsKit.init({
            network: this.network,
            selectedWalletId: FREIGHTER_ID,
            modules: [
                new FreighterModule()
            ],
        });
    }

    isFreighterInstalled(): boolean {
        return true;
    }

    async connectWallet(): Promise<string> {
        try {
            // Wallet modal'ı aç ve wallet seçildiğinde adresi al
            const { address } = await StellarWalletsKit.authModal({
                // params if needed
            });

            if (!address) {
                throw new Error('Wallet bağlanamadı');
            }

            this.publicKey = address;
            return address;
        } catch (error: unknown) {
            console.error('Wallet connection error:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error('Wallet bağlantısı başarısız: ' + errorMessage);
        }
    }

    async getBalance(publicKey: string): Promise<{
        xlm: string;
        assets: Array<{ code: string; issuer: string; balance: string }>;
    }> {
        const account = await this.server.loadAccount(publicKey);

        const xlmBalance = account.balances.find(
            (b) => b.asset_type === 'native'
        );

        const assets = account.balances
            .filter((b) => b.asset_type !== 'native')
            .map((b) => ({
                code: (b as StellarSdk.Horizon.HorizonApi.BalanceLineAsset).asset_code,
                issuer: (b as StellarSdk.Horizon.HorizonApi.BalanceLineAsset).asset_issuer,
                balance: b.balance,
            }));

        return {
            xlm: xlmBalance && 'balance' in xlmBalance ? xlmBalance.balance : '0',
            assets,
        };
    }

    async sendPayment(params: {
        from: string;
        to: string;
        amount: string;
        memo?: string;
    }): Promise<{ hash: string; success: boolean }> {
        const account = await this.server.loadAccount(params.from);

        const transactionBuilder = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        }).addOperation(
            StellarSdk.Operation.payment({
                destination: params.to,
                asset: StellarSdk.Asset.native(),
                amount: params.amount,
            })
        );

        if (params.memo) {
            transactionBuilder.addMemo(StellarSdk.Memo.text(params.memo));
        }

        const transaction = transactionBuilder.setTimeout(180).build();

        // Wallet Kit ile imzala
        const { signedTxXdr } = await StellarWalletsKit.signTransaction(transaction.toXDR(), {
            networkPassphrase: this.networkPassphrase,
        });

        const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
            signedTxXdr,
            this.networkPassphrase
        );

        const result = await this.server.submitTransaction(
            transactionToSubmit as StellarSdk.Transaction
        );

        return {
            hash: result.hash,
            success: result.successful,
        };
    }

    async getRecentTransactions(
        publicKey: string,
        limit: number = 10
    ): Promise<Array<{
        id: string;
        type: string;
        amount?: string;
        asset?: string;
        from?: string;
        to?: string;
        createdAt: string;
        hash: string;
    }>> {
        const payments = await this.server
            .payments()
            .forAccount(publicKey)
            .order('desc')
            .limit(limit)
            .call();

        return payments.records.map((payment) => {
            const record = payment as unknown as {
                id: string;
                type: string;
                amount?: string;
                asset_type: string;
                asset_code?: string;
                from: string;
                to: string;
                created_at: string;
                transaction_hash: string;
            };
            return {
                id: record.id,
                type: record.type,
                amount: record.amount,
                asset: record.asset_type === 'native' ? 'XLM' : record.asset_code,
                from: record.from,
                to: record.to,
                createdAt: record.created_at,
                hash: record.transaction_hash,
            };
        });
    }

    getExplorerLink(hash: string, type: 'tx' | 'account' = 'tx'): string {
        const network = this.networkPassphrase === StellarSdk.Networks.TESTNET ? 'testnet' : 'public';
        return `https://stellar.expert/explorer/${network}/${type}/${hash}`;
    }

    formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
        if (address.length <= startChars + endChars) {
            return address;
        }
        return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
    }

    disconnect() {
        this.publicKey = null;
        return true;
    }
}

export const stellar = new StellarHelper('testnet');