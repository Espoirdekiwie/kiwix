import React from 'react';
import { ethers } from 'ethers';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Percent, 
  Wallet, 
  ArrowRight, 
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const TransactionRiskAnalyzer = ({ recipient, amountEth }) => {
  const { balance, rawBalance, isOwner, isConnected, isSepolia } = useWallet();

  // Parse numeric values safely
  const currentBalanceNum = parseFloat(balance) || 0;
  const txAmountNum = parseFloat(amountEth) || 0;
  const remainingNum = Math.max(0, currentBalanceNum - txAmountNum);
  
  const percentageUsed = currentBalanceNum > 0 && txAmountNum > 0
    ? Math.min(100, (txAmountNum / currentBalanceNum) * 100)
    : 0;

  const isValidAddress = recipient && ethers.isAddress(recipient);
  const exceedsBalance = txAmountNum > currentBalanceNum;

  // Determine Educational Risk Category
  let riskLevel = 'LOW';
  let riskColor = 'text-emerald-400';
  let riskBg = 'bg-emerald-500/10 border-emerald-500/30';
  let riskBadge = 'badge-emerald';
  let riskDescription = 'Low: This transaction transfers a small portion of the wallet balance.';

  if (exceedsBalance) {
    riskLevel = 'HIGH';
    riskColor = 'text-rose-400';
    riskBg = 'bg-rose-500/15 border-rose-500/40';
    riskBadge = 'badge-rose';
    riskDescription = 'High: The transfer amount exceeds the current wallet balance.';
  } else if (percentageUsed > 60) {
    riskLevel = 'HIGH';
    riskColor = 'text-rose-400';
    riskBg = 'bg-rose-500/10 border-rose-500/30';
    riskBadge = 'badge-rose';
    riskDescription = 'High: This transaction transfers a major portion of the wallet balance.';
  } else if (percentageUsed > 20) {
    riskLevel = 'MEDIUM';
    riskColor = 'text-amber-400';
    riskBg = 'bg-amber-500/10 border-amber-500/30';
    riskBadge = 'badge-amber';
    riskDescription = 'Medium: This transaction transfers a significant portion of the wallet balance.';
  }

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 space-y-4 ${riskBg}`}>
      {/* Risk Analyzer Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${riskColor}`} />
          <span className="font-heading font-black text-xs uppercase tracking-wider text-white">
            TRANSACTION RISK ANALYZER
          </span>
        </div>

        <span className={`${riskBadge} text-[10px] font-mono font-bold uppercase`}>
          {riskLevel}
        </span>
      </div>

      {/* Real Balance & Simulation Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 block font-sans">Wallet Balance</span>
          <span className="text-white font-bold">{balance} ETH</span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 block font-sans">Tx Amount</span>
          <span className="text-cyan-300 font-bold">{txAmountNum ? `${txAmountNum} ETH` : '0.00 ETH'}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 block font-sans">Remaining</span>
          <span className={`font-bold ${exceedsBalance ? 'text-rose-400' : 'text-slate-300'}`}>
            {remainingNum.toFixed(4)} ETH
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 block font-sans">Vault Usage</span>
          <span className={`font-bold ${percentageUsed > 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Visual Liquidity Drain Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Liquidity Utilization</span>
          <span className="font-bold text-slate-200">{percentageUsed.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              exceedsBalance
                ? 'bg-rose-500'
                : percentageUsed > 75
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : percentageUsed > 25
                ? 'bg-gradient-to-r from-cyan-400 to-amber-400'
                : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
            }`}
            style={{ width: `${Math.min(100, percentageUsed)}%` }}
          />
        </div>
      </div>

      {/* Real-time Condition Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        {/* Recipient Check */}
        <div className="flex items-center gap-1.5 text-slate-300">
          {isValidAddress ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          )}
          <span>{isValidAddress ? 'Valid Ethereum Address' : 'Recipient address required'}</span>
        </div>

        {/* Balance Check */}
        <div className="flex items-center gap-1.5 text-slate-300">
          {!exceedsBalance && txAmountNum > 0 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          )}
          <span>{exceedsBalance ? 'Exceeds multisig balance' : 'Sufficient vault reserves'}</span>
        </div>

        {/* Owner Check */}
        <div className="flex items-center gap-1.5 text-slate-300">
          {isOwner ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span>{isOwner ? 'Authorized Owner Signer' : 'Connected wallet is not an owner'}</span>
        </div>

        {/* Network Check */}
        <div className="flex items-center gap-1.5 text-slate-300">
          {isSepolia ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span>{isSepolia ? 'Ethereum Sepolia Network' : 'Non-Sepolia network detected'}</span>
        </div>
      </div>

      {/* Risk Summary Description */}
      <div className="text-xs text-slate-300 flex items-start gap-2 pt-1 border-t border-white/10">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className={riskColor}>{riskLevel}:</strong> {riskDescription}
        </p>
      </div>

      {/* Educational Notice */}
      <div className="text-[10px] text-slate-400/80 font-sans text-right italic">
        * Educational Risk Indicator: This is an educational indicator evaluated from wallet liquidity. It does not guarantee transaction safety.
      </div>
    </div>
  );
};
