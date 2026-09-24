import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCode, 
  Lock, 
  Globe2, 
  KeyRound, 
  Layers,
  Cpu,
  CheckCircle2,
  Info,
  RefreshCw,
  Wallet,
  UserCheck,
  Zap
} from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_OWNERS, REQUIRED_APPROVALS, shortenAddress } from '../contract';
import { useWallet } from '../context/WalletContext';

export const SettingsPage = () => {
  const { 
    account,
    isConnected, 
    isSepolia, 
    isOwner, 
    ownerLabel,
    ownerNumber,
    refreshBlockchainData,
    isLoadingData,
    balance
  } = useWallet();

  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleCopyAccount = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBlockchainData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const etherscanUrl = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. SETTINGS HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Wallet Settings & Configuration
            </h1>
            <p className="text-xs text-slate-400">
              Smart contract parameters, keyholder permissions, and Ethereum Sepolia connection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoadingData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs flex items-center gap-2 font-semibold"
            title="Refresh Blockchain Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing || isLoadingData ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Blockchain Data</span>
          </button>
        </div>
      </motion.div>

      {/* 2. CORE WALLET ATTRIBUTES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Type Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="badge-purple text-[10px] font-mono">ERC-4337 Ready</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
              Wallet Type
            </span>
            <div className="text-xl font-heading font-black text-white mt-0.5">
              Smart Contract Wallet
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Programmable on-chain vault secured by smart contract consensus logic.
            </p>
          </div>
        </motion.div>

        {/* Network Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <span className="badge-cyan text-[10px] font-mono">Chain ID: 11155111</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
              Network
            </span>
            <div className="text-xl font-heading font-black text-white mt-0.5">
              Ethereum Sepolia
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ethereum Layer-1 Proof-of-Stake public testnet with instant settlement.
            </p>
          </div>
        </motion.div>

        {/* Required Approvals Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="badge-emerald text-[10px] font-mono">66.7% Quorum</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
              Required Approvals
            </span>
            <div className="text-xl font-heading font-black text-emerald-400 mt-0.5">
              2 of 3 Owners
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dual-authorization security preventing unauthorized transfers and single-point failure.
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. CONTRACT & CONNECTED ACCOUNT ADDRESS MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Address Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-6 sm:p-7 rounded-3xl border border-purple-500/30 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              <h3 className="font-heading font-bold text-base text-white">
                Smart Contract Address
              </h3>
            </div>
            <span className="badge-purple text-[10px] font-mono">Sepolia Vault</span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-sans">
              Deployed Contract
            </span>
            <div className="p-3 bg-[#070914] rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all font-semibold">
              {CONTRACT_ADDRESS}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={handleCopyContract}
              className="btn-primary text-xs !py-2.5 !px-4 flex items-center gap-1.5 flex-1 justify-center"
            >
              {copiedContract ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span className="font-bold">Contract Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Contract Address</span>
                </>
              )}
            </button>

            <a
              href={etherscanUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs !py-2.5 !px-4 flex items-center gap-1.5 flex-1 justify-center"
            >
              <span>View Contract on Etherscan</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </motion.div>

        {/* Connected Account & Owner Status Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-base text-white">
                Connected Account & Permissions
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
              isOwner 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {isOwner ? 'Owner Signer' : 'Observer'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Connected Address</span>
              <span className={`font-mono ${isOwner ? 'text-lime-400 font-bold' : 'text-slate-400'}`}>
                {isOwner ? `Owner 0${ownerNumber}` : 'Not an owner'}
              </span>
            </div>
            <div className="p-3 bg-[#070914] rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 break-all select-all font-semibold">
              {account || 'No wallet connected'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={handleCopyAccount}
              disabled={!isConnected}
              className={`btn-secondary text-xs !py-2.5 !px-4 flex items-center gap-1.5 flex-1 justify-center ${
                !isConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {copiedAccount ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Account Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Connected Address</span>
                </>
              )}
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoadingData}
              className="btn-primary text-xs !py-2.5 !px-4 flex items-center gap-1.5 flex-1 justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || isLoadingData ? 'animate-spin' : ''}`} />
              <span>Refresh Blockchain Data</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* 4. SOLIDITY CONTRACT ABI & SECURITY MATRIX */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Smart Contract Interface (ABI)
              </h3>
              <p className="text-xs text-slate-400">
                Core Solidity methods and access control rules running on Sepolia
              </p>
            </div>
          </div>

          <span className="badge-purple text-xs font-mono">
            Solidity ^0.8.20
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-sans uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Function</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Access Modifier</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-purple-300">submitTransaction(address _to, uint256 _value)</td>
                <td className="py-3.5 px-4"><span className="badge-purple text-[10px]">Write (Non-Payable)</span></td>
                <td className="py-3.5 px-4"><span className="text-amber-400 font-sans font-semibold">onlyOwner</span></td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">Creates an on-chain transfer proposal. Does NOT send msg.value.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-cyan-300">approveTransaction(uint256 _txId)</td>
                <td className="py-3.5 px-4"><span className="badge-cyan text-[10px]">Write</span></td>
                <td className="py-3.5 px-4"><span className="text-amber-400 font-sans font-semibold">onlyOwner</span></td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">Cryptographically records owner approval for proposal _txId.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-emerald-300">executeTransaction(uint256 _txId)</td>
                <td className="py-3.5 px-4"><span className="badge-emerald text-[10px]">Write (Settlement)</span></td>
                <td className="py-3.5 px-4"><span className="text-amber-400 font-sans font-semibold">onlyOwner</span></td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">Executes payout once quorum of 2/3 approvals is confirmed.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-200">getBalance()</td>
                <td className="py-3.5 px-4"><span className="badge-purple text-[10px]">View</span></td>
                <td className="py-3.5 px-4 text-slate-400 font-sans">Public</td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">Returns current ETH reserves deposited in the vault contract.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-200">getTransactionCount()</td>
                <td className="py-3.5 px-4"><span className="badge-purple text-[10px]">View</span></td>
                <td className="py-3.5 px-4 text-slate-400 font-sans">Public</td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">Returns total historical proposal count created on-chain.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
