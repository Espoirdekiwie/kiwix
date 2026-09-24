import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Globe2, 
  KeyRound, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Zap,
  Layers
} from 'lucide-react';
import { KiwixLogo } from '../assets/KiwixLogo';
import { OwnerNodeVisualizer } from '../components/OwnerNodeVisualizer';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, shortenAddress } from '../contract';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { 
    account, 
    isConnected, 
    isSepolia, 
    connectWallet, 
    isConnecting, 
    hasMetaMask, 
    errorMessage, 
    balance 
  } = useWallet();

  const handleConnect = async () => {
    if (isConnected) {
      navigate('/dashboard');
    } else {
      await connectWallet();
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lime-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1226] border border-lime-500/30 text-xs font-semibold text-lime-300 shadow-lg shadow-lime-500/10">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span>Ethereum Sepolia Network</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 font-mono">Smart Contract Wallet</span>
            </div>

            {/* Main Brand Title & Hero Heading */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="font-heading font-black text-4xl sm:text-6xl tracking-tight text-white leading-none">
                  KIWIX
                </span>
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-lime-500/20 text-lime-300 border border-lime-500/30 font-mono">
                  SMART WALLET
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-100 leading-snug">
                "Your transaction. <br />
                <span className="text-gradient">Your approvals.</span> <br />
                Your control."
              </h2>
            </div>

            {/* Supporting Text */}
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              A smart contract wallet on Ethereum Sepolia with built-in 2-of-3 approval protection. An educational Ethereum smart contract wallet featuring dual-signatory consensus as an additional security mechanism.
            </p>

            {/* Error Message banner if MetaMask was rejected or missing */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Connect MetaMask & Explore Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="btn-primary w-full sm:w-auto text-sm !py-3.5 !px-8 shadow-xl shadow-lime-500/20 flex items-center justify-center gap-2.5 group"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnected ? 'Open Dashboard' : isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/dashboard"
                className="btn-secondary w-full sm:w-auto text-sm !py-3.5 !px-8 flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Wallet</span>
              </Link>
            </div>

            {/* Mini Trust Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left text-xs">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Protection</span>
                <span className="text-white font-mono font-bold text-sm">2-of-3 Quorum</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Vault Balance</span>
                <span className="text-lime-400 font-mono font-bold text-sm">{balance} ETH</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Network</span>
                <span className="text-cyan-300 font-mono font-bold text-sm">Sepolia L1</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Topology Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col items-center justify-center"
          >
            <div className="w-full p-4 sm:p-6 rounded-3xl glass-panel-glow border border-purple-500/30 relative">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-[11px] font-mono text-lime-300 uppercase tracking-wider font-semibold">
                  Smart Contract Architecture
                </span>
                <span className="badge-emerald text-[10px]">
                  2-of-3 Security Protection
                </span>
              </div>
              <OwnerNodeVisualizer />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SMART CONTRACT CONTROLLED FUNDS EXPLANATION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Smart-Contract-Controlled */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-panel p-6 sm:p-7 border border-slate-800 hover:border-lime-500/40 transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-lime-500/20 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-white">
                Smart Contract Vault
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Assets are stored inside an autonomous Ethereum smart contract, not in a single private key. Funds can only move when on-chain consensus conditions are met.
              </p>
            </div>
          </motion.div>

          {/* Card 2: 2-of-3 Approval Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="glass-panel p-6 sm:p-7 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-white">
                2-of-3 Approval Protection
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Dual-signatory verification built directly into the wallet contract. No single compromised key can drain your treasury.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Non-Custodial & Sepolia Powered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="glass-panel p-6 sm:p-7 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Globe2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-white">
                Sepolia Testnet Safe
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Non-custodial integration with MetaMask on Ethereum Sepolia. Safe for educational exploration without exposing real mainnet capital.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
