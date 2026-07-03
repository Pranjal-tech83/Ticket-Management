'use client';

import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { 
  PlusCircle, 
  Bot, 
  Layers, 
  Settings, 
  BookOpen, 
  ShieldAlert,
  Plug
} from 'lucide-react';

export default function QuickActions() {
  const { setNewTicketModalOpen, setActiveTab } = useUIStore();

  const actions = [
    {
      label: 'Create Ticket',
      icon: PlusCircle,
      desc: 'Log a new customer request',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      onClick: () => setNewTicketModalOpen(true),
    },
    {
      label: 'Run Agent Diagnosis',
      icon: Bot,
      desc: 'Trigger AI diagnostics workflow',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      onClick: () => setActiveTab('ai-agent'),
    },
    {
      label: 'Manage Integrations',
      icon: Plug,
      desc: 'Configure Jira, Slack, & Gmail',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      onClick: () => setActiveTab('integrations'),
    },
    {
      label: 'Search Knowledge',
      icon: BookOpen,
      desc: 'Browse articles and solutions',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      onClick: () => setActiveTab('knowledge-base'),
    },
  ];

  return (
    <div className="glass-card p-5 rounded-xl flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-semibold tracking-tight mb-4">Quick Command Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                onClick={act.onClick}
                className="flex flex-col items-start p-3 rounded-lg border border-border/40 hover:bg-muted/50 transition-all text-left group"
              >
                <div className={`p-2 rounded-lg mb-2 border ${act.color} group-hover:scale-105 transition-transform`}>
                  <Icon size={16} />
                </div>
                <span className="text-xs font-semibold text-foreground leading-tight">{act.label}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{act.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
