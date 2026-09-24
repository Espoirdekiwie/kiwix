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
  QrCode
} from 'lucide-react';
import { CONTRACT_ADDRESS, shortenAddress } from '../contract';

export const ReceiveModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Receive Funds
                </h3>
                <p className="text-xs text-slate-400">
                  Deposit ETH into your KIWIX Smart Contract Wallet
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

          <div className="mt-6 space-y-5">
            {/* Visual QR Simulator Badge */}
            <div className="p-6 bg-[#080b18] rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-lime-500/20 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                <QrCode className="w-14 h-14 text-cyan-300" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                Ethereum Sepolia Smart Contract Address
              </span>
            </div>

            {/* Contract Address Container */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Wallet Address (Sepolia)
              </span>
              <div className="flex items-center justify-between gap-2 p-3 bg-[#070914] rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
                <span className="break-all font-semibold">{CONTRACT_ADDRESS}</span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors shrink-0"
                  title="Copy Address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Educational Notice */}
            <div className="p-3.5 bg-purple-950/20 rounded-xl border border-purple-500/20 text-xs text-purple-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Funds sent to this address are held securely by the smart contract vault and require 2-of-3 owner approvals before any withdrawal can occur.
              </p>
            </div>

            {/* Sepolia Faucet Assistance */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                Need Sepolia Testnet ETH?
              </span>
              <a
                href="https://sepoliafaucet.com"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold underline"
              >
                <span>Sepolia Faucet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2">
              <button onClick={onClose} className="btn-primary w-full text-xs !py-2.5">
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
