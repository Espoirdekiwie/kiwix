import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Send, 
  ArrowDownLeft, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Key, 
  Lock, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { SecurityPanel } from '../components/SecurityPanel';
import { ApprovalAnalytics } from '../components/ApprovalAnalytics';
import { BlockchainActivityCenter } from '../components/BlockchainActivityCenter';
import { CONTRACT_ADDRESS, shortenAddress } from '../contract';

export const DashboardPage = ({ onOpenReceive }) => {
  const navigate = useNavigate();
  const {
    account,
    isConnected,
    isSepolia,
    isOwner,
    ownerLabel,
    balance,
    transactionCount,
    transactions,
    pendingTransactions,
    executedTransactions,
    requiredApprovals,
    isLoadingData,
    contractReadError,
    lastRefreshed,
    refreshBlockchainData,
  } = useWallet();

  const readyCount = transactions.filter((t) => !t.executed && t.approvalCount >= t.requiredApprovals).length;
  const pendingApprovalCount = transactions.filter((t) => !t.executed && t.approvalCount < t.requiredApprovals).length;
  const etherscanUrl = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. DASHBOARD HEADER: Account, Network & Status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 sm:p-6 border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              KIWIX <span className="text-gradient">WALLET</span>
            </h1>
            <span className="badge-purple text-xs font-mono">
              Sepolia Testnet
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            {isConnected ? (
              <>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-400">Connected Account:</span>
                  <span className="text-cyan-300 font-semibold">{shortenAddress(account)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-semibold font-mono ${isOwner ? 'text-lime-400' : 'text-slate-400'}`}>
                    {ownerLabel}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-amber-300/90 font-medium">
                Wallet not connected. Viewing on-chain smart contract data in read-only mode.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">
              Synced: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}

          <button
            onClick={refreshBlockchainData}
            disabled={isLoadingData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700/80 transition-all flex items-center gap-2 text-xs font-semibold"
            title="Refresh contract state from Sepolia"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </motion.div>

      {/* Contract Read Error Notification if any */}
      {contractReadError && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{contractReadError}</span>
        </div>
      )}

      {/* 2. MAIN BALANCE CARD & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Smart Contract Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 rounded-3xl glass-panel-glow p-6 sm:p-8 relative overflow-hidden border border-purple-500/30 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-lime-500/15 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                Smart Contract Wallet Balance
              </span>
              <a
                href={etherscanUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* REAL Multisig Balance Display */}
            <div className="py-2">
              {isLoadingData ? (
                <div className="space-y-2 py-1">
                  <div className="h-12 w-48 bg-slate-800/60 rounded-xl animate-pulse" />
                  <div className="h-4 w-32 bg-slate-800/40 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-6xl font-heading font-black text-gradient tracking-tight">
                      {balance}
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-300">
                      ETH
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Vault: {shortenAddress(CONTRACT_ADDRESS)}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions Grid: Send, Receive, Transactions, Security */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Link
              to="/send"
              className="btn-primary text-xs !py-2.5 !px-3 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </Link>

            <button
              onClick={onOpenReceive}
              className="btn-secondary text-xs !py-2.5 !px-3 flex items-center justify-center gap-1.5"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Receive</span>
            </button>

            <Link
              to="/transactions"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Activity</span>
            </Link>

            <Link
              to="/security"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              <span>Security</span>
            </Link>
          </div>
        </motion.div>

        {/* 4. REAL ANALYTICS TILES */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {/* Total Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-panel p-5 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Txs</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-3">
              {isLoadingData ? (
                <div className="h-8 w-16 bg-slate-800/60 rounded animate-pulse" />
              ) : (
                <span className="text-2xl sm:text-3xl font-heading font-black text-white font-mono">
                  {transactionCount}
                </span>
              )}
              <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">Proposals on-chain</span>
            </div>
          </motion.div>

          {/* Pending Signatures */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="glass-panel p-5 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3">
              {isLoadingData ? (
                <div className="h-8 w-16 bg-slate-800/60 rounded animate-pulse" />
              ) : (
                <span className="text-2xl sm:text-3xl font-heading font-black text-amber-400 font-mono">
                  {pendingApprovalCount}
                </span>
              )}
              <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">Awaiting signatures</span>
            </div>
          </motion.div>

          {/* Ready to Execute */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-panel p-5 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Ready</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3">
              {isLoadingData ? (
                <div className="h-8 w-16 bg-slate-800/60 rounded animate-pulse" />
              ) : (
                <span className="text-2xl sm:text-3xl font-heading font-black text-cyan-300 font-mono">
                  {readyCount}
                </span>
              )}
              <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">Quorum reached</span>
            </div>
          </motion.div>

          {/* Executed Transfers */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="glass-panel p-5 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Executed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              {isLoadingData ? (
                <div className="h-8 w-16 bg-slate-800/60 rounded animate-pulse" />
              ) : (
                <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-400 font-mono">
                  {executedTransactions.length}
                </span>
              )}
              <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">Settled payouts</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. SECURITY SUMMARY PANEL: 2-of-3 Approval Protection */}
      <SecurityPanel />

      {/* 5. APPROVAL ANALYTICS SECTION */}
      <ApprovalAnalytics />

      {/* 6. RECENT BLOCKCHAIN ACTIVITY SECTION */}
      <BlockchainActivityCenter />
    </div>
  );
};
