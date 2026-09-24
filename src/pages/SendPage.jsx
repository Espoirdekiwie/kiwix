import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWallet } from '../context/WalletContext';
import { TransactionRiskAnalyzer } from '../components/TransactionRiskAnalyzer';
import { CONTRACT_OWNERS, shortenAddress } from '../contract';

export const SendPage = () => {
  const navigate = useNavigate();
  const { 
    account, 
    isConnected, 
    isOwner, 
    balance, 
    rawBalance, 
    submitTransaction, 
    isSepolia, 
    switchToSepolia, 
    connectWallet, 
    isConnecting 
  } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const currentBalanceNum = parseFloat(balance) || 0;
  const txAmountNum = parseFloat(amount) || 0;
  const exceedsBalance = txAmountNum > currentBalanceNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (!isOwner) {
      setErrorMsg('Access Denied: Only registered smart contract wallet signers can submit transfer proposals.');
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
      setErrorMsg('Please enter a valid ETH transfer amount greater than 0.');
      return;
    }
    if (exceedsBalance) {
      setErrorMsg(`Insufficient contract balance. Wallet vault reserves hold ${balance} ETH.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const receipt = await submitTransaction(recipient, amount);
      if (receipt) {
        setIsSuccess(true);
        setTxHash(receipt.hash);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a3e635', '#06b6d4', '#8b5cf6', '#22c55e'],
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
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-cyan-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Send Funds
            </h1>
            <p className="text-xs text-slate-400">
              Propose an on-chain transfer requiring 2-of-3 approval protection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Available Balance:</span>
          <span className="text-lime-400 font-bold text-sm">{balance} ETH</span>
        </div>
      </motion.div>

      {/* MAIN FORM / SUCCESS CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6 relative overflow-hidden"
      >
        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="py-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-black text-2xl text-white">
                Transfer Proposal Broadcasted!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your proposal to transfer <strong className="text-gradient font-mono">{amount} ETH</strong> to{' '}
                <strong className="text-cyan-300 font-mono">{shortenAddress(recipient)}</strong> has been recorded on Ethereum Sepolia.
              </p>
            </div>

            {txHash && (
              <div className="p-3.5 bg-[#070914] rounded-2xl border border-slate-800 text-xs font-mono text-slate-400 break-all max-w-md mx-auto space-y-1">
                <span className="text-[10px] uppercase text-slate-500 block">Transaction Hash</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 underline"
                >
                  <span>{txHash}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate('/transactions')}
                className="btn-primary text-xs !py-2.5 !px-6"
              >
                <span>View in Transactions</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="btn-secondary text-xs !py-2.5 !px-5"
              >
                Send Another
              </button>
            </div>
          </div>
        ) : (
          /* FORM BODY */
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isOwner && isConnected && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Observation Mode:</strong> Your connected wallet ({shortenAddress(account)}) is not one of the 3 configured wallet signers. Only authorized signers can propose outgoing transfers.
                </div>
              </div>
            )}

            {/* Recipient Address */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-heading">
                Recipient Ethereum Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value.trim())}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#070914] border border-slate-800 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
              />

              {/* Quick Select Signer Autofill */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Autofill:</span>
                {CONTRACT_OWNERS.map((ownerAddr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRecipient(ownerAddr)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-purple-300 hover:border-purple-500 hover:text-white transition-colors"
                  >
                    Owner 0{idx + 1} ({shortenAddress(ownerAddr)})
                  </button>
                ))}
              </div>
            </div>

            {/* Amount in ETH */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold uppercase tracking-wider text-slate-300 font-heading">
                  Amount (ETH)
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Wallet Balance: <strong className="text-lime-400">{balance} ETH</strong>
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="0.0005"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#070914] border border-slate-800 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                />
                <span className="absolute right-4 top-3.5 text-xs font-mono font-bold text-purple-400">
                  ETH
                </span>
              </div>
            </div>

            {/* EMBEDDED TRANSACTION RISK ANALYZER */}
            <TransactionRiskAnalyzer
              recipient={recipient}
              amountEth={amount}
            />

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="btn-secondary text-xs !py-3 !px-5"
              >
                Reset
              </button>

              {!isConnected ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="btn-primary text-xs !py-3 !px-6"
                >
                  <span>Connect MetaMask</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !isOwner || exceedsBalance}
                  className={`btn-primary text-xs !py-3 !px-7 ${
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
                      <span>Propose Transfer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
