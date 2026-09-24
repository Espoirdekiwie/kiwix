# KIWIX — Smart Contract Wallet

> **"Your transaction. Your approvals. Your control."**  
> *An educational Ethereum smart contract wallet featuring 2-of-3 approval protection as an additional security mechanism.*

---

## 📌 Project Overview

**KIWIX** is a decentralized Ethereum smart contract wallet engineered to provide institutional-grade asset custody without single points of failure. Unlike standard Externally Owned Accounts (EOAs) where private key loss or compromise results in immediate fund depletion, KIWIX holds assets autonomously within an Ethereum Sepolia smart contract vault and enforces cryptographic threshold consensus before executing any outgoing transfer.

### 🛡️ 2-of-3 Approval Protection
Dual-signatory verification is built directly into the smart contract. Out of 3 configured signatory keyholders, at least **2 independent owner approvals** are strictly required on-chain to authorize and settle payouts.

---

## 🚀 Key Features

* **Smart Contract Custody:** Autonomous on-chain vault custody on Ethereum Sepolia.
* **2-of-3 Threshold Quorum:** Democratic M-of-N signature verification enforcing dual-custody.
* **Transaction Risk Analyzer:** Real-time frontend mathematical analysis evaluating vault liquidity utilization, reserve drain percentages, and address validations before proposal submission.
* **Blockchain Activity Center:** Live chronological event stream tracking contract deposits, transaction proposals, signatory approvals, and payout execution directly on Sepolia.
* **Non-Custodial MetaMask Integration:** Private keys never leave the user's browser extension; signatures are generated via standard EIP-1193 providers.
* **Full Transparency:** Direct verification links to Sepolia Etherscan for all contracts, accounts, and transactions.

---

## 🌐 Smart Contract Details (Ethereum Sepolia)

| Parameter | Value |
| :--- | :--- |
| **Network** | Ethereum Sepolia Testnet |
| **Chain ID** | `11155111` (`0xaa36a7`) |
| **Contract Address** | [`0x0757dF7768bEBCdDfC2d97a733eF497A911654b9`](https://sepolia.etherscan.io/address/0x0757dF7768bEBCdDfC2d97a733eF497A911654b9) |
| **Required Quorum** | **2 of 3 Signatures (66.6%)** |
| **Signer 01 (Primary)** | `0x961a5FFFF40232C50729234956B33d56b6852EEd` |
| **Signer 02 (Security)** | `0xB853CCF6E2E6e44BF79cd7e80b17bf363325ed75` |
| **Signer 03 (Recovery)** | `0x87092f8626E711ceDC323a3007A448Ca4582A342` |

---

## 💻 Technology Stack

* **Frontend Framework:** React 18 & Vite
* **Web3 Integration:** ethers.js (v6) with BrowserProvider & Fallback JsonRpcProviders
* **Routing:** React Router DOM (v6)
* **Animations:** Framer Motion & Canvas Confetti
* **Design & Styling:** TailwindCSS, Custom Web3 Dark Theme, Glassmorphism Tokens
* **Icons:** Lucide React

---

## 📁 Project Structure

```
kiwix/
├── public/
│   └── logo.svg                 # Futuristic KIWIX vector emblem
├── src/
│   ├── assets/
│   │   └── KiwixLogo.jsx        # Geometric kiwi + stylized X logo component
│   ├── components/
│   │   ├── Navbar.jsx           # Wallet-oriented navigation bar
│   │   ├── Footer.jsx           # Web3 footer & contract reference
│   │   ├── NetworkBanner.jsx    # Sepolia network detection & switcher banner
│   │   ├── OwnerNodeVisualizer.jsx # 3-Owner to central wallet topology diagram
│   │   ├── SecurityPanel.jsx    # 2-of-3 threshold meter & signer cards
│   │   ├── ApprovalAnalytics.jsx# Live owner signature matrix
│   │   ├── BlockchainActivityCenter.jsx # On-chain event stream
│   │   ├── TransactionRiskAnalyzer.jsx  # Pre-submission mathematical risk analyzer
│   │   ├── TransactionDetailsModal.jsx  # Proposal inspection modal
│   │   ├── NewTransactionModal.jsx      # Quick proposal modal
│   │   ├── ReceiveModal.jsx     # QR code & deposit modal
│   │   └── ToastContainer.jsx   # Real-time Web3 notification alerts
│   ├── context/
│   │   └── WalletContext.jsx    # Reactive wallet & contract state provider
│   ├── pages/
│   │   ├── LandingPage.jsx      # Route `/` — Landing screen
│   │   ├── ConnectPage.jsx      # Route `/connect` — Dedicated connection hub
│   │   ├── DashboardPage.jsx    # Route `/dashboard` — Main wallet dashboard
│   │   ├── SendPage.jsx         # Route `/send` — Outgoing transfer proposal interface
│   │   ├── TransactionsPage.jsx # Route `/transactions` — Proposal ledger & execution
│   │   ├── SecurityPage.jsx     # Route `/security` — 2-of-3 approval security status
│   │   └── SettingsPage.jsx     # Route `/settings` — Contract specifications & guide
│   ├── contract.js              # ABI, contract address, and ethers.js helpers
│   ├── App.jsx                  # Main application shell with routing
│   ├── main.jsx                 # Entrypoint
│   └── index.css                # Custom CSS design system
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🛠️ How to Run Locally

### 1. Prerequisites
* Node.js (v18 or later)
* MetaMask Browser Extension

### 2. Installation
```bash
git clone https://github.com/Espoirdekiwie/kiwix.git
cd kiwix
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Security & Academic Integrity Notes

1. **Non-Custodial Architecture:** This application never requests, handles, or stores private keys, seed phrases, or wallet passwords. All write interactions are signed securely within MetaMask.
2. **Zero Fake Blockchain State:** All balances, transaction counts, signer statuses, and activity streams are fetched in real-time from the live Ethereum Sepolia contract.
3. **Educational Scope:** Built as an academic demonstration for collegiate blockchain and decentralized systems faculty review.

---

## 📄 License
MIT License. Created for educational and research demonstration purposes.
