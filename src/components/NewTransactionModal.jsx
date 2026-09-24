import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  X, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWallet } from '../context/WalletContext';
import { TransactionRiskAnalyzer } from './TransactionRiskAnalyzer';
import { CONTRACT_OWNERS, shortenAddress } from '../contract';

export const NewTransactionModal = ({ isOpen, onClose }) => {
  const { 
    account, 
    isOwner, 
    balance, 
    rawBalance, 
    submitTransaction, 
    isSepolia, 
    switchToSepolia 
  } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState(null);

  if (!isOpen) return null;

  const currentBalanceNum = parseFloat(balance) || 0;
  const txAmountNum = parseFloat(amount) || 0;
  const exceedsBalance = txAmountNum > currentBalanceNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!account) {
      setErrorMsg('Please connect your MetaMask wallet first.');
      return;
    }
    if (!isOwner) {
      setErrorMsg('Access Denied: Only registered multisig owners can propose transactions.');
      return;
    }
    if (!isSepolia) {
      await switchToSepolia();
      return;
    }
    if (!recipient || !ethers.isAddress(recipient)) {
      setErrorMsg('Please enter a valid Ethereum recipient address (0x...).');
      return;
    }
    if (!amount || isNaN(amount) || txAmountNum <= 0) {
      setErrorMsg('Please enter a valid ETH amount greater than 0.');
      return;
    }
    if (exceedsBalance) {
      setErrorMsg(`Insufficient contract balance. Multisig vault holds ${balance} ETH.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const receipt = await submitTransaction(recipient, amount);
      if (receipt) {
        setIsSuccess(true);
        setTxHash(receipt.hash);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'],
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Transaction submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRecipient('');
    setAmount('');
    setErrorMsg('');
    setIsSuccess(false);
    setTxHash(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0c1022] border border-purple-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-cyan-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Create Transaction Proposal
                </h3>
                <p className="text-xs text-slate-400">
                  Submit an on-chain transfer requiring 2 of 3 signatures
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            /* SUCCESS STATE */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h4 className="font-heading font-bold text-xl text-white">
                  Proposal Submitted Successfully!
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your proposal to transfer <strong className="text-gradient font-mono">{amount} ETH</strong> to{' '}
                  <strong className="text-cyan-300 font-mono">{shortenAddress(recipient)}</strong> is now active on Sepolia.
                </p>
              </div>

              {txHash && (
                <div className="p-3 bg-[#070914] rounded-xl border border-slate-800 text-xs font-mono text-slate-400 break-all max-w-md mx-auto">
                  <span className="text-[10px] text-slate-500 block uppercase">Transaction Hash</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 underline mt-1"
                  >
                    <span>{shortenAddress(txHash)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <button onClick={handleReset} className="btn-primary text-xs !py-2.5 !px-6">
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {!isOwner && account && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Observation Mode:</strong> Your wallet ({shortenAddress(account)}) is not one of the 3 multisig owners. Only enrolled signers can submit proposals.
                  </div>
                </div>
              )}

              {/* Recipient Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value.trim())}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#070914] border border-slate-800 text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                />

                {/* Quick Owner Shortcuts */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Autofill:</span>
                  {CONTRACT_OWNERS.map((ownerAddr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRecipient(ownerAddr)}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-purple-300 hover:border-purple-500 hover:text-white transition-colors"
                    >
                      Owner 0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount (ETH) Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold uppercase tracking-wider text-slate-300">
                    Amount (ETH)
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    Vault Reserve: <strong className="text-cyan-300">{balance} ETH</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="0.000001"
                    min="0"
                    placeholder="0.0001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#070914] border border-slate-800 text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-mono font-bold text-purple-400">
                    ETH
                  </span>
                </div>
              </div>

              {/* 5. UNIQUE FEATURE: TRANSACTION RISK ANALYZER */}
              <TransactionRiskAnalyzer
                recipient={recipient}
                amountEth={amount}
              />

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="btn-secondary text-xs !py-2.5 !px-4"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !isOwner || exceedsBalance}
                  className={`btn-primary text-xs !py-2.5 !px-6 ${
                    !isOwner || exceedsBalance ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming in MetaMask...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Proposal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
