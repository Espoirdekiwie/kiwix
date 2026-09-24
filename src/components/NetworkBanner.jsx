import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const NetworkBanner = () => {
  const { isConnected, isSepolia, switchToSepolia, chainId } = useWallet();

  if (!isConnected || isSepolia) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-2.5 text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Wrong Network Detected (Chain ID: {chainId || 'Unknown'}):</strong> KIWIIEE MULTISIG is deployed on <strong>Ethereum Sepolia</strong>. Please switch networks.
          </span>
        </div>
        <button
          onClick={switchToSepolia}
          className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Switch to Sepolia
        </button>
      </div>
    </div>
  );
};
