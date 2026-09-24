import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NetworkBanner } from './components/NetworkBanner';
import { ToastContainer } from './components/ToastContainer';
import { ReceiveModal } from './components/ReceiveModal';
import { LandingPage } from './pages/LandingPage';
import { ConnectPage } from './pages/ConnectPage';
import { DashboardPage } from './pages/DashboardPage';
import { SendPage } from './pages/SendPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SecurityPage } from './pages/SecurityPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const location = useLocation();
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100 selection:bg-lime-500 selection:text-slate-950 relative">
      {/* Wrong Network Banner */}
      <NetworkBanner />

      {/* Primary Navigation */}
      <Navbar onOpenReceive={() => setIsReceiveModalOpen(true)} />

      {/* Main Routed Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/dashboard" element={<DashboardPage onOpenReceive={() => setIsReceiveModalOpen(true)} />} />
              <Route path="/send" element={<SendPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/owners" element={<SecurityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Receive Modal */}
      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
      />

      {/* Global Notifications */}
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
