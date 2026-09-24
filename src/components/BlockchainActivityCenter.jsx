import React from 'react';
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
  Sparkles
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { shortenAddress } from '../contract';

export const BlockchainActivityCenter = () => {
  const { activityEvents, isLoadingData } = useWallet();

  const getEventIcon = (type) => {
    switch (type) {
      case 'Deposit':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        );
      case 'Created':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <PlusCircle className="w-4 h-4" />
          </div>
        );
      case 'Approved':
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'Executed':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <PlayCircle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
            <Activity className="w-4 h-4" />
          </div>
        );
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
              Live on-chain event stream & immutable ledger verification
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
          <div className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
          <div className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
          <div className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
        </div>
      ) : activityEvents.length === 0 ? (
        <div className="p-8 text-center bg-[#080b18] rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
          <Layers className="w-6 h-6 text-slate-600 mx-auto" />
          <p>No contract event activity detected yet on Sepolia.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {activityEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3.5 rounded-2xl bg-[#090d1f] border border-slate-800/80 hover:border-purple-500/30 transition-all flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                {getEventIcon(event.type)}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-white text-sm">
                      {event.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        event.type === 'Executed' || event.type === 'Deposit'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : event.type === 'Approved'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{event.description}</p>
                  {event.address && (
                    <div className="font-mono text-[11px] text-slate-500 pt-0.5">
                      Address: <span className="text-cyan-300">{shortenAddress(event.address)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                {event.amount && (
                  <span className="font-mono text-xs font-bold text-white block">
                    {event.amount} ETH
                  </span>
                )}
                {event.txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${event.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono mt-1"
                  >
                    <span>Etherscan</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
