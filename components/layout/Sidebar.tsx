'use client';

import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Ticket, 
  Bot, 
  BookOpen, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Terminal,
  Plug
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useUIStore();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "h-screen fixed left-0 top-0 z-30 flex flex-col border-r border-border/40 bg-card/60 backdrop-blur-xl transition-colors duration-300",
        sidebarCollapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/40">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
            <Terminal size={18} className="animate-pulse" />
          </div>
          {!sidebarCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent"
            >
              SupportPilot
            </motion.span>
          )}
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors hidden md:block"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group",
                isActive 
                  ? "text-primary bg-primary/10 dark:bg-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={18} className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Session Info / Logout */}
      {user && (
        <div className="p-3 border-t border-border/40 flex flex-col gap-2">
          <div className={cn("flex items-center gap-3", sidebarCollapsed ? "justify-center" : "px-1")}>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-8 w-8 rounded-full border border-border bg-muted object-cover"
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-none mb-1">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate leading-none">{user.email}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button 
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
          {sidebarCollapsed && (
            <button 
              onClick={logout}
              title="Logout"
              className="mx-auto p-2 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}
    </motion.aside>
  );
}
