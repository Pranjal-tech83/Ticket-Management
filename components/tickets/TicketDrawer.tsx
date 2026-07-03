'use client';

import React, { useState } from 'react';
import { Ticket } from '@/types';
import { useTicketStore } from '@/store/useTicketStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { 
  X, 
  Brain, 
  Clock, 
  Paperclip, 
  CheckCircle, 
  ShieldAlert, 
  ArrowUpRight, 
  UserPlus, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getStatusColor, getPriorityColor, getSeverityColor, formatDate } from '@/lib/utils';

interface TicketDrawerProps {
  ticket: Ticket;
  onClose: () => void;
}

export default function TicketDrawer({ ticket, onClose }: TicketDrawerProps) {
  const { updateTicketStatus, assignTicket } = useTicketStore();
  const { addNotification } = useNotificationStore();
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  const handleResolve = () => {
    updateTicketStatus(ticket.id, 'resolved');
    addNotification({
      type: 'resolved',
      title: 'Ticket Resolved',
      message: `Ticket ${ticket.ticketId} has been resolved by agent.`,
      ticketId: ticket.id
    });
  };

  const handleEscalate = () => {
    updateTicketStatus(ticket.id, 'escalated');
    addNotification({
      type: 'escalation',
      title: 'Ticket Escalation Triggered',
      message: `Ticket ${ticket.ticketId} has been escalated to Tier-2 engineers.`,
      ticketId: ticket.id
    });
  };

  const handleAssign = (agent: string) => {
    assignTicket(ticket.id, agent);
    setShowAssignDropdown(false);
    addNotification({
      type: 'jira_updated',
      title: 'Agent Assigned',
      message: `Ticket ${ticket.ticketId} has been assigned to ${agent}.`,
      ticketId: ticket.id
    });
  };

  const mockAgents = ['Sophia Martinez', 'Alex Rivera', 'Emily Watson', 'Marcus Vance'];

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 p-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary">{ticket.ticketId}</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(ticket.status)}`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Subject & Created details */}
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground leading-snug">{ticket.subject}</h2>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
            <span>By {ticket.createdBy}</span>
            <span>•</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        {/* AI Classification Info Card */}
        {ticket.aiClassification && (
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 glow-blue space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5 text-primary">
                <Brain size={14} className="animate-pulse" /> AI Agent Classification
              </span>
              <span className="text-[10px] font-semibold text-primary">
                Confidence: {ticket.aiConfidence || ticket.aiClassification.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 rounded-lg bg-background/50 border border-border/40">
                <span className="text-[9px] text-muted-foreground block">Predicted Category</span>
                <span className="font-semibold capitalize text-foreground">{ticket.aiClassification.category}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background/50 border border-border/40">
                <span className="text-[9px] text-muted-foreground block">Risk Level</span>
                <span className="font-semibold capitalize text-foreground">{ticket.aiClassification.riskLevel}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background/50 border border-border/40">
                <span className="text-[9px] text-muted-foreground block">Suggested Severity</span>
                <span className="font-semibold text-foreground">{ticket.aiClassification.severity}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background/50 border border-border/40">
                <span className="text-[9px] text-muted-foreground block">Suggested Dept</span>
                <span className="font-semibold text-foreground">{ticket.aiClassification.suggestedDepartment}</span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed italic bg-background/30 p-2 rounded-lg">
              Reasoning: {ticket.aiClassification.reasoning}
            </p>
          </div>
        )}

        {/* Description */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ticket Description</h3>
          <p className="text-xs text-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* AI Suggested Resolution */}
        {ticket.generatedSolution && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={13} /> AI Suggested Draft Resolution
            </h3>
            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-foreground leading-relaxed space-y-2">
              <p className="font-medium">System recommendation:</p>
              <div className="whitespace-pre-wrap">{ticket.generatedSolution}</div>
              
              {ticket.knowledgeSources && ticket.knowledgeSources.length > 0 && (
                <div className="pt-2 border-t border-border/40 mt-2 space-y-1">
                  <span className="text-[9px] text-muted-foreground block uppercase font-bold">RAG Reference Sources:</span>
                  {ticket.knowledgeSources.map((src, i) => (
                    <span key={i} className="text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mr-1">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline Event Feed */}
        {ticket.timeline && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Clock size={13} /> Audit Timeline Logs
            </h3>
            <div className="relative pl-4 space-y-3.5 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-[1px] before:bg-border">
              {ticket.timeline.map((event) => (
                <div key={event.id} className="relative text-xs">
                  <span className="absolute -left-4 top-1 h-2 w-2 rounded-full border border-background bg-primary ring-2 ring-background" />
                  <div className="flex justify-between items-start gap-1">
                    <p className="text-muted-foreground text-[11px] leading-tight">{event.message}</p>
                    <span className="text-[8px] text-muted-foreground shrink-0">{formatDate(event.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Escalation History */}
        {ticket.escalationHistory && ticket.escalationHistory.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle size={13} /> Escalation Logs
            </h3>
            <div className="space-y-2">
              {ticket.escalationHistory.map((item) => (
                <div key={item.id} className="p-2 border border-rose-500/20 bg-rose-500/5 rounded-lg text-[10px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-rose-600 dark:text-rose-400">Level {item.level} Escalation</span>
                    <span className="text-muted-foreground">{formatDate(item.timestamp)}</span>
                  </div>
                  <p className="text-muted-foreground"><span className="font-semibold text-foreground">Reason:</span> {item.reason}</p>
                  <p className="text-muted-foreground mt-0.5"><span className="font-semibold text-foreground">Route:</span> {item.fromAgent} → {item.toAgent}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Paperclip size={13} /> Attachments
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ticket.attachments.map((file) => (
                <div key={file.id} className="p-2 border rounded-lg flex items-center gap-2 bg-muted/10">
                  <Paperclip size={14} className="text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-medium truncate block text-foreground">{file.name}</span>
                    <span className="text-[8px] text-muted-foreground">{(file.size / 1000).toFixed(0)} KB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Quick Response Panel */}
      <div className="border-t border-border/40 p-4 bg-muted/20 shrink-0 space-y-2.5 relative">
        <div className="grid grid-cols-2 gap-2">
          {/* Resolve */}
          <button 
            onClick={handleResolve}
            disabled={ticket.status === 'resolved'}
            className="flex items-center justify-center gap-1 h-9 rounded-lg border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Resolve
          </button>

          {/* Escalate */}
          <button 
            onClick={handleEscalate}
            disabled={ticket.status === 'escalated'}
            className="flex items-center justify-center gap-1 h-9 rounded-lg border border-rose-500/30 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Escalate
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Assign Agent button */}
          <div className="relative">
            <button 
              onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              className="w-full flex items-center justify-center gap-1 h-9 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold transition-all text-foreground"
            >
              <UserPlus size={13} /> {ticket.assignedAgent ? 'Reassign' : 'Assign Agent'}
            </button>

            {showAssignDropdown && (
              <div className="absolute bottom-full left-0 mb-1 w-full bg-card border rounded-lg shadow-lg z-50 p-1">
                {mockAgents.map((ag) => (
                  <button
                    key={ag}
                    onClick={() => handleAssign(ag)}
                    className="w-full text-left px-2 py-1.5 text-[11px] rounded hover:bg-muted font-medium text-foreground"
                  >
                    {ag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download Log */}
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(ticket, null, 2))}`}
            download={`ticket-${ticket.ticketId}.json`}
            className="flex items-center justify-center gap-1 h-9 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold transition-all text-foreground"
          >
            <Download size={13} /> Download JSON
          </a>
        </div>
      </div>
    </div>
  );
}
