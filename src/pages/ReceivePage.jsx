import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Droplet,
  QrCode,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, shortenAddress } from '../contract';

export const ReceivePage = () => {
  const { balance, refreshBlockchainData, isLoadingData } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBlockchainData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Receive Funds
            </h1>
            <p className="text-xs text-slate-400">
              Deposit Sepolia ETH directly into your KIWIX smart contract wallet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#070914] p-2.5 rounded-2xl border border-slate-800">
          <span className="text-slate-400 font-sans">Current Balance:</span>
          <span className="text-lime-400 font-bold text-sm">{balance} ETH</span>
        </div>
      </motion.div>

      {/* Main Receive Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6 relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Live Vault Balance & Refresh Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#080b18] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block font-sans">
              Smart Contract Vault Reserves
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-3xl sm:text-4xl text-gradient">
                {balance}
              </span>
              <span className="text-lg font-mono font-bold text-slate-300">ETH</span>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoadingData}
            className="btn-primary text-xs !py-3 !px-5 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing || isLoadingData ? 'animate-spin' : ''}`} />
            <span>Refresh Balance</span>
          </button>
        </div>

        {/* Contract Address Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider font-heading">
            <span>Smart Contract Wallet Address (Sepolia)</span>
            <span className="text-cyan-400 font-mono text-[11px]">Ethereum Sepolia</span>
          </div>

          <div className="p-4 bg-[#070914] rounded-2xl border border-slate-800 space-y-3">
            <div className="font-mono text-sm sm:text-base text-cyan-300 break-all select-all p-3 rounded-xl bg-black/40 border border-slate-800/80 font-bold leading-relaxed">
              {CONTRACT_ADDRESS}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopy}
                className="btn-primary flex-1 text-xs !py-3 flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    <span className="font-bold">Address Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary flex-1 text-xs !py-3 flex items-center justify-center gap-2"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Explanatory Message */}
        <div className="p-4 sm:p-5 bg-cyan-950/25 rounded-2xl border border-cyan-500/30 text-xs sm:text-sm text-slate-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white font-heading font-bold text-sm block">
              Send Sepolia ETH to this smart contract wallet address.
            </strong>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              All deposits sent directly to this address are immediately secured under the wallet's 2-of-3 multisignature approval protection mechanism. Any outgoing payout requires consent from at least 2 authorized signers.
            </p>
          </div>
        </div>

        {/* Faucets assistance */}
        <div className="p-4 bg-[#080b18] rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Droplet className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Need Sepolia Testnet ETH for testing?</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
            >
              <span>Google Cloud Faucet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://sepoliafaucet.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
            >
              <span>Alchemy Faucet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReceivePage;
