import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ArrowDownLeft, 
  PlusCircle, 
  CheckCircle2, 
  PlayCircle, 
  ExternalLink, 
  Clock, 
  Layers, 
  Copy,
  Check,
  Hash
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { shortenAddress } from '../contract';

export const BlockchainActivityCenter = () => {
  const { activityEvents, isLoadingData } = useWallet();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'Deposit':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        );
      case 'TransactionCreated':
      case 'Created':
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <PlusCircle className="w-4 h-4" />
          </div>
        );
      case 'TransactionApproved':
      case 'Approved':
        return (
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'TransactionExecuted':
      case 'Executed':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
            <PlayCircle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
        );
    }
  };

  const getEventName = (type) => {
    switch (type) {
      case 'Deposit':
        return 'Deposit';
      case 'Created':
      case 'TransactionCreated':
        return 'TransactionCreated';
      case 'Approved':
      case 'TransactionApproved':
        return 'TransactionApproved';
      case 'Executed':
      case 'TransactionExecuted':
        return 'TransactionExecuted';
      default:
        return type;
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-7 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-white">
              BLOCKCHAIN ACTIVITY CENTER
            </h3>
            <p className="text-xs text-slate-400">
              Live on-chain event stream from Ethereum Sepolia smart contract
            </p>
          </div>
        </div>

        <span className="badge-purple text-xs font-mono">
          Sepolia Events
        </span>
      </div>

      {/* Activity Timeline List */}
      {isLoadingData ? (
        <div className="space-y-3">
          <div className="h-16 bg-slate-800/40 rounded-2xl animate-pulse" />
          <div className="h-16 bg-slate-800/40 rounded-2xl animate-pulse" />
          <div className="h-16 bg-slate-800/40 rounded-2xl animate-pulse" />
        </div>
      ) : activityEvents.length === 0 ? (
        <div className="p-8 text-center bg-[#080b18] rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
          <Layers className="w-6 h-6 text-slate-600 mx-auto" />
          <p className="font-sans font-medium text-slate-400">No blockchain activity yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {activityEvents.map((event) => {
            const displayEventName = getEventName(event.type);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-2xl bg-[#090d1f] border border-slate-800/80 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  {getEventIcon(event.type)}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading font-bold text-white text-sm">
                        {event.title}
                      </span>
                      
                      {/* Event Type Badge */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          displayEventName === 'TransactionExecuted' || displayEventName === 'Deposit'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : displayEventName === 'TransactionApproved'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {displayEventName}
                      </span>

                      {/* Transaction ID if available */}
                      {event.txId !== undefined && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-purple-300 border border-purple-500/30">
                          Tx #{event.txId}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-xs">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-500 pt-0.5">
                      {event.address && (
                        <div className="flex items-center gap-1">
                          <span>Address:</span>
                          <span className="text-cyan-300 font-semibold">{shortenAddress(event.address)}</span>
                          <button
                            onClick={() => handleCopy(event.address, `addr-${event.id}`)}
                            className="text-slate-500 hover:text-white ml-0.5"
                            title="Copy address"
                          >
                            {copiedId === `addr-${event.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}

                      {event.blockNumber && (
                        <div>
                          <span>Block:</span> <span className="text-slate-300 font-bold">{event.blockNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  {event.amount && (
                    <span className="font-mono text-xs font-bold text-white block">
                      {event.amount} ETH
                    </span>
                  )}
                  {event.txHash ? (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${event.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono mt-1"
                    >
                      <span>Etherscan</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">On-chain state</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
