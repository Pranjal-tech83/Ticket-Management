'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTicketStore } from '@/store/useTicketStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { TicketCategory, TicketPriority, TicketSeverity } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Brain, Check, ShieldAlert } from 'lucide-react';

interface FormInputs {
  subject: string;
  description: string;
  category: TicketCategory;
  department: string;
  priority: TicketPriority;
  severity: TicketSeverity;
}

interface NewTicketFormProps {
  onClose: () => void;
}

export default function NewTicketForm({ onClose }: NewTicketFormProps) {
  const { addTicket } = useTicketStore();
  const { addNotification } = useNotificationStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      category: 'technical',
      priority: 'medium',
      severity: 'S3',
      department: 'Support L1'
    }
  });

  const onSubmit = (data: FormInputs) => {
    setAnalyzing(true);
    
    // Simulate AI Agent running diagnostic pipeline
    setTimeout(() => {
      const added = addTicket({
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority,
        severity: data.severity,
        department: data.department,
        createdBy: 'Operator (operator@supportpilot.io)',
        status: 'open',
        tags: [data.category, 'self-submitted']
      });

      addNotification({
        type: 'new_ticket',
        title: 'New AI Agent Classification Completed',
        message: `Ticket ${added.ticketId} classified with ${(added.aiConfidence)}% confidence.`,
        ticketId: added.id
      });

      setPrediction(added.aiClassification);
      setAnalyzing(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-primary animate-pulse" size={18} />
          <h3 className="font-semibold text-sm">Create New Support Ticket</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
          <X size={16} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-12"
          >
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <Brain size={24} className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
            </div>
            <h4 className="text-sm font-semibold mb-1">Analyzing Support Request...</h4>
            <p className="text-[11px] text-muted-foreground max-w-xs text-center">
              Our Diagnosis Agent is extracting intent, detecting severity constraints, and formulating an expert category classification.
            </p>
          </motion.div>
        ) : prediction ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 space-y-4 overflow-y-auto pr-1"
          >
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 flex items-start gap-3">
              <Check className="shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-xs font-semibold">Classification Succeeded!</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  The ticket was analyzed and logged into the SupportPilot queue with matching SLA constraints.
                </p>
              </div>
            </div>

            {/* AI Classification Gauge / Panel */}
            <div className="glass-card p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-border/40 pb-2 mb-2">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Brain size={14} className="text-primary" /> AI Predictions
                </span>
                <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                  Confidence Score: {prediction.confidence}%
                </span>
              </div>

              {/* Confidence Meter Visual Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                  <span>Confidence Gauge</span>
                  <span>{prediction.confidence}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2 border rounded-lg bg-muted/20">
                  <span className="text-[9px] text-muted-foreground block">Predicted Category</span>
                  <span className="font-semibold capitalize text-foreground">{prediction.category}</span>
                </div>
                <div className="p-2 border rounded-lg bg-muted/20">
                  <span className="text-[9px] text-muted-foreground block">Suggested Department</span>
                  <span className="font-semibold text-foreground">{prediction.suggestedDepartment}</span>
                </div>
                <div className="p-2 border rounded-lg bg-muted/20">
                  <span className="text-[9px] text-muted-foreground block">Assigned Severity</span>
                  <span className="font-semibold text-foreground">{prediction.severity}</span>
                </div>
                <div className="p-2 border rounded-lg bg-muted/20">
                  <span className="text-[9px] text-muted-foreground block">Risk Assessment</span>
                  <span className="font-semibold capitalize flex items-center gap-1 text-foreground">
                    {prediction.riskLevel === 'high' || prediction.riskLevel === 'critical' ? (
                      <ShieldAlert size={12} className="text-red-500" />
                    ) : null}
                    {prediction.riskLevel}
                  </span>
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-primary/5 text-[11px] leading-relaxed">
                <span className="font-semibold block text-primary mb-0.5">Classification Reasoning:</span>
                <span className="text-muted-foreground">{prediction.reasoning}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
            <div className="space-y-3.5">
              {/* Subject */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Subject</label>
                <input 
                  type="text" 
                  placeholder="Summarize the core request..."
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.subject && <span className="text-[9px] text-red-500">{errors.subject.message}</span>}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Description</label>
                <textarea 
                  placeholder="Provide precise details, steps, or logs..."
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
                {errors.description && <span className="text-[9px] text-red-500">{errors.description.message}</span>}
              </div>

              {/* Dropdowns row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Category</label>
                  <select 
                    {...register('category')}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="technical">Technical / API</option>
                    <option value="billing">Billing Issue</option>
                    <option value="account">Account & Security</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="bug">Report Bug</option>
                    <option value="security">Security Alert</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Department</label>
                  <select 
                    {...register('department')}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Support L1">Support L1</option>
                    <option value="Finance">Finance / Billing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Security">Security Ops</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </div>
              </div>

              {/* Priority & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Priority</label>
                  <select 
                    {...register('priority')}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Severity</label>
                  <select 
                    {...register('severity')}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="S4">S4 (Low Impact)</option>
                    <option value="S3">S3 (Moderate Impact)</option>
                    <option value="S2">S2 (High Impact)</option>
                    <option value="S1">S1 (Blocker / Down)</option>
                  </select>
                </div>
              </div>

              {/* File Upload mock */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Attachment</label>
                <div className="border border-dashed border-border rounded-lg p-3 text-center hover:bg-muted/30 transition-all cursor-pointer">
                  <Upload size={16} className="mx-auto text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground block font-medium">Click or drag files to upload</span>
                  <span className="text-[8px] text-muted-foreground/60">Supports PNG, JPG, JSON, logs up to 10MB</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1.5"
              >
                <Brain size={14} /> Submit & Analyze
              </button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
