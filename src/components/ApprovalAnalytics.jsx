import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Check, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_OWNERS, shortenAddress } from '../contract';

export const ApprovalAnalytics = () => {
  const { transactions, pendingTransactions, isLoadingData } = useWallet();

  if (isLoadingData) {
    return (
      <div className="glass-panel p-6 sm:p-7 border border-slate-800 space-y-4">
        <div className="h-6 w-48 bg-slate-800/60 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-slate-800/40 rounded-2xl animate-pulse" />
          <div className="h-44 bg-slate-800/40 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-7 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-white tracking-wide">
              APPROVAL ANALYTICS
            </h3>
            <p className="text-xs text-slate-400">
              Live owner signature matrix & quorum validation on Sepolia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="badge-cyan">
            {pendingTransactions.length} Pending Approvals
          </span>
        </div>
      </div>

      {/* Transactions List / Grid */}
      {transactions.length === 0 ? (
        <div className="p-8 text-center bg-[#080b18] rounded-2xl border border-slate-800/80 space-y-2">
          <Layers className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="font-heading font-bold text-white text-sm">
            No Active Proposals to Analyze
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When a transaction proposal is submitted to the contract, real-time signer approval states will be monitored here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {transactions.map((tx) => {
            const isReady = tx.approvalCount >= tx.requiredApprovals && !tx.executed;
            const progressPercent = Math.min(100, (tx.approvalCount / tx.requiredApprovals) * 100);

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-[#090d1f] ${
                  tx.executed
                    ? 'border-emerald-500/30 hover:border-emerald-500/50'
                    : isReady
                    ? 'border-cyan-500/40 hover:border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'border-amber-500/30 hover:border-amber-500/50'
                }`}
              >
                {/* Header: Tx ID & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                      #{tx.id}
                    </span>
                    <span className="font-heading font-bold text-sm text-white">
                      Transaction #{tx.id}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {tx.executed ? (
                    <span className="badge-emerald text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      Executed
                    </span>
                  ) : isReady ? (
                    <span className="badge-cyan text-[11px] animate-pulse">
                      <Zap className="w-3 h-3" />
                      Ready to Execute
                    </span>
                  ) : (
                    <span className="badge-amber text-[11px]">
                      <Clock className="w-3 h-3" />
                      Pending ({tx.approvalCount}/{tx.requiredApprovals})
                    </span>
                  )}
                </div>

                {/* Recipient & Amount Preview */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/40 border border-slate-800 text-xs font-mono mb-3.5">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Recipient</span>
                    <span className="text-cyan-300 font-medium truncate block">
                      {shortenAddress(tx.to)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Amount</span>
                    <span className="text-white font-bold">{tx.valueEth} ETH</span>
                  </div>
                </div>

                {/* Progress Bar & Quorum Label */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Quorum Progress</span>
                    <span className={`font-bold ${tx.approvalCount >= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {tx.approvalCount} / {tx.requiredApprovals} REQUIRED
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        tx.executed
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : isReady
                          ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                          : 'bg-gradient-to-r from-purple-500 to-amber-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3 Owner Status Matrix */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
                    Signatory Approvals
                  </span>

                  {CONTRACT_OWNERS.map((ownerAddr, idx) => {
                    const hasApproved = tx.ownerApprovals && tx.ownerApprovals[idx];

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono border transition-colors ${
                          hasApproved
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-black/20 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold font-sans text-white text-[11px]">
                            Owner {idx + 1}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({shortenAddress(ownerAddr)})
                          </span>
                        </div>

                        <div>
                          {hasApproved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                              <Check className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              <span className="w-2.5 h-2.5 rounded-full border border-slate-600 inline-block" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
