import React from 'react';

export const KiwixLogo = ({ className = 'w-10 h-10', showText = true, size = 'default' }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Geometric Kiwi + Stylized X Shield Emblem */}
      <div className={`relative ${className} rounded-2xl bg-gradient-to-tr from-lime-500 via-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-lime-500/20 group-hover:shadow-lime-500/40 transition-all duration-300`}>
        <div className="w-full h-full bg-[#080b18] rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Ambient Glow in Logo */}
          <div className="absolute inset-0 bg-radial from-lime-500/15 via-transparent to-transparent opacity-80" />
          
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4/5 h-4/5 relative z-10">
            <defs>
              <linearGradient id="kiwiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a3e635" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="xGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Outer Hex Shield */}
            <path
              d="M50 8 L86 28 V72 L50 92 L14 72 V28 Z"
              stroke="url(#kiwiGrad)"
              strokeWidth="5"
              strokeLinejoin="round"
              fill="rgba(11, 15, 29, 0.6)"
            />

            {/* Stylized Futuristic X Intersecting Lines */}
            <path
              d="M32 30 L68 70"
              stroke="url(#xGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M68 30 L32 70"
              stroke="url(#kiwiGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Central Kiwi Node Core */}
            <circle cx="50" cy="50" r="7" fill="#a3e635" className="animate-pulse" />
            <circle cx="50" cy="50" r="3" fill="#080b18" />
          </svg>
        </div>
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-xl tracking-wider text-white">
              KIWIX
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-lime-500/15 text-lime-300 border border-lime-500/30">
              V1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            SMART CONTRACT WALLET
          </p>
        </div>
      )}
    </div>
  );
};
