import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, ExternalLink, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useWallet();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 shadow-emerald-500/10';
      case 'warning':
        return 'border-amber-500/40 shadow-amber-500/10';
      case 'error':
        return 'border-rose-500/40 shadow-rose-500/10';
      default:
        return 'border-purple-500/40 shadow-purple-500/10';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl backdrop-blur-xl bg-[#0d1124]/95 border shadow-xl ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 text-sm">
              <p className="text-slate-200 font-medium leading-snug">{toast.message}</p>
              {toast.txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono underline"
                >
                  View on Sepolia Etherscan
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
