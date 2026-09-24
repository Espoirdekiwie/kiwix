import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  PlusCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  ThumbsUp, 
  PlayCircle, 
  Loader2, 
  Key, 
  ShieldCheck,
  Eye,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWallet } from '../context/WalletContext';
import { BlockchainActivityCenter } from '../components/BlockchainActivityCenter';
import { TransactionDetailsModal } from '../components/TransactionDetailsModal';
import { NewTransactionModal } from '../components/NewTransactionModal';
import { CONTRACT_OWNERS, shortenAddress } from '../contract';

export const TransactionsPage = () => {
  const {
    account,
    isOwner,
    transactions,
    transactionCount,
    isLoadingData,
    refreshBlockchainData,
    approveTransaction,
    executeTransaction,
    txPendingConfirmation,
  } = useWallet();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'ready', 'executed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [processingTxId, setProcessingTxId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = async (txId, e) => {
    e.stopPropagation();
    try {
      setProcessingTxId(txId);
      await approveTransaction(txId);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleExecute = async (txId, e) => {
    e.stopPropagation();
    try {
      setProcessingTxId(txId);
      const receipt = await executeTransaction(txId);
      if (receipt) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingTxId(null);
    }
  };

  // Filtered & Searched Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const isReady = tx.approvalCount >= tx.requiredApprovals && !tx.executed;

      if (activeTab === 'pending' && (tx.executed || isReady)) return false;
      if (activeTab === 'ready' && !isReady) return false;
      if (activeTab === 'executed' && !tx.executed) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = tx.id.toString() === q || `#${tx.id}` === q;
        const addrMatch = tx.to && tx.to.toLowerCase().includes(q);
        return idMatch || addrMatch;
      }

      return true;
    });
  }, [transactions, activeTab, searchQuery]);

  const pendingCount = transactions.filter((t) => !t.executed && t.approvalCount < t.requiredApprovals).length;
  const readyCount = transactions.filter((t) => !t.executed && t.approvalCount >= t.requiredApprovals).length;
  const executedCount = transactions.filter((t) => t.executed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Multisig Transactions
              </h1>
              <p className="text-xs text-slate-400">
                Propose on-chain payouts, verify cryptographic approvals, and execute transfers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshBlockchainData}
            disabled={isLoadingData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1.5 text-xs"
            title="Refresh Transactions from Sepolia"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsNewTxModalOpen(true)}
            className="btn-primary text-xs !py-2.5 !px-4 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl glass-panel border border-slate-800">
        {/* Tabs */}
        <div className="flex items-center gap-1 w-full md:w-auto bg-[#0a0d1e] p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({transactionCount})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('ready')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'ready'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Ready ({readyCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('executed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'executed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Executed ({executedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by ID (#0) or Recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0d1e] border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* TRANSACTIONS GRID */}
      {isLoadingData ? (
        <div className="p-16 text-center rounded-3xl glass-panel space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium font-sans">
            Reading transactions and signature states from Sepolia contract...
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="p-16 text-center rounded-3xl glass-panel space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center">
            <Layers className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">
            {searchQuery
              ? 'No Matching Transactions Found'
              : activeTab === 'pending'
              ? 'No Pending Transactions'
              : activeTab === 'ready'
              ? 'No Transactions Ready to Execute'
              : activeTab === 'executed'
              ? 'No Executed Transactions Yet'
              : 'No Transactions Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
            {searchQuery
              ? 'Try modifying your search address or ID filter.'
              : 'Create a transaction proposal to begin the 2-of-3 multisig workflow.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsNewTxModalOpen(true)}
              className="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Proposal</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTransactions.map((tx) => {
            const isReady = tx.approvalCount >= tx.requiredApprovals && !tx.executed;
            const progressPercent = Math.min(100, (tx.approvalCount / tx.requiredApprovals) * 100);
            const isProcessing = processingTxId === tx.id;

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedTx(tx)}
                className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                {/* Accent Top Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    tx.executed
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : isReady
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse'
                      : 'bg-gradient-to-r from-purple-500 to-amber-500'
                  }`}
                />

                <div className="space-y-4">
                  {/* Card Header: Tx ID & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-purple-300">
                        #{tx.id}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-white">
                          Transaction #{tx.id}
                        </h4>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {tx.executed ? (
                      <span className="badge-emerald text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Executed
                      </span>
                    ) : isReady ? (
                      <span className="badge-cyan text-[11px] animate-pulse">
                        <Zap className="w-3.5 h-3.5" />
                        Ready to Execute
                      </span>
                    ) : (
                      <span className="badge-amber text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        Pending ({tx.approvalCount}/{tx.requiredApprovals})
                      </span>
                    )}
                  </div>

                  {/* Recipient & Amount Info Box */}
                  <div className="p-3.5 rounded-2xl bg-[#090d1f] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Recipient:
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                        <span>{shortenAddress(tx.to)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tx.to, tx.id);
                          }}
                          className="text-slate-400 hover:text-white"
                          title="Copy Address"
                        >
                          {copiedId === tx.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Amount:
                      </span>
                      <div className="font-mono text-base font-bold text-white">
                        {tx.valueEth} <span className="text-purple-400 text-xs font-sans">ETH</span>
                      </div>
                    </div>
                  </div>

                  {/* Approval Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Approval Quorum:</span>
                      <span className={`font-bold ${tx.approvalCount >= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {tx.approvalCount} / {tx.requiredApprovals}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
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

                  {/* 3 Owners Visual Badges */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {CONTRACT_OWNERS.map((ownerAddr, idx) => {
                      const hasApproved = tx.ownerApprovals && tx.ownerApprovals[idx];
                      return (
                        <div
                          key={idx}
                          className={`p-1.5 rounded-lg border text-center text-[10px] font-mono transition-colors ${
                            hasApproved
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-black/30 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="font-sans font-bold">Owner 0{idx + 1}</div>
                          <div>{hasApproved ? '✓' : '○'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Actions: Approve & Execute */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTx(tx);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {!tx.executed && (
                      <>
                        {!tx.userApproved ? (
                          <button
                            onClick={(e) => handleApprove(tx.id, e)}
                            disabled={isProcessing || txPendingConfirmation || !isOwner}
                            className={`btn-secondary text-[11px] !py-1.5 !px-3 flex items-center gap-1 ${
                              !isOwner ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={!isOwner ? 'Only owners can approve' : 'Approve proposal'}
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <ThumbsUp className="w-3 h-3 text-purple-400" />
                            )}
                            <span>Approve</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Approved
                          </span>
                        )}

                        {isReady && (
                          <button
                            onClick={(e) => handleExecute(tx.id, e)}
                            disabled={isProcessing || txPendingConfirmation || !isOwner}
                            className={`btn-emerald text-[11px] !py-1.5 !px-3 flex items-center gap-1 shadow-md shadow-emerald-500/20 ${
                              !isOwner ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <PlayCircle className="w-3 h-3" />
                            )}
                            <span>Execute</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 6. UNIQUE FEATURE: BLOCKCHAIN ACTIVITY CENTER */}
      <BlockchainActivityCenter />

      {/* MODALS */}
      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
      />

      <TransactionDetailsModal
        tx={selectedTx}
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
