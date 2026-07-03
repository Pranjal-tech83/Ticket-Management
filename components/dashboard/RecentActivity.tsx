'use client';

import React from 'react';
import { useTicketStore } from '@/store/useTicketStore';
import { useUIStore } from '@/store/useUIStore';
import { getStatusColor, formatDate } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export default function RecentActivity() {
  const { tickets, setSelectedTicket } = useTicketStore();
  const { setActiveTab } = useUIStore();

  const recent = tickets.slice(0, 4);

  return (
    <div className="glass-card p-5 rounded-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Recent Live Activity</h3>
            <p className="text-[11px] text-muted-foreground">Real-time status changes and ticket updates</p>
          </div>
          <button 
            onClick={() => setActiveTab('tickets')}
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            View all <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {recent.map((ticket) => (
            <div 
              key={ticket.id} 
              onClick={() => {
                setSelectedTicket(ticket);
                setActiveTab('tickets');
              }}
              className="flex items-start justify-between p-2.5 rounded-lg border border-border/40 hover:bg-muted/50 cursor-pointer transition-all"
            >
              <div className="flex flex-col gap-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-primary font-bold">{ticket.ticketId}</span>
                  <span className="text-[10px] text-muted-foreground">• {formatDate(ticket.createdAt)}</span>
                </div>
                <h4 className="text-xs font-medium truncate text-foreground">{ticket.subject}</h4>
                <span className="text-[9px] text-muted-foreground truncate">By {ticket.createdBy}</span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
