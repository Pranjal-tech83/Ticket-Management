'use client';

import React, { useState } from 'react';
import { mockEmailTemplates, mockEmailLogs } from '@/lib/mock-data';
import { EmailTemplate, EmailLog } from '@/types';
import { 
  Mail, 
  Send, 
  FileText, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailAutomation() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [logs, setLogs] = useState<EmailLog[]>(mockEmailLogs);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(mockEmailTemplates[0]);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(mockEmailLogs[0]);

  // Handle template body updates
  const [templateBody, setTemplateBody] = useState(mockEmailTemplates[0].body);

  const handleTemplateSelect = (temp: EmailTemplate) => {
    setSelectedTemplate(temp);
    setTemplateBody(temp.body);
  };

  const handleSaveTemplate = () => {
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? { ...t, body: templateBody } : t));
    // Trigger mock notification of successful save
  };

  return (
    <div className="space-y-6">
      {/* Top Header info */}
      <div className="glass-card p-5 rounded-xl border border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Email Automation Console</h3>
          <p className="text-[11px] text-muted-foreground">Manage templates and audit outgoing communication delivery logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Templates list & editor (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col h-[500px] bg-card/30 rounded-xl border border-border/40 p-4 justify-between">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-primary" /> Resolution Response Templates
              </h4>
              <button
                onClick={handleSaveTemplate}
                className="h-7 px-3 rounded-lg bg-primary hover:bg-primary/95 text-[11px] font-semibold text-white transition-all shadow-sm"
              >
                Save Template
              </button>
            </div>

            {/* Template selector tab row */}
            <div className="flex gap-2 pb-1 overflow-x-auto shrink-0">
              {templates.map((temp) => (
                <button
                  key={temp.id}
                  onClick={() => handleTemplateSelect(temp)}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold capitalize border shrink-0 transition-all ${
                    selectedTemplate.id === temp.id 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-background hover:bg-muted text-muted-foreground border-border/50'
                  }`}
                >
                  {temp.name}
                </button>
              ))}
            </div>

            {/* Preview Box */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground font-semibold uppercase">Email Subject</span>
                <input
                  type="text"
                  readOnly
                  value={selectedTemplate.subject}
                  className="w-full h-9 rounded-lg border border-border/50 bg-background px-3 text-xs focus:outline-none text-foreground font-semibold"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[9px] text-muted-foreground font-semibold uppercase mb-1">Email Body Draft Template</span>
                <textarea
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full flex-1 rounded-lg border border-border bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none text-foreground font-mono leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Logs list (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col h-[500px] bg-card/30 rounded-xl border border-border/40 p-4 overflow-hidden">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={14} className="text-primary" /> Delivery Audit Logs
            </h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Real-time status updates of dispatched customer notification emails</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                  selectedLog?.id === log.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border/40 hover:bg-muted/30'
                }`}
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-foreground truncate block">{log.to}</span>
                    <span className="text-[9px] text-muted-foreground">{new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">{log.subject}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {log.status === 'sent' ? (
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle size={10} /> Sent
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <XCircle size={10} /> Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedLog && (
            <div className="mt-3 p-3 bg-muted/20 border border-border/40 rounded-xl shrink-0 space-y-1">
              <span className="text-[9px] text-muted-foreground font-bold uppercase">Dispatched log details</span>
              <p className="text-[10px] font-semibold text-foreground">Receiver: {selectedLog.to}</p>
              <p className="text-[10px] text-muted-foreground truncate">Subject: {selectedLog.subject}</p>
              <p className="text-[9px] text-muted-foreground">Sent timestamp: {new Date(selectedLog.sentAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
