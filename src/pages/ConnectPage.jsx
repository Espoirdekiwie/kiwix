import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  LogOut,
  KeyRound,
  ShieldAlert,
  Loader2,
  Info
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_OWNERS, shortenAddress } from '../contract';

export const ConnectPage = () => {
  const navigate = useNavigate();
  const {
    account,
    chainId,
    isConnected,
    isSepolia,
    isOwner,
    ownerLabel,
    ownerNumber,
    isConnecting,
    errorMessage,
    hasMetaMask,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnterWallet = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <div className="glass-panel-glow p-8 sm:p-10 relative overflow-hidden border border-purple-500/30 shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 mx-auto shadow-xl shadow-purple-500/25">
              <div className="w-full h-full bg-[#0b0e20] rounded-[14px] flex items-center justify-center">
                <Wallet className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Connect your wallet
            </h1>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Connect MetaMask to access your multisignature wallet.
            </p>
          </div>

          {/* STATE 1: Wallet Not Connected */}
          {!isConnected ? (
            <div className="space-y-6">
              {/* Connect Button */}
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary w-full text-base !py-4 shadow-xl shadow-purple-500/30 flex items-center justify-center gap-3 group"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting MetaMask...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect MetaMask</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Missing MetaMask Notification */}
              {!hasMetaMask && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-semibold">MetaMask Extension Required</strong>
                    <p className="text-slate-300 leading-relaxed">
                      MetaMask was not detected in this browser. Install the MetaMask extension to continue.
                    </p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold underline pt-1"
                    >
                      Install MetaMask <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Authorized Owners Directory */}
              <div className="p-4 rounded-2xl bg-[#090d1f] border border-slate-800 space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Enrolled Multisig Signers (Sepolia)
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {CONTRACT_OWNERS.map((owner, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800/80 text-slate-300"
                    >
                      <span className="text-purple-300 font-sans font-semibold text-xs">
                        Owner {idx + 1}
                      </span>
                      <span className="text-slate-400 text-[11px]">{shortenAddress(owner)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* STATE 2: Wallet Connected */
            <div className="space-y-6">
              {/* Connection Details Box */}
              <div className="p-5 rounded-2xl bg-[#090d1f] border border-slate-800 space-y-4">
                {/* Connection Status Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Connection Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>

                {/* Connected Address */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Connected Address</span>
                    <button
                      onClick={handleCopy}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-cyan-300 font-bold break-all bg-black/40 p-3 rounded-xl border border-slate-800">
                    {account}
                  </div>
                </div>

                {/* Network Status & Sepolia Switch */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">Network:</span>
                  {isSepolia ? (
                    <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Ethereum Sepolia (11155111)
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Wrong Chain ({chainId || 'Unknown'})
                      </span>
                      <button
                        onClick={switchToSepolia}
                        className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-amber-400 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Switch to Sepolia
                      </button>
                    </div>
                  )}
                </div>

                {/* Owner Status Display */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Multisig Role Detection
                  </span>

                  {isOwner ? (
                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-purple-200 block">
                            Owner Status: {ownerLabel}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Authorized signer with proposal & approval rights
                          </span>
                        </div>
                      </div>
                      <span className="badge-purple font-mono">Signer #{ownerNumber}</span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Owner Status: Not an owner</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        This wallet address is not one of the 3 configured multisig owners on the smart contract. You can observe contract data in read-only mode, but cannot sign or execute transactions.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enter Wallet Button for Owners or View Dashboard for Observers */}
              <div className="space-y-3">
                {isOwner ? (
                  <button
                    onClick={handleEnterWallet}
                    className="btn-primary w-full text-base !py-3.5 shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 group"
                  >
                    <span>Enter Wallet</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleEnterWallet}
                    className="btn-secondary w-full text-sm !py-3 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Dashboard (Read-Only Mode)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={disconnectWallet}
                  className="w-full py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-800/80"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
