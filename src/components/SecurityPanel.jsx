import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Key, Lock, CheckCircle2, UserCheck } from 'lucide-react';
import { CONTRACT_OWNERS, CONTRACT_ADDRESS, REQUIRED_APPROVALS, shortenAddress } from '../contract';
import { useWallet } from '../context/WalletContext';

export const SecurityPanel = () => {
  const { account } = useWallet();
  const normalizedAccount = account ? account.toLowerCase() : null;

  const ownersData = [
    {
      id: 1,
      name: 'OWNER 1',
      address: CONTRACT_OWNERS[0],
      role: 'Signer 01',
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.3)',
    },
    {
      id: 2,
      name: 'OWNER 2',
      address: CONTRACT_OWNERS[1],
      role: 'Signer 02',
      color: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.3)',
    },
    {
      id: 3,
      name: 'OWNER 3',
      address: CONTRACT_OWNERS[2],
      role: 'Signer 03',
      color: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
  ];

  return (
    <div className="glass-panel p-6 sm:p-7 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              2 OF 3 APPROVALS REQUIRED
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Consensus Threshold Quorum (66.6%)
            </p>
          </div>
        </div>

        <span className="badge-purple text-xs">
          M-of-N Multisig
        </span>
      </div>

      {/* Visual Representation Diagram:
           OWNER 1 ─────┐
                        │
           OWNER 2 ─────┼──> MULTISIG WALLET
                        │
           OWNER 3 ─────┘
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 3 Owner Nodes */}
        <div className="lg:col-span-6 space-y-3">
          {ownersData.map((owner) => {
            const isConnected = normalizedAccount === owner.address.toLowerCase();

            return (
              <div
                key={owner.id}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  isConnected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/50'
                    : 'bg-[#090d1f] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${owner.color}20`, border: `1px solid ${owner.color}40` }}
                  >
                    <Key className="w-4 h-4" style={{ color: owner.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-heading">
                        {owner.name}
                      </span>
                      {isConnected && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Connected Signer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300/80">
                      {shortenAddress(owner.address)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${owner.color}15`,
                      borderColor: `${owner.color}40`,
                      color: owner.color,
                    }}
                  >
                    {owner.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Middle / Right: Connection lines to Central Vault */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-[#080b18] rounded-2xl border border-slate-800/80 text-center relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-radial from-purple-900/20 to-transparent blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-3 w-full max-w-xs">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 mx-auto shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-[#0b0f1d] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-cyan-400" />
              </div>
            </div>

            <div>
              <h4 className="font-heading font-black text-sm text-white tracking-wider uppercase">
                MULTISIG WALLET
              </h4>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {shortenAddress(CONTRACT_ADDRESS)}
              </p>
            </div>

            <div className="p-2.5 bg-black/40 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
              <div className="flex items-center justify-between text-[10px] uppercase text-slate-400 mb-1">
                <span>Signing Threshold</span>
                <span className="text-emerald-400 font-bold">2 of 3</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-2/3 h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Statement */}
      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-2.5 text-xs text-slate-300 font-sans">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          Sensitive wallet transactions require approval from at least 2 of the 3 configured owners before execution.
        </p>
      </div>
    </div>
  );
};
