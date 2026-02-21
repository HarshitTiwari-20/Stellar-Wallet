# 🌟 Stellar Wallet & Testnet Dashboard

> **Stellar Payment Interface built for speed, testing, and excellent UX.**

A complete, modern web application for interacting with the Stellar blockchain Testnet. Connect your favorite Stellar wallet, monitor your balance, and run test transactions in seconds—all behind a stunning, responsive UI.

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)

---

## ✨ What's Inside?

<img width="1008" height="900" alt="Dashboard Screenshot" src="https://github.com/HarshitTiwari-20/Stellar-Wallet/blob/main/public/Screenshot%20from%202026-02-22%2001-21-45.png" />

### 🏦 Complete Wallet & Asset Management
* **Seamless Connection**: Built-in support for Freighter and other major Stellar wallets via [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit).
* **Live Balances**: Real-time XLM balance tracking with automatic updates and manual refresh.
* **Smart Transfers**: Send XLM with full validation (address formats, sufficient funds, optional memos).
* **Rich History**: Automatic transaction indexing with success/failure feedback, copyable hashes, and direct links to Stellar Expert.

### 🎨 Premium UI Experience
* **Dark & Light Themes**: Fully responsive UI that adapts to your system preferences.
* **Dynamic Feedback**: Loading skeletons, smooth spinners, and clear error boundaries.
* **Mobile Ready**: Pristine layout and interaction design across all device sizes.

---

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/HarshitTiwari-20/Stellar-Wallet.git
   cd stellar-white-belt-wallet-app
   npm install  # or yarn/pnpm
   ```

2. **Run Locally**
   ```bash
   npm run dev
   ```
   *Visit [http://localhost:3000](http://localhost:3000) to see your app running!*

3. **Get Testnet Funds**
   To test the dashboard:
   - Connect your Freighter wallet
   - Switch Freighter to the **Testnet** network
   - Use the [Friendbot](https://laboratory.stellar.org/#account-creator?network=test) to fund your address with free test XLM!

---

## 🏗️ Architecture

- **Core**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Web3**: `@stellar/stellar-sdk` & `@creit.tech/stellar-wallets-kit`
- **Tooling**: Turbopack & React Icons

```text
├── app/                  # Next.js App Router
├── components/           # Modular UI Components
└── lib/                  # Stellar Blockchain Logic 
```

---

## 🔒 Security & Support
This is a **demo application** running on the Stellar Testnet. 
- **Do not** use real Mainnet keys.
- Testnet XLM has no monetary value.

Built for the Stellar ecosystem! 🚀
