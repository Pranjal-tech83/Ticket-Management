'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useTicketStore } from '@/store/useTicketStore';
import { useTheme } from 'next-themes';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  Cpu, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';

export default function Navbar() {
  const { toggleSidebar, sidebarCollapsed, setNewTicketModalOpen } = useUIStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const { searchQuery, setSearchQuery } = useTicketStore();
  const { theme, setTheme } = useTheme();
  
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/60 backdrop-blur-md px-4 h-16 flex items-center justify-between transition-colors duration-300">
      {/* Left side: Toggle button + title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="relative max-w-xs md:max-w-md w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search tickets by ID, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-48 sm:w-64 md:w-80 pl-9 pr-4 rounded-full border border-border bg-muted/40 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          />
        </div>
      </div>

      {/* Right side: AI Status, notifications, dark/light switch, user profile */}
      <div className="flex items-center gap-4">
        {/* AI Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-semibold tracking-wider uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SupportPilot Agent: Active</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop overlay */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border/80 bg-card shadow-lg z-50 p-4 glow-blue"
                >
                  <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] text-primary hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                      <button 
                        onClick={clearAll}
                        className="text-[10px] text-muted-foreground hover:underline font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            markAsRead(item.id);
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            item.read 
                              ? 'bg-muted/10 border-border/40' 
                              : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-semibold flex items-center gap-1">
                              {item.type === 'ai_failed' && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                              {item.type === 'escalation' && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                              {item.type === 'new_ticket' && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                              {item.title}
                            </span>
                            <span className="text-[9px] text-muted-foreground shrink-0">{formatDate(item.timestamp)}</span>
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-snug">{item.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Global Action Button */}
        <button
          onClick={() => setNewTicketModalOpen(true)}
          className="hidden sm:inline-flex items-center justify-center px-3 h-9 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-all rounded-full shadow-sm hover:shadow"
        >
          + New Ticket
        </button>
      </div>
    </header>
  );
}
