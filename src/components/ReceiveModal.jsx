import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Droplet,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, shortenAddress } from '../contract';

export const ReceiveModal = ({ isOpen, onClose }) => {
  const { balance, refreshBlockchainData, isLoadingData } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0c1022] border border-cyan-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-28 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Receive Funds
                </h3>
                <p className="text-xs text-slate-400">
                  Deposit Sepolia ETH into your KIWIX smart contract wallet
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-5 relative z-10">
            {/* Live Wallet Balance & Refresh Indicator */}
            <div className="p-4 rounded-2xl bg-[#080b18] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block font-sans">
                  Current Vault Balance
                </span>
                <span className="font-heading font-black text-xl text-gradient">
                  {balance} <span className="text-xs font-mono font-normal text-slate-400">ETH</span>
                </span>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoadingData}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1.5 text-xs font-mono"
                title="Refresh balance after receiving funds"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || isLoadingData ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Refresh Balance</span>
              </button>
            </div>

            {/* Smart Contract Wallet Address Container */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Smart Contract Wallet Address (Sepolia)</span>
                <span className="text-cyan-400 font-mono text-[10px]">ERC-4337 Ready</span>
              </div>
              
              <div className="p-3.5 bg-[#070914] rounded-2xl border border-slate-800 space-y-2">
                <div className="font-mono text-xs text-cyan-300 break-all p-2 rounded-xl bg-black/40 border border-slate-800/80 select-all font-semibold leading-relaxed">
                  {CONTRACT_ADDRESS}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={handleCopy}
                    className="btn-primary flex-1 text-xs !py-2.5 flex items-center justify-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-950" />
                        <span className="font-bold">Address Copied!</span>
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
                    className="btn-secondary text-xs !py-2.5 !px-3.5 flex items-center gap-1"
                    title="View contract on Sepolia Etherscan"
                  >
                    <span>Etherscan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Explanatory Message */}
            <div className="p-4 bg-cyan-950/20 rounded-2xl border border-cyan-500/25 text-xs text-slate-200 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="text-cyan-300 font-heading block">Deposit Instruction</strong>
                <p className="leading-relaxed">
                  Send Sepolia ETH to this smart contract wallet address.
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Funds deposited into the contract are held securely under 2-of-3 multisignature approval protection.
                </p>
              </div>
            </div>

            {/* Sepolia Faucet Assistance */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                Need Sepolia Testnet ETH?
              </span>
              <a
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold underline"
              >
                <span>Sepolia Faucet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-1">
              <button onClick={onClose} className="btn-secondary w-full text-xs !py-2.5">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
