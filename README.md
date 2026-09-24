# KIWIX — Smart Contract Wallet

> **"Your transaction. Your approvals. Your control."**  
> *A next-generation Ethereum Smart Contract Wallet featuring 2-of-3 multisignature approval protection, pre-flight liquidity risk evaluation, and real-time on-chain event auditing.*

---

## 📌 Project Overview

**KIWIX** is a decentralized Ethereum **Smart Contract Wallet** engineered to provide institutional-grade asset custody without single points of failure. Unlike standard Externally Owned Accounts (EOAs) where private key loss or compromise results in immediate fund depletion, KIWIX holds assets autonomously within an Ethereum Sepolia smart contract vault and enforces cryptographic threshold consensus before executing any outgoing transfer.

### 🛡️ 2-of-3 Approval Protection
Dual-signatory verification is built directly into the smart contract as an **additional security mechanism**. Out of 3 configured signatory keyholders, at least **2 independent owner approvals** are strictly required on-chain to authorize and settle payouts.

---

## 🚀 Key Features

* **Smart Contract Custody:** Autonomous on-chain vault custody deployed directly on Ethereum Sepolia.
* **2-of-3 Approval Protection:** Democratic M-of-N signature verification enforcing dual-custody before fund release.
* **Educational Transaction Risk Analyzer:** Real-time frontend mathematical analysis evaluating vault liquidity utilization, reserve drain percentages, and address validations before proposal submission.
* **Blockchain Activity Center:** Live chronological event stream tracking contract deposits, transaction proposals, signatory approvals, and payout execution directly on Sepolia.
* **Dedicated Security Center:** Keyholder topology visualizer, quorum inspection matrix, and real-time per-transaction approval auditing.
* **Receive & Deposit Station:** Transparent smart contract address display with one-click copy, balance refresh, and Sepolia faucet links.
* **Non-Custodial MetaMask Integration:** Private keys never leave the user's browser extension; write operations are signed securely via standard EIP-1193 providers.
* **Full Transparency:** Direct verification links to Sepolia Etherscan for all contracts, accounts, and transactions.

---

## 🏛️ System Architecture

```
                  ┌─────────────────────────────────────────┐
                  │          USER / METAMASK SIGNER          │
                  └────────────────────┬────────────────────┘
                                       │ (EIP-1193 Signatures)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │          KIWIX REACT FRONTEND           │
                  │   - Transaction Risk Analyzer (Math)     │
                  │   - Approval Quorum Ledger Matrix       │
                  │   - Blockchain Activity Center          │
                  └────────────────────┬────────────────────┘
                                       │ (ethers.js v6 JSON-RPC)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │      ETHEREUM SEPOLIA BLOCKCHAIN        │
                  │  Smart Contract: 0x0757...54b9          │
                  ├─────────────────────────────────────────┤
                  │  ├── submitTransaction(to, value)       │
                  │  ├── approveTransaction(txId)           │
                  │  ├── executeTransaction(txId)           │
                  │  └── Events: Deposit, Submit, Approve   │
                  └────────────────────┬────────────────────┘
                                       │ (Quorum: 2/3 Owners)
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
             ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
             │   OWNER 01   │  │   OWNER 02   │  │   OWNER 03   │
             │   Primary    │  │   Security   │  │   Recovery   │
             └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🌐 Smart Contract Details (Ethereum Sepolia)

| Parameter | Value |
| :--- | :--- |
| **Network** | Ethereum Sepolia Testnet |
| **Chain ID** | `11155111` (`0xaa36a7`) |
| **Contract Address** | [`0x0757dF7768bEBCdDfC2d97a733eF497A911654b9`](https://sepolia.etherscan.io/address/0x0757dF7768bEBCdDfC2d97a733eF497A911654b9) |
| **Required Quorum** | **2 of 3 Signatures (66.7%)** |
| **Signer 01 (Primary)** | `0x961a5FFFF40232C50729234956B33d56b6852EEd` |
| **Signer 02 (Security)** | `0xB853CCF6E2E6e44BF79cd7e80b17bf363325ed75` |
| **Signer 03 (Recovery)** | `0x87092f8626E711ceDC323a3007A448Ca4582A342` |

---

## 🔄 Transaction Lifecycle Flow

1. **Proposal Creation (`submitTransaction`):**
   - An authorized owner proposes a payout with a valid non-zero recipient address and ETH amount.
   - `submitTransaction(recipient, amountInWei)` is **non-payable**; no funds are sent with the proposal call.
   - The contract creates a proposal record with `executed = false` and assigns an on-chain `txId`.
2. **Pre-flight Risk Analysis:**
   - Real-time frontend math calculates the reserve liquidity drain percentage (`LOW`, `MEDIUM`, `HIGH`).
   - Validates address format, non-zero checksum, owner role, and Sepolia connection.
3. **Multi-Signatory Quorum (`approveTransaction`):**
   - Other configured owners review proposal details in the **Transactions Ledger** or **Security Center**.
   - Calling `approveTransaction(txId)` flips the cryptographic approval state on Sepolia for that owner.
4. **Final Payout Execution (`executeTransaction`):**
   - Once total approvals reach $\ge 2$, the proposal transitions to `Ready to Execute`.
   - Any authorized owner calls `executeTransaction(txId)`, and the smart contract vault autonomously transfers the ETH payout to the recipient.

---

## 💻 Technology Stack

* **Frontend Framework:** React 18 & Vite
* **Web3 Integration:** ethers.js (v6) with BrowserProvider & Fallback JsonRpcProviders
* **Routing:** React Router DOM (v6)
* **Animations:** Framer Motion & Canvas Confetti
* **Design & Styling:** Custom Web3 Glassmorphism tokens, Neon Cyan/Violet/Lime gradients, JetBrains Mono & Plus Jakarta Sans typography
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
│   │   ├── BlockchainActivityCenter.jsx # Real on-chain event stream
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
│   │   ├── ReceivePage.jsx      # Route `/receive` — Dedicated receive & deposit station
│   │   ├── TransactionsPage.jsx # Route `/transactions` — Proposal ledger & execution
│   │   ├── SecurityPage.jsx     # Route `/security` — Security Center with 2-of-3 protection
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

## 🛠️ Installation & Local Setup

### 1. Prerequisites
* **Node.js:** v18.0.0 or higher
* **MetaMask Extension:** Installed in your web browser
* **Testnet Funds:** Free Sepolia ETH from faucets

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Espoirdekiwie/kiwix.git
cd kiwix
npm install
```

### 3. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🌿 Git Branching Workflow

All development followed a strict feature-branch workflow on GitHub:

* **`main`**: Production-ready code containing all merged and verified features.
* **`feature/wallet-transactions`**: Implemented smart contract transaction proposals, real ID extraction, 2-of-3 approval flow, execution triggers, risk analyzer, and activity center.
* **`feature/ui-security-polish`**: Added Security Center, dedicated Receive page/modal, wallet settings, responsive polishing, and final project documentation.

---

## 🔒 Security Considerations

1. **Non-Custodial Architecture:** This application never requests, handles, or stores private keys, seed phrases, or wallet passwords. All write interactions are signed securely within MetaMask.
2. **Zero Fake Blockchain State:** All balances, transaction counts, signer statuses, and activity streams are fetched in real-time from the live Ethereum Sepolia contract.
3. **No Msg.Value on Submission:** `submitTransaction` is strictly non-payable to prevent accidental ether locking during proposal initialization.
4. **Dual Custody Enforcement:** Payouts cannot settle without reaching the 2-of-3 approval threshold on-chain.

---

## 🔮 Future Improvements

* **ERC-4337 Account Abstraction:** Integration with UserOperation bundlers and Paymaster contracts for gasless transactions.
* **Session Keys & Spending Limits:** Automated approval for micropayments below configured threshold limits.
* **Multi-Chain Deployment:** Expanding KIWIX vaults to Arbitrum, Optimism, Base, and Polygon zkEVM.

---

## 📄 License

MIT License. Created for educational and research demonstration purposes.
