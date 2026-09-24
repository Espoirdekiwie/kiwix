import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Send, 
  ArrowDownLeft, 
  Activity, 
  ShieldCheck, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { KiwixLogo } from '../assets/KiwixLogo';
import { useWallet } from '../context/WalletContext';
import { shortenAddress, CONTRACT_ADDRESS } from '../contract';

export const Navbar = ({ onOpenReceive }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    account, 
    isConnected, 
    isSepolia, 
    isOwner, 
    ownerLabel, 
    ownerNumber, 
    disconnectWallet, 
    connectWallet,
    isConnecting 
  } = useWallet();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Wallet-oriented primary navigation
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Send', path: '/send', icon: Send },
    { name: 'Receive', path: '/receive', icon: ArrowDownLeft },
    { name: 'Transactions', path: '/transactions', icon: Activity },
    { name: 'Security', path: '/security', icon: ShieldCheck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = (path) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070913]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* KIWIX Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <KiwixLogo className="w-10 h-10" showText={true} />
          </Link>

          {/* Wallet Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0b0f20]/90 p-1.5 rounded-2xl border border-slate-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-lime-500/20 via-cyan-500/20 to-purple-500/20 text-white border border-lime-500/30 shadow-sm shadow-lime-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-lime-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Sepolia Network Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1226] border border-slate-800 text-xs text-slate-300 font-mono">
              <span className={`w-2 h-2 rounded-full ${isSepolia ? 'bg-lime-400 shadow-[0_0_8px_#a3e635]' : 'bg-amber-400'} animate-pulse`} />
              <span>Sepolia</span>
            </div>

            {/* Receive Action */}
            {isConnected && onOpenReceive && (
              <button
                onClick={onOpenReceive}
                className="p-2 rounded-xl bg-[#0d1226] hover:bg-white/10 text-cyan-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Receive ETH into Smart Contract Wallet"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>Receive</span>
              </button>
            )}

            {/* Connected Account or Connect Button */}
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#111736] to-[#0f142d] border border-purple-500/30 hover:border-purple-500/60 transition-all text-xs font-mono shadow-md"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
                  <span className="text-white font-semibold">{shortenAddress(account)}</span>
                  {isOwner && (
                    <span className="bg-lime-500/15 text-lime-300 text-[10px] px-1.5 py-0.5 rounded font-sans font-bold border border-lime-500/30">
                      {ownerLabel}
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0b0f22] border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in">
                    <div className="p-2 border-b border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Connected Wallet</span>
                      <p className="font-mono text-xs text-cyan-300 break-all">{account}</p>
                      <div className="pt-1 text-[11px] text-slate-300">
                        Role: <strong className={isOwner ? 'text-lime-400' : 'text-slate-400'}>{ownerLabel}</strong>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1 text-xs">
                      <button
                        onClick={() => handleCopy(account)}
                        className="flex items-center gap-2 w-full p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied Address' : 'Copy Address'}</span>
                      </button>

                      <a
                        href={`https://sepolia.etherscan.io/address/${account}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 w-full p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View on Etherscan</span>
                      </a>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          disconnectWallet();
                        }}
                        className="flex items-center gap-2 w-full p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1 border-t border-slate-800"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/connect"
                className="btn-primary text-xs !py-2 !px-4 flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect MetaMask</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d1f] border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-lime-500/15 text-lime-300 border border-lime-500/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {isConnected ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 block">Connected:</span>
                  <span className="font-mono text-cyan-300 font-bold">{shortenAddress(account)}</span>
                  <div className="text-lime-300 font-semibold mt-0.5">{ownerLabel}</div>
                </div>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary w-full text-xs text-rose-400"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <Link
                to="/connect"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-sm flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect MetaMask</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
