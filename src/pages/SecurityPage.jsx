import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Copy, 
  Check, 
  ExternalLink, 
  UserCheck, 
  AlertTriangle,
  Info,
  RefreshCw,
  Eye,
  ThumbsUp,
  PlayCircle,
  Loader2,
  Users
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { 
  CONTRACT_OWNERS, 
  CONTRACT_ADDRESS, 
  REQUIRED_APPROVALS, 
  shortenAddress, 
  getMultisigContract 
} from '../contract';
import { OwnerNodeVisualizer } from '../components/OwnerNodeVisualizer';

export const SecurityPage = () => {
  const { 
    account, 
    isOwner, 
    ownerNumber, 
    transactions, 
    pendingTransactions, 
    isLoadingData, 
    refreshBlockchainData,
    approveTransaction,
    executeTransaction,
    txPendingConfirmation
  } = useWallet();

  const [copiedIdx, setCopiedIdx] = useState(null);
  const [onChainOwners, setOnChainOwners] = useState(CONTRACT_OWNERS);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [processingTxId, setProcessingTxId] = useState(null);

  const normalizedAccount = account ? account.toLowerCase() : null;

  // Read owners(0), owners(1), owners(2) directly from contract
  useEffect(() => {
    const fetchOnChainOwners = async () => {
      try {
        setLoadingOwners(true);
        const contract = getMultisigContract();
        const fetched = [];
        for (let i = 0; i < 3; i++) {
          try {
            const addr = await contract.owners(i);
            fetched.push(addr);
          } catch (e) {
            fetched.push(CONTRACT_OWNERS[i]);
          }
        }
        setOnChainOwners(fetched);
      } catch (err) {
        console.warn('Could not read owners array directly:', err);
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchOnChainOwners();
  }, []);

  // Default selected tx to first pending tx if available
  useEffect(() => {
    if (selectedTxId === null && transactions.length > 0) {
      const firstPending = transactions.find((t) => !t.executed);
      setSelectedTxId(firstPending ? firstPending.id : transactions[0].id);
    }
  }, [transactions, selectedTxId]);

  const handleCopy = (address, index) => {
    navigator.clipboard.writeText(address);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApprove = async (txId) => {
    try {
      setProcessingTxId(txId);
      await approveTransaction(txId);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleExecute = async (txId) => {
    try {
      setProcessingTxId(txId);
      await executeTransaction(txId);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingTxId(null);
    }
  };

  const selectedTx = transactions.find((t) => t.id === selectedTxId);

  const ownersList = [
    {
      id: 1,
      title: 'Owner 1',
      role: 'Primary Signer',
      address: onChainOwners[0] || CONTRACT_OWNERS[0],
      description: 'Primary signatory enrolled on Ethereum Sepolia. Authorized to submit, approve, and execute wallet transactions.',
      color: '#a855f7',
      badgeClass: 'badge-purple',
    },
    {
      id: 2,
      title: 'Owner 2',
      role: 'Security Signer',
      address: onChainOwners[1] || CONTRACT_OWNERS[1],
      description: 'Secondary co-signer providing independent dual-custody verification before funds can be released.',
      color: '#06b6d4',
      badgeClass: 'badge-cyan',
    },
    {
      id: 3,
      title: 'Owner 3',
      role: 'Recovery Signer',
      address: onChainOwners[2] || CONTRACT_OWNERS[2],
      description: 'Tertiary recovery signatory ensuring quorum continuity if one signatory key is offline or unavailable.',
      color: '#3b82f6',
      badgeClass: 'badge-emerald',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. SECURITY CENTER HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-purple-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Security Center
              </h1>
              <span className="badge-purple text-[10px] font-mono">
                Smart Contract Vault
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Decentralized multi-signature consensus & cryptographic keyholder verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#090d1f] border border-purple-500/30 text-xs font-mono">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Security:</span>
            <span className="text-emerald-400 font-bold">2-of-3 Approval Protection</span>
          </div>

          <button
            onClick={refreshBlockchainData}
            disabled={isLoadingData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs flex items-center gap-1.5 font-semibold"
            title="Refresh contract security state"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* 2. EXPLICIT 2-OF-3 SECURITY EXPLANATION BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0d122b] to-cyan-950/30 border border-purple-500/30 shadow-xl space-y-3 relative overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading font-black text-lg sm:text-xl text-white">
              2-of-3 Approval Protection
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
              KIWIX uses a 2-of-3 approval mechanism for sensitive transactions. At least two configured owners must approve before execution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-sans block">Total Signers</span>
            <span className="text-white font-bold text-sm">3 Owners</span>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-sans block">Threshold</span>
            <span className="text-cyan-300 font-bold text-sm">2 Required Approvals</span>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-sans block">Quorum Ratio</span>
            <span className="text-emerald-400 font-bold text-sm">66.7% Consensus</span>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-sans block">Connected Status</span>
            <span className={`font-bold text-sm ${isOwner ? 'text-lime-400' : 'text-slate-400'}`}>
              {isOwner ? `Owner 0${ownerNumber}` : 'Observer'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3. THREE REAL ON-CHAIN OWNER CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading font-black text-xl text-white">
              Configured Smart Contract Owners (3)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Source: <code className="text-purple-300 font-bold">owners(uint256)</code>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ownersList.map((owner, idx) => {
            const isConnectedOwner = normalizedAccount === owner.address.toLowerCase();

            return (
              <motion.div
                key={owner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`glass-panel p-6 sm:p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 border ${
                  isConnectedOwner
                    ? 'border-purple-500/70 ring-2 ring-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.25)] bg-[#0f142e]'
                    : 'border-slate-800/90 hover:border-purple-500/40'
                }`}
              >
                {/* Connected Signer Badge */}
                {isConnectedOwner && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1 font-heading">
                    <UserCheck className="w-3.5 h-3.5" />
                    Connected Signer
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${owner.color}20`, border: `1px solid ${owner.color}40` }}
                    >
                      <Key className="w-6 h-6" style={{ color: owner.color }} />
                    </div>
                    <span className={owner.badgeClass}>{owner.role}</span>
                  </div>

                  <div>
                    <h4 className="font-heading font-black text-xl text-white">
                      {owner.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                      {owner.description}
                    </p>
                  </div>

                  {/* Public Address */}
                  <div className="p-3.5 rounded-2xl bg-[#070914] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                      <span>Public Address</span>
                      <span className="text-cyan-400 font-mono">{shortenAddress(owner.address)}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-200 break-all p-2 rounded-xl bg-black/40 border border-slate-800/80 select-all font-medium leading-relaxed">
                      {owner.address}
                    </div>
                  </div>
                </div>

                {/* Actions: Copy & Etherscan */}
                <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                  <button
                    onClick={() => handleCopy(owner.address, idx)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors font-sans"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://sepolia.etherscan.io/address/${owner.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-xl transition-colors font-sans font-medium"
                  >
                    <span>Etherscan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. TRANSACTION APPROVAL INSPECTOR FOR SELECTED TRANSACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-white">
                Transaction Approval Inspector
              </h3>
              <p className="text-xs text-slate-400">
                Inspect live cryptographic signature verification states for wallet proposals
              </p>
            </div>
          </div>

          <span className="badge-cyan text-xs font-mono">
            {transactions.length} Proposals Recorded
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center bg-[#070914] rounded-2xl border border-slate-800 space-y-2">
            <Info className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">
              No transactions currently on-chain. Propose a transfer on the Send page to inspect approvals.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Transaction Selection Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {transactions.map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setSelectedTxId(tx.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedTxId === tx.id
                      ? 'bg-purple-600/30 text-white border border-purple-500/60 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500/40'
                      : 'bg-[#090d1f] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>Tx #{tx.id}</span>
                  <span className={`w-2 h-2 rounded-full ${tx.executed ? 'bg-emerald-400' : tx.approvalCount >= 2 ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                </button>
              ))}
            </div>

            {/* Selected Transaction Card */}
            {selectedTx && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#090d1f] border border-slate-800 space-y-5">
                {/* Transaction Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-heading font-black text-white">
                        Transaction #{selectedTx.id}
                      </span>
                      {selectedTx.executed ? (
                        <span className="badge-emerald text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Executed
                        </span>
                      ) : selectedTx.approvalCount >= 2 ? (
                        <span className="badge-cyan text-xs font-semibold animate-pulse">
                          <Zap className="w-3.5 h-3.5" />
                          Ready to Execute (2/2)
                        </span>
                      ) : (
                        <span className="badge-amber text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          Pending ({selectedTx.approvalCount}/2 Approvals)
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Recipient: <span className="text-cyan-300 font-bold">{selectedTx.to}</span> • Payout: <span className="text-white font-bold">{selectedTx.valueEth} ETH</span>
                    </div>
                  </div>

                  {/* Action Triggers */}
                  {!selectedTx.executed && (
                    <div className="flex items-center gap-2">
                      {!selectedTx.userApproved ? (
                        <button
                          onClick={() => handleApprove(selectedTx.id)}
                          disabled={processingTxId === selectedTx.id || txPendingConfirmation || !isOwner}
                          className={`btn-secondary text-xs !py-2 !px-3.5 flex items-center gap-1.5 ${
                            !isOwner ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={!isOwner ? 'Only owners can approve' : 'Approve this proposal'}
                        >
                          {processingTxId === selectedTx.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                          ) : (
                            <ThumbsUp className="w-3.5 h-3.5 text-purple-400" />
                          )}
                          <span>Approve Proposal</span>
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> You Approved
                        </span>
                      )}

                      {selectedTx.approvalCount >= 2 && (
                        <button
                          onClick={() => handleExecute(selectedTx.id)}
                          disabled={processingTxId === selectedTx.id || txPendingConfirmation || !isOwner}
                          className={`btn-emerald text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 ${
                            !isOwner ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {processingTxId === selectedTx.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <PlayCircle className="w-3.5 h-3.5" />
                          )}
                          <span>Execute Transaction</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 3 Owners Approval Status Matrix */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-heading block">
                    Owner Signature Matrix
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {CONTRACT_OWNERS.map((ownerAddr, idx) => {
                      const hasApproved = selectedTx.ownerApprovals && selectedTx.ownerApprovals[idx];
                      const isConnected = normalizedAccount === ownerAddr.toLowerCase();

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 transition-all ${
                            hasApproved
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-black/40 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs font-sans">
                                Owner 0{idx + 1}
                              </span>
                              {isConnected && (
                                <span className="badge-purple text-[9px] !py-0 !px-1.5">You</span>
                              )}
                            </div>

                            {hasApproved ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                                <Check className="w-3 h-3" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-black/40 px-2 py-0.5 rounded-full border border-slate-800 font-mono">
                                <Clock className="w-3 h-3 text-slate-500" /> Pending
                              </span>
                            )}
                          </div>

                          <div className="font-mono text-[11px] text-slate-500">
                            {shortenAddress(ownerAddr)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 5. VISUAL 2-OF-3 CONSENSUS TOPOLOGY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-white">
                2-OF-3 CONSENSUS TOPOLOGY
              </h2>
              <p className="text-xs text-slate-400">
                Independent keyholders connecting into the unified KIWIX smart contract vault
              </p>
            </div>
          </div>

          <span className="badge-purple text-xs font-mono">
            Ethereum Sepolia
          </span>
        </div>

        {/* Visual Topology Diagram */}
        <div className="p-4 sm:p-8 bg-[#090d20] rounded-3xl border border-slate-800">
          <OwnerNodeVisualizer />
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityPage;
