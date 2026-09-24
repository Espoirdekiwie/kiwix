import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Copy, Check, GraduationCap } from 'lucide-react';
import { KiwixLogo } from '../assets/KiwixLogo';
import { CONTRACT_ADDRESS, shortenAddress } from '../contract';

export const Footer = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-[#050710] border-t border-slate-800/80 pt-10 pb-8 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <KiwixLogo className="w-8 h-8" showText={true} />
            <p className="text-slate-400 text-xs max-w-md leading-relaxed font-sans pt-1">
              "Your transaction. Your approvals. Your control."<br />
              An educational Ethereum smart contract wallet featuring 2-of-3 approval protection as an additional security mechanism.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Academic Blockchain Capstone Demonstration</span>
            </div>
          </div>

          {/* Wallet Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-heading">
              Wallet Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-lime-400 transition-colors">
                  Wallet Dashboard
                </Link>
              </li>
              <li>
                <Link to="/send" className="hover:text-lime-400 transition-colors">
                  Send Funds
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="hover:text-lime-400 transition-colors">
                  Transactions & Activity
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-lime-400 transition-colors">
                  2-of-3 Approval Security
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-lime-400 transition-colors">
                  Settings & Specifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Contract Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-heading">
              Sepolia Contract
            </h4>
            <div className="p-3 bg-[#090d1f] rounded-xl border border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                <span>Ethereum Sepolia</span>
                <span className="text-lime-400 font-semibold">2 of 3</span>
              </div>
              <div className="text-xs font-mono text-cyan-300 break-all bg-black/40 p-2 rounded border border-slate-800/80">
                {shortenAddress(CONTRACT_ADDRESS)}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded text-[11px] text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded text-[11px] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Etherscan</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KIWIX Smart Contract Wallet. Built on Ethereum Sepolia.</p>
          <p className="font-mono">React • Vite • ethers.js • Framer Motion</p>
        </div>
      </div>
    </footer>
  );
};
