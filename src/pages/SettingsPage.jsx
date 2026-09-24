import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  GraduationCap, 
  FileCode, 
  Lock, 
  Globe2, 
  KeyRound, 
  Layers,
  Cpu,
  CheckCircle2,
  Info
} from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_OWNERS, REQUIRED_APPROVALS, shortenAddress } from '../contract';
import { useWallet } from '../context/WalletContext';

export const SettingsPage = () => {
  const { isConnected, isSepolia, isOwner, ownerLabel } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const etherscanUrl = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              KIWIIEE <span className="text-gradient">MULTISIG</span>
            </h1>
            <p className="text-xs text-slate-400">
              Educational 2-of-3 Smart Contract Wallet
            </p>
          </div>
        </div>

        <a
          href={etherscanUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary text-xs !py-2.5 !px-4 flex items-center gap-2"
        >
          <span>View Contract on Etherscan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </motion.div>

      {/* CONTRACT SPECIFICATIONS & NETWORK OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Contract Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <h2 className="font-heading font-bold text-lg text-white">
                Contract Specifications
              </h2>
            </div>
            <span className="badge-emerald text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active on Sepolia
            </span>
          </div>

          {/* Contract Address Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Contract Address</span>
              <span className="text-cyan-400 font-mono">{shortenAddress(CONTRACT_ADDRESS)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-3.5 bg-[#070914] rounded-2xl border border-slate-800 font-mono text-xs text-slate-200">
              <span className="break-all select-all font-semibold text-cyan-300">{CONTRACT_ADDRESS}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors shrink-0"
                title="Copy Contract Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Key Parameters Matrix */}
          <div className="grid grid-cols-2 gap-3.5 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[#080b18] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                Network
              </span>
              <span className="text-sm font-bold text-white block">
                Sepolia Testnet
              </span>
              <span className="text-[10px] text-emerald-400 font-sans">Ethereum L1 Testnet</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b18] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                Chain ID
              </span>
              <span className="text-sm font-bold text-cyan-300 block">
                11155111
              </span>
              <span className="text-[10px] text-slate-500">Hex: 0xaa36a7</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b18] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                Quorum Threshold
              </span>
              <span className="text-sm font-bold text-emerald-400 block">
                2 of 3 (66.6%)
              </span>
              <span className="text-[10px] text-slate-400 font-sans">Requires 2 signatures</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080b18] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                Signer Accounts
              </span>
              <span className="text-sm font-bold text-purple-300 block">
                3 Registered Keys
              </span>
              <span className="text-[10px] text-slate-400 font-sans">Immutable Signers</span>
            </div>
          </div>

          {/* Etherscan Direct Link Button */}
          <div className="pt-2">
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full text-xs !py-3 flex items-center justify-center gap-2"
            >
              <span>View Contract on Etherscan</span>
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>
          </div>
        </motion.div>

        {/* Right: Academic Project Info & Role Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Academic Project
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  College Blockchain Demonstration
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              KIWIIEE MULTISIG is an educational decentralized application built to demonstrate multi-signature consensus, non-custodial smart contract custody, and threshold authorization protocols.
            </p>

            {/* Current Session Connection Status */}
            <div className="p-4 rounded-2xl bg-[#080b18] border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Your Current Session
              </span>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Connection:</span>
                <span className={`font-mono font-bold ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isConnected ? 'MetaMask Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Network:</span>
                <span className={`font-mono font-bold ${isSepolia ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSepolia ? 'Sepolia (Valid)' : 'Non-Sepolia'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Role:</span>
                <span className={`font-mono font-bold ${isOwner ? 'text-purple-300' : 'text-slate-400'}`}>
                  {ownerLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Powered by React, Vite, ethers.js & Framer Motion
          </div>
        </motion.div>
      </div>

      {/* EDUCATIONAL EXPLANATIONS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            Educational Architecture
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
            How Multisig Blockchain Security Works
          </h2>
          <p className="text-xs text-slate-400">
            A comprehensive breakdown of key concepts for faculty presentation and blockchain learners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Multisig Wallets */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-white">
              Multisig Wallets
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard wallets rely on a single private key (Single Point of Failure). Multi-signature wallets store funds inside a smart contract, requiring multiple independent signatures to authorize transfers.
            </p>
          </div>

          {/* Pillar 2: 2-of-3 Approvals */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-white">
              2-of-3 Approvals
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In a 2-of-3 model, any 2 out of the 3 registered owners must independently call <code className="text-cyan-300 font-mono text-[11px]">approveTransaction()</code> before the payout can be executed on-chain.
            </p>
          </div>

          {/* Pillar 3: Sepolia Testnet */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-white">
              Sepolia Testnet
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ethereum Sepolia is an official proof-of-stake test network mimicking Ethereum mainnet. It allows students and developers to experiment with real smart contract execution without real financial risk.
            </p>
          </div>

          {/* Pillar 4: Educational Purpose */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-white">
              Educational Purpose
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered specifically as a university capstone demonstration. Highlights state synchronization between MetaMask, ethers.js, smart contract events, and modern Web3 UI design.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CORE SMART CONTRACT ABI METHODS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileCode className="w-5 h-5 text-purple-400" />
          <h3 className="font-heading font-bold text-base text-white">
            Solidity Smart Contract Interface
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-sans">
                <th className="py-2.5 px-3">Function Signature</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Access</th>
                <th className="py-2.5 px-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 text-purple-300">submitTransaction(address _to, uint256 _value)</td>
                <td className="py-2.5 px-3 text-amber-400">Write (External)</td>
                <td className="py-2.5 px-3 text-emerald-400">Owner Only</td>
                <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Proposes a new outgoing payment</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-cyan-300">approveTransaction(uint256 _txId)</td>
                <td className="py-2.5 px-3 text-amber-400">Write (External)</td>
                <td className="py-2.5 px-3 text-emerald-400">Owner Only</td>
                <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Submits signer cryptographic approval</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-300">executeTransaction(uint256 _txId)</td>
                <td className="py-2.5 px-3 text-amber-400">Write (External)</td>
                <td className="py-2.5 px-3 text-emerald-400">Owner Only (≥2 Approvals)</td>
                <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Executes payout transfer on Sepolia</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-300">getBalance()</td>
                <td className="py-2.5 px-3 text-blue-400">View (Read)</td>
                <td className="py-2.5 px-3 text-slate-400">Public</td>
                <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Returns vault ETH balance</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-300">getTransactionCount()</td>
                <td className="py-2.5 px-3 text-blue-400">View (Read)</td>
                <td className="py-2.5 px-3 text-slate-400">Public</td>
                <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Returns total proposed transactions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
