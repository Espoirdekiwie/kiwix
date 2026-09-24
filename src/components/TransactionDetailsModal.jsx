import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  ThumbsUp, 
  PlayCircle, 
  Loader2, 
  Key, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_OWNERS, shortenAddress } from '../contract';

export const TransactionDetailsModal = ({ tx, isOpen, onClose }) => {
  const { 
    account, 
    isOwner, 
    approveTransaction, 
    executeTransaction, 
    txPendingConfirmation 
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionError, setActionError] = useState('');

  if (!isOpen || !tx) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = async () => {
    setActionError('');
    try {
      setIsApproving(true);
      await approveTransaction(tx.id);
    } catch (err) {
      setActionError(err.message || 'Approval failed');
    } finally {
      setIsApproving(false);
    }
  };

  const handleExecute = async () => {
    setActionError('');
    try {
      setIsExecuting(true);
      await executeTransaction(tx.id);
    } catch (err) {
      setActionError(err.message || 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const isReady = tx.approvalCount >= tx.requiredApprovals && !tx.executed;
  const progressPercent = Math.min(100, (tx.approvalCount / tx.requiredApprovals) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0c1022] border border-purple-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-sm text-purple-300">
                #{tx.id}
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Transaction #{tx.id} Details
                </h3>
                <span className="text-xs text-slate-400">
                  On-chain proposal on Ethereum Sepolia
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-6 space-y-5">
            {/* Status Pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#080b18] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Execution Status
              </span>
              <div>
                {tx.executed ? (
                  <span className="badge-emerald font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Executed
                  </span>
                ) : isReady ? (
                  <span className="badge-cyan font-semibold animate-pulse">
                    <Zap className="w-3.5 h-3.5" />
                    Ready to Execute
                  </span>
                ) : (
                  <span className="badge-amber font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Pending ({tx.approvalCount}/{tx.requiredApprovals})
                  </span>
                )}
              </div>
            </div>

            {/* Recipient & Amount Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#080b18] border border-slate-800 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-semibold">
                  Recipient Address
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-bold truncate">
                    {tx.to}
                  </span>
                  <button
                    onClick={() => handleCopy(tx.to)}
                    className="text-slate-400 hover:text-white shrink-0"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`https://sepolia.etherscan.io/address/${tx.to}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-400 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-semibold">
                  Payout Amount
                </span>
                <div className="text-xl font-heading font-black text-gradient">
                  {tx.valueEth} ETH
                </div>
              </div>
            </div>

            {/* Approval Progress Bar */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#080b18] border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Signer Quorum Progress
                </span>
                <span className={`font-bold ${tx.approvalCount >= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {tx.approvalCount} / {tx.requiredApprovals} Approvals
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
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
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Owner Signature Verification (Sepolia)
              </span>

              <div className="space-y-2">
                {CONTRACT_OWNERS.map((ownerAddr, idx) => {
                  const hasApproved = tx.ownerApprovals && tx.ownerApprovals[idx];
                  const isCurrentWallet = account && account.toLowerCase() === ownerAddr.toLowerCase();

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                        hasApproved
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-[#080b18] border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Key className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-sans">Owner 0{idx + 1}</span>
                            {isCurrentWallet && (
                              <span className="badge-purple text-[9px] !py-0 !px-1.5">You</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{shortenAddress(ownerAddr)}</span>
                        </div>
                      </div>

                      <div>
                        {hasApproved ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs bg-black/40 px-2.5 py-1 rounded-full border border-slate-800">
                            <span className="w-2.5 h-2.5 rounded-full border border-slate-600" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Non-owner / Permission notice */}
            {!isOwner && (
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Observer Mode:</strong> Your wallet is not one of the 3 multisig owners. Approvals and execution can only be performed by registered signers.
                </span>
              </div>
            )}

            {/* Error banner */}
            {actionError && (
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Action Buttons */}
            {!tx.executed && (
              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                {/* Approve Button */}
                {!tx.userApproved ? (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || txPendingConfirmation || !isOwner}
                    className={`btn-secondary text-xs !py-2.5 !px-4 flex items-center gap-2 ${
                      !isOwner ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        <span>Approving in MetaMask...</span>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4 text-purple-400" />
                        <span>Approve Transaction</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> You Have Approved
                  </span>
                )}

                {/* Execute Button */}
                <button
                  onClick={handleExecute}
                  disabled={!isReady || isExecuting || txPendingConfirmation || !isOwner}
                  className={`text-xs !py-2.5 !px-5 flex items-center gap-2 rounded-xl font-bold transition-all ${
                    isReady && isOwner
                      ? 'btn-emerald shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Executing in MetaMask...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>Execute Transaction</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
