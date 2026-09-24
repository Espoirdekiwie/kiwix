import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  UserCheck, 
  Lock, 
  ShieldAlert,
  Zap,
  Info,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_OWNERS, CONTRACT_ADDRESS, REQUIRED_APPROVALS, shortenAddress, getMultisigContract } from '../contract';
import { OwnerNodeVisualizer } from '../components/OwnerNodeVisualizer';

export const OwnersPage = () => {
  const { account, isOwner, ownerNumber, isLoadingData, refreshBlockchainData } = useWallet();
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [onChainOwners, setOnChainOwners] = useState(CONTRACT_OWNERS);
  const [loadingOwners, setLoadingOwners] = useState(false);

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

  const handleCopy = (address, index) => {
    navigator.clipboard.writeText(address);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const ownersList = [
    {
      id: 1,
      title: 'Owner 1',
      role: 'Primary Signer',
      address: onChainOwners[0] || CONTRACT_OWNERS[0],
      description: 'Primary signatory enrolled on Ethereum Sepolia. Authorized to submit, approve, and execute transactions.',
      color: '#a855f7', // Violet
      badgeClass: 'badge-purple',
    },
    {
      id: 2,
      title: 'Owner 2',
      role: 'Security Signer',
      address: onChainOwners[1] || CONTRACT_OWNERS[1],
      description: 'Secondary co-signer providing independent dual-custody verification before funds can be transferred.',
      color: '#3b82f6', // Electric Blue
      badgeClass: 'badge-cyan',
    },
    {
      id: 3,
      title: 'Owner 3',
      role: 'Recovery Signer',
      address: onChainOwners[2] || CONTRACT_OWNERS[2],
      description: 'Tertiary recovery signatory ensuring quorum continuity if one signatory is offline or unavailable.',
      color: '#06b6d4', // Cyan
      badgeClass: 'badge-emerald',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Multisig Signers (Owners)
            </h1>
            <p className="text-xs text-slate-400">
              Authorized cryptographic keyholders verified by the deployed Sepolia smart contract
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d1f] border border-purple-500/30 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Quorum:</span>
            <span className="text-emerald-400 font-bold">2 of 3 Required</span>
          </div>

          <button
            onClick={refreshBlockchainData}
            disabled={isLoadingData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs"
            title="Refresh contract state"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* 1. THREE PREMIUM OWNER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ownersList.map((owner, idx) => {
          const isConnected = normalizedAccount === owner.address.toLowerCase();

          return (
            <motion.div
              key={owner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`glass-panel p-6 sm:p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 border ${
                isConnected
                  ? 'border-purple-500/60 ring-2 ring-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.25)] bg-[#0f142e]'
                  : 'border-slate-800/90 hover:border-purple-500/40'
              }`}
            >
              {/* Connected Owner Badge Indicator */}
              {isConnected && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1 font-heading">
                  <UserCheck className="w-3.5 h-3.5" />
                  ✓ Connected Owner
                </div>
              )}

              <div className="space-y-4">
                {/* Icon & Role */}
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
                  <h3 className="font-heading font-black text-xl text-white">
                    {owner.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                    {owner.description}
                  </p>
                </div>

                {/* Address Container: Full & Shortened */}
                <div className="p-3.5 rounded-2xl bg-[#070914] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                    <span>Public Address</span>
                    <span className="text-cyan-400 font-mono">{shortenAddress(owner.address)}</span>
                  </div>
                  <div className="font-mono text-xs text-slate-200 break-all p-2 rounded-xl bg-black/40 border border-slate-800/80 select-all font-medium leading-relaxed">
                    {owner.address}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Copy Address & View on Etherscan */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                <button
                  onClick={() => handleCopy(owner.address, idx)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors font-sans"
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-xl transition-colors font-sans font-medium"
                >
                  <span>Etherscan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. VISUAL 2-OF-3 APPROVAL SECURITY TOPOLOGY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-white">
                2 OF 3 APPROVAL SECURITY
              </h2>
              <p className="text-xs text-slate-400">
                Cryptographic multi-signature consensus topology connecting 3 owners to the central vault
              </p>
            </div>
          </div>

          <span className="badge-purple text-xs font-mono">
            66.6% Quorum
          </span>
        </div>

        {/* Visual Topology Diagram */}
        <div className="p-4 sm:p-8 bg-[#090d20] rounded-3xl border border-slate-800">
          <OwnerNodeVisualizer />
        </div>

        {/* Consensus Combinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#070914] border border-slate-800 text-center space-y-1.5">
            <span className="badge-purple text-[10px]">Combination A</span>
            <div className="font-heading font-bold text-white text-sm font-sans pt-1">Owner 1 + Owner 2</div>
            <div className="text-[11px] text-emerald-400 font-bold">✓ 2 Approvals → Executable</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#070914] border border-slate-800 text-center space-y-1.5">
            <span className="badge-cyan text-[10px]">Combination B</span>
            <div className="font-heading font-bold text-white text-sm font-sans pt-1">Owner 2 + Owner 3</div>
            <div className="text-[11px] text-emerald-400 font-bold">✓ 2 Approvals → Executable</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#070914] border border-slate-800 text-center space-y-1.5">
            <span className="badge-emerald text-[10px]">Combination C</span>
            <div className="font-heading font-bold text-white text-sm font-sans pt-1">Owner 1 + Owner 3</div>
            <div className="text-[11px] text-emerald-400 font-bold">✓ 2 Approvals → Executable</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
