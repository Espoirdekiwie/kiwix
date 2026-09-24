import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, CheckCircle2 } from 'lucide-react';
import { CONTRACT_OWNERS, CONTRACT_ADDRESS, REQUIRED_APPROVALS, shortenAddress } from '../contract';
import { useWallet } from '../context/WalletContext';

export const OwnerNodeVisualizer = () => {
  const { account } = useWallet();
  const normalizedAccount = account ? account.toLowerCase() : null;

  const nodes = [
    {
      id: 1,
      title: 'OWNER 1',
      address: CONTRACT_OWNERS[0],
      position: 'top',
      containerClass: 'top-2 sm:top-4 left-1/2 -translate-x-1/2',
      color: '#a855f7', // Violet
      glow: 'rgba(168, 85, 247, 0.4)',
    },
    {
      id: 2,
      title: 'OWNER 2',
      address: CONTRACT_OWNERS[1],
      position: 'bottom-left',
      containerClass: 'bottom-4 sm:bottom-6 left-4 sm:left-12',
      color: '#3b82f6', // Electric Blue
      glow: 'rgba(59, 130, 246, 0.4)',
    },
    {
      id: 3,
      title: 'OWNER 3',
      address: CONTRACT_OWNERS[2],
      position: 'bottom-right',
      containerClass: 'bottom-4 sm:bottom-6 right-4 sm:right-12',
      color: '#06b6d4', // Cyan
      glow: 'rgba(6, 182, 212, 0.4)',
    },
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center select-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-blue-600/10 to-cyan-500/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* SVG Connecting Lines with Glowing Effects */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineOwner1" x1="50%" y1="20%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lineOwner2" x1="25%" y1="78%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lineOwner3" x1="75%" y1="78%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
          {/* Subtle perimeter border between owners */}
          <linearGradient id="triBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Triangle Outer Frame */}
        <line x1="50%" y1="20%" x2="22%" y2="78%" stroke="url(#triBorder)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="50%" y1="20%" x2="78%" y2="78%" stroke="url(#triBorder)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="22%" y1="78%" x2="78%" y2="78%" stroke="url(#triBorder)" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Dynamic Glowing Lines to Central Wallet */}
        <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="url(#lineOwner1)" strokeWidth="2.5" strokeDasharray="6 4" />
        <line x1="22%" y1="78%" x2="50%" y2="50%" stroke="url(#lineOwner2)" strokeWidth="2.5" strokeDasharray="6 4" />
        <line x1="78%" y1="78%" x2="50%" y2="50%" stroke="url(#lineOwner3)" strokeWidth="2.5" strokeDasharray="6 4" />

        {/* Orbit Ring around Central Wallet */}
        <circle cx="50%" cy="50%" r="20%" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" strokeDasharray="3 6" />
      </svg>

      {/* CENTRAL [ WALLET ] NODE */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20 flex flex-col items-center justify-center text-center group"
      >
        <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-[0_0_40px_rgba(139,92,246,0.35)] group-hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] transition-all duration-300">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[14px] bg-[#090d1f] flex flex-col items-center justify-center p-2 text-center border border-white/10 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-1 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-wider text-white font-heading">
              [ WALLET ]
            </span>
            <div className="mt-1 flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Lock className="w-2.5 h-2.5" />
              <span>{REQUIRED_APPROVALS} of 3</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-[10px] font-mono text-slate-400 bg-[#0c1024] px-2.5 py-0.5 rounded-full border border-slate-800">
          {shortenAddress(CONTRACT_ADDRESS)}
        </div>
      </motion.div>

      {/* 3 OWNER NODES */}
      {nodes.map((node) => {
        const isConnected = normalizedAccount === node.address.toLowerCase();

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: node.id * 0.15 }}
            className={`absolute z-30 ${node.containerClass}`}
          >
            <div className="flex flex-col items-center group transition-all duration-300 hover:scale-105">
              <div
                className="relative p-0.5 rounded-2xl shadow-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${node.color}, #1e293b)`,
                  boxShadow: isConnected
                    ? `0 0 25px ${node.glow}, 0 0 8px #10b981`
                    : `0 0 15px ${node.glow}`,
                }}
              >
                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-[14px] bg-[#0c1024] p-2 flex flex-col items-center justify-center text-center border border-white/10">
                  <div
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center mb-1 text-white"
                    style={{ backgroundColor: `${node.color}25` }}
                  >
                    <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: node.color }} />
                  </div>
                  <span className="text-[11px] font-bold text-white font-heading">
                    {node.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {shortenAddress(node.address)}
                  </span>
                </div>

                {isConnected && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 border border-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    YOU
                  </div>
                )}
              </div>

              <div
                className="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono border"
                style={{
                  backgroundColor: `${node.color}15`,
                  borderColor: `${node.color}40`,
                  color: '#e2e8f0',
                }}
              >
                Signer 0{node.id}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
