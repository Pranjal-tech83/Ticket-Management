'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ChatWidget from '@/components/ai/ChatWidget';
import NewTicketForm from '@/components/tickets/NewTicketForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { sidebarCollapsed, newTicketModalOpen, setNewTicketModalOpen } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#090d16]">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Toast notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Main Sidebar */}
      <Sidebar />

      {/* Main content viewport */}
      <div 
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '64px' : '260px' }}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic page contents */}
        <main className="flex-1 p-6 relative overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Floating AI Chat Assistant widget */}
      <ChatWidget />

      {/* Global New Ticket Modal */}
      <AnimatePresence>
        {newTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-lg p-5 rounded-2xl border border-border/80 shadow-2xl relative glow-blue max-h-[90vh] overflow-hidden"
            >
              <NewTicketForm onClose={() => setNewTicketModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
