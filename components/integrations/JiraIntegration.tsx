'use client';

import React, { useState } from 'react';
import { mockJiraTickets } from '@/lib/mock-data';
import { JiraTicket } from '@/types';
import { 
  Layers, 
  CheckCircle, 
  RotateCw, 
  PlusCircle, 
  ChevronRight, 
  ExternalLink,
  Power,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JiraIntegration() {
  const [isConnected, setIsConnected] = useState(true);
  const [tickets, setTickets] = useState<JiraTicket[]>(mockJiraTickets);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form fields
  const [summary, setSummary] = useState('');
  const [project, setProject] = useState('Core Engineering');
  const [priority, setPriority] = useState('High');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleCreateJira = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    const newTicket: JiraTicket = {
      id: String(Date.now()),
      key: `ENG-${Math.floor(4000 + Math.random() * 1000)}`,
      summary,
      status: 'To Do',
      priority,
      assignee: 'Unassigned',
      project,
      createdAt: new Date().toISOString(),
      link: '#'
    };

    setTickets([newTicket, ...tickets]);
    setSummary('');
    setShowCreateModal(false);
  };

  const projects = [
    { name: 'Core Engineering', code: 'ENG', lead: 'Alice Jenkins' },
    { name: 'Billing Infrastructure', code: 'BILL', lead: 'Mark Dev' },
    { name: 'Security Operations', code: 'SEC', lead: 'Marcus Vance' }
  ];

  return (
    <div className="space-y-6">
      {/* Top connection status */}
      <div className="glass-card p-5 rounded-xl border border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isConnected 
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' 
              : 'bg-muted border-border/40 text-muted-foreground'
          }`}>
            <Layers size={20} className={isConnected ? "animate-pulse" : ""} />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Atlassian Jira Integration</h3>
            <p className="text-[11px] text-muted-foreground">Synchronize customer tickets with engineering task backlogs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConnected(!isConnected)}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-semibold transition-all ${
              isConnected 
                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
            }`}
          >
            <Power size={13} /> {isConnected ? 'Disconnect' : 'Connect Jira'}
          </button>

          {isConnected && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground disabled:opacity-55"
            >
              <RotateCw size={13} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </div>
      </div>

      {isConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Projects lists (col-span-4) */}
          <div className="lg:col-span-4 glass-card p-5 rounded-xl border border-border/40 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Syncing Jira Projects</h4>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.code} className="p-3 border border-border/40 rounded-lg flex items-center justify-between bg-muted/20">
                    <div>
                      <span className="text-xs font-semibold block text-foreground">{proj.name}</span>
                      <span className="text-[9px] text-muted-foreground block mt-0.5">Lead: {proj.lead}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      {proj.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tickets lists (col-span-8) */}
          <div className="lg:col-span-8 glass-card p-5 rounded-xl border border-border/40 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Synced Jira Backlogs</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Jira tasks linked to open SupportPilot requests</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-primary hover:bg-primary/95 text-[11px] font-semibold text-white transition-all shadow-sm"
                >
                  <PlusCircle size={12} /> Create Task
                </button>
              </div>

              {/* Backlogs lists table */}
              <div className="border border-border/40 rounded-lg overflow-hidden bg-background/40">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground font-semibold uppercase">
                      <th className="p-2.5">Key</th>
                      <th className="p-2.5">Summary</th>
                      <th className="p-2.5">Project</th>
                      <th className="p-2.5">Priority</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-right">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/10">
                        <td className="p-2.5 font-bold font-mono text-primary">{t.key}</td>
                        <td className="p-2.5 font-medium max-w-xs truncate text-foreground">{t.summary}</td>
                        <td className="p-2.5 text-muted-foreground">{t.project}</td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                            t.priority === 'Highest' || t.priority === 'High' 
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                              : 'bg-zinc-500/10 text-zinc-400 border'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {t.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <a href={t.link} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted inline-block">
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 rounded-xl border border-border/40 text-center flex flex-col items-center justify-center space-y-3">
          <Layers size={36} className="text-muted-foreground animate-pulse" />
          <h4 className="text-sm font-semibold text-foreground">Jira Integration Disconnected</h4>
          <p className="text-[11px] text-muted-foreground max-w-sm">
            Connect your Atlassian Jira workspace to sync active engineering backlogs, map escalations, and auto-route tickets to developers.
          </p>
          <button
            onClick={() => setIsConnected(true)}
            className="h-8 px-4 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-white transition-all shadow"
          >
            Connect Jira Account
          </button>
        </div>
      )}

      {/* Create task dialog modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md p-5 rounded-2xl border border-border/80 shadow-2xl relative glow-blue"
            >
              <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
                <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                  <Layers size={14} className="text-primary animate-pulse" /> Link New Jira Ticket
                </span>
                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreateJira} className="space-y-4">
                {/* Summary */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="Describe the issue scope..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>

                {/* Project */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Project</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs focus:outline-none text-foreground"
                  >
                    {projects.map(p => (
                      <option key={p.code} value={p.name}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs focus:outline-none text-foreground"
                  >
                    <option value="Lowest">Lowest</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Highest">Highest</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-3 h-8 border rounded-lg text-xs font-semibold hover:bg-muted text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 h-8 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Link Jira Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
