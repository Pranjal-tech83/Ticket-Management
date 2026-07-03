'use client';

import React, { useState } from 'react';
import { mockJiraTickets, mockEmailTemplates, mockEmailLogs } from '@/lib/mock-data';
import { JiraTicket, EmailTemplate, EmailLog } from '@/types';
import { 
  Layers, 
  CheckCircle, 
  RotateCw, 
  PlusCircle, 
  ExternalLink,
  Power,
  X,
  Settings,
  Mail,
  Send,
  FileText,
  XCircle,
  Plus,
  Trash2,
  Sliders,
  Bell,
  MessageSquare,
  Cloud,
  FileCode,
  Shield,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Define structures for mock integration statuses
interface IntegrationConfig {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  connectedAgo?: string;
  description: string;
  icon: string;
}

export default function IntegrationsDashboard() {
  // Store integration list
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    { id: 'slack', name: 'Slack', status: 'ACTIVE', connectedAgo: '3 days ago', description: 'Automate notifications and ticket summaries directly to your workspace channels.', icon: 'slack' },
    { id: 'salesforce', name: 'Salesforce', status: 'ACTIVE', connectedAgo: '5 days ago', description: 'Bridge the gap between support tickets and customer CRM data for deep context.', icon: 'salesforce' },
    { id: 'zendesk', name: 'Zendesk', status: 'INACTIVE', description: 'Migrate legacy tickets or keep a live sync between SupportPilot AI and Zendesk.', icon: 'zendesk' },
    { id: 'gmail', name: 'Gmail', status: 'ACTIVE', connectedAgo: '10 days ago', description: 'Let our AI Agent read and respond to support emails from your shared inbox.', icon: 'gmail' },
    { id: 'hubspot', name: 'HubSpot', status: 'INACTIVE', description: 'Sync marketing and sales insights with support tickets for a 360-degree customer view.', icon: 'hubspot' },
    { id: 'msteams', name: 'MS Teams', status: 'INACTIVE', description: 'Enterprise collaboration syncing. Push high-priority alerts to dedicated Team channels.', icon: 'msteams' }
  ]);

  // UI state
  const [activeIntegration, setActiveIntegration] = useState<string>('jira'); // 'jira', 'gmail', 'slack', etc.
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookName, setWebhookName] = useState('');

  // JIRA SPECIFIC STATES
  const [isJiraConnected, setIsJiraConnected] = useState(true);
  const [jiraTickets, setJiraTickets] = useState<JiraTicket[]>(mockJiraTickets);
  const [isJiraSyncing, setIsJiraSyncing] = useState(false);
  const [showJiraCreateModal, setShowJiraCreateModal] = useState(false);
  const [jiraTab, setJiraTab] = useState<'settings' | 'backlog'>('settings');
  // Jira Form
  const [jiraSummary, setJiraSummary] = useState('');
  const [jiraProject, setJiraProject] = useState('Core Engineering');
  const [jiraPriority, setJiraPriority] = useState('High');

  // GMAIL/EMAIL SPECIFIC STATES
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(mockEmailLogs);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(mockEmailTemplates[0]);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(mockEmailLogs[0]);
  const [templateBody, setTemplateBody] = useState(mockEmailTemplates[0].body);

  // SLACK SPECIFIC STATES
  const [slackChannel, setSlackChannel] = useState('#support-alerts');
  const [slackAlertsEnabled, setSlackAlertsEnabled] = useState(true);

  // SALESFORCE SPECIFIC STATES
  const [sfSyncInterval, setSfSyncInterval] = useState('15m');
  const [sfAccountSync, setSfAccountSync] = useState(true);

  // Custom connection modal details
  const [connectModalId, setConnectModalId] = useState<string | null>(null);
  const [mockApiKey, setMockApiKey] = useState('');

  // Handlers
  const handleJiraSync = () => {
    setIsJiraSyncing(true);
    toast.loading('Syncing Atlassian Jira projects...', { id: 'jira-sync' });
    setTimeout(() => {
      setIsJiraSyncing(false);
      toast.success('Jira backlogs synchronized successfully!', { id: 'jira-sync' });
    }, 1200);
  };

  const handleCreateJira = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jiraSummary.trim()) return;

    const newTicket: JiraTicket = {
      id: String(Date.now()),
      key: `ENG-${Math.floor(4000 + Math.random() * 1000)}`,
      summary: jiraSummary,
      status: 'To Do',
      priority: jiraPriority,
      assignee: 'Unassigned',
      project: jiraProject,
      createdAt: new Date().toISOString(),
      link: '#'
    };

    setJiraTickets([newTicket, ...jiraTickets]);
    setJiraSummary('');
    setShowJiraCreateModal(false);
    toast.success(`Successfully linked new Jira task: ${newTicket.key}`);
  };

  const handleTemplateSelect = (temp: EmailTemplate) => {
    setSelectedTemplate(temp);
    setTemplateBody(temp.body);
  };

  const handleSaveTemplate = () => {
    setEmailTemplates(emailTemplates.map(t => t.id === selectedTemplate.id ? { ...t, body: templateBody } : t));
    toast.success('Email auto-response template saved!');
  };

  const handleToggleIntegration = (id: string, name: string) => {
    setIntegrations(integrations.map(integ => {
      if (integ.id === id) {
        const newStatus = integ.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (newStatus === 'ACTIVE') {
          toast.success(`${name} connected successfully!`);
          return { ...integ, status: 'ACTIVE', connectedAgo: 'Just now' };
        } else {
          toast.success(`${name} disconnected.`);
          if (activeIntegration === id) {
            setActiveIntegration('jira');
          }
          return { ...integ, status: 'INACTIVE', connectedAgo: undefined };
        }
      }
      return integ;
    }));
  };

  const handleConnectRequest = (id: string) => {
    setConnectModalId(id);
    setMockApiKey('');
  };

  const submitConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockApiKey.trim()) return;

    const matched = integrations.find(integ => integ.id === connectModalId);
    if (!matched) return;

    setIntegrations(integrations.map(integ => {
      if (integ.id === connectModalId) {
        return { ...integ, status: 'ACTIVE', connectedAgo: 'Just now' };
      }
      return integ;
    }));

    toast.success(`${matched.name} integration initialized successfully!`);
    setActiveIntegration(connectModalId!);
    setConnectModalId(null);
  };

  const submitWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim() || !webhookName.trim()) return;
    toast.success(`Custom Webhook "${webhookName}" saved!`);
    setShowWebhookModal(false);
    setWebhookUrl('');
    setWebhookName('');
  };

  // Inline Brand Logos
  const renderLogo = (name: string, size = "w-6 h-6") => {
    switch (name.toLowerCase()) {
      case 'jira':
        return (
          <svg viewBox="0 0 24 24" className={`${size} text-blue-500`} fill="currentColor">
            <path d="M11.5 2C11.2 2 11 2.2 11 2.5V7c0 .3.2.5.5.5H16c.3 0 .5-.2.5-.5V2.5c0-.3-.2-.5-.5-.5h-4.5zM6.5 7.5C6.2 7.5 6 7.7 6 8v9c0 .3.2.5.5.5H11c.3 0 .5-.2.5-.5V8c0-.3-.2-.5-.5-.5H6.5zM16.5 13c-.3 0-.5.2-.5.5v8c0 .3.2.5.5.5H21c.3 0 .5-.2.5-.5v-8c0-.3-.2-.5-.5-.5h-4.5z"/>
          </svg>
        );
      case 'slack':
        return (
          <svg viewBox="0 0 24 24" className={size} fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 8.823 0a2.528 2.528 0 0 1 2.52 2.522v2.52h-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.78a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 3.762a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.78a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-3.762 10.135a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.52-2.522v-2.52h2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043h-5.043z" fill="#E01E5A"/>
          </svg>
        );
      case 'salesforce':
        return (
          <svg viewBox="0 0 24 24" className={`${size} text-sky-400`} fill="currentColor">
            <path d="M17.7 9.8c-.2 0-.4 0-.5.1C16.5 7.6 14.1 6 11.3 6c-3.1 0-5.7 2-6.5 4.8-.4-.2-.9-.3-1.4-.3C1.5 10.5 0 12.1 0 14.1c0 2 1.5 3.6 3.4 3.6h14.3c3.5 0 6.3-2.8 6.3-6.2-.1-3.6-2.9-6.3-6.3-6.3l-.1 4.6z"/>
          </svg>
        );
      case 'zendesk':
        return (
          <svg viewBox="0 0 24 24" className={`${size} text-emerald-600`} fill="currentColor">
            <path d="M21.6 0H18c-.8 0-1.4.6-1.4 1.4v2.7c0 .8.6 1.4 1.4 1.4h3.6c.8 0 1.4-.6 1.4-1.4V1.4c0-.8-.6-1.4-1.4-1.4zM2.4 18.5H6c.8 0 1.4-.6 1.4-1.4v-2.7c0-.8-.6-1.4-1.4-1.4H2.4c-.8 0-1.4.6-1.4 1.4v2.7c0 .8.6 1.4 1.4 1.4zm19.2-4.1h-3.6c-.8 0-1.4.6-1.4 1.4v2.7c0 .8.6 1.4 1.4 1.4h3.6c.8 0 1.4-.6 1.4-1.4v-2.7c0-.8-.6-1.4-1.4-1.4zM2.4 0H6c.8 0 1.4.6 1.4 1.4v2.7c0 .8-.6 1.4-1.4 1.4H2.4C1.6 5.5 1 4.9 1 4.1V1.4C1 .6 1.6 0 2.4 0zM12 4.1C7.6 4.1 4.1 7.6 4.1 12S7.6 19.9 12 19.9s7.9-3.5 7.9-7.9S16.4 4.1 12 4.1zm0 11c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z"/>
          </svg>
        );
      case 'gmail':
        return (
          <svg viewBox="0 0 24 24" className={size} fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" className="text-red-500" />
            <path d="M22 4L12 12L2 4" className="text-red-500" />
          </svg>
        );
      case 'hubspot':
        return (
          <svg viewBox="0 0 24 24" className={`${size} text-orange-500`} fill="currentColor">
            <path d="M18.9 10.9c-.8 0-1.5.5-1.8 1.2h-3.5c-.2-.7-.6-1.3-1.1-1.8l2.2-2.2c.7.3 1.5.2 2-.3.6-.6.6-1.6 0-2.2s-1.6-.6-2.2 0c-.5.5-.6 1.3-.3 2L12 9.7c-.5-.5-1.1-.9-1.8-1.1V5.1c.7-.3 1.2-1 1.2-1.8 0-1.2-1-2.2-2.2-2.2S7 2.1 7 3.3c0 .8.5 1.5 1.2 1.8v3.5C7.5 8.8 7 9.4 6.8 10.1l-2.2-2c.3-.7.2-1.5-.3-2-.6-.6-1.6-.6-2.2 0s-.6 1.6 0 2.2c.5.5 1.3.6 2 .3l2.2 2.2c-.5.5-.9 1.1-1.1 1.8H1.8c-.8 0-1.5.5-1.8 1.2 0 1.2 1 2.2 2.2 2.2.8 0 1.5-.5 1.8-1.2h3.5c.2.7.6 1.3 1.1 1.8l-2.2 2.2c-.7-.3-1.5-.2-2 .3-.6.6-.6 1.6 0 2.2.3.3.7.5 1.1.5s.8-.2 1.1-.5c.5-.5.6-1.3.3-2l2.2-2.2c.5.5 1.1.9 1.8 1.1v3.5c-.7.3-1.2 1-1.2 1.8 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2c0-.8-.5-1.5-1.2-1.8v-3.5c.7-.2 1.3-.6 1.8-1.1l2.2 2.2c-.3.7-.2 1.5.3 2 .3.3.7.5 1.1.5.4 0 .8-.2 1.1-.5.6-.6.6-1.6 0-2.2-.5-.5-1.3-.6-2-.3l-2.2-2.2c.5-.5.9-1.1 1.1-1.8h3.5c.3.7 1 1.2 1.8 1.2 1.2 0 2.2-1 2.2-2.2 0-.7-.5-1.4-1.2-1.7zm-8.9 2.4c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z"/>
          </svg>
        );
      case 'msteams':
        return (
          <svg viewBox="0 0 24 24" className={`${size} text-violet-500`} fill="currentColor">
            <path d="M12.5 10c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5zm6.5 2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM4.5 10.5c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5zM12 15.5c-2.8 0-8.5 1.4-8.5 4.2v1.8h17v-1.8c0-2.8-5.7-4.2-8.5-4.2z"/>
          </svg>
        );
      default:
        return <Layers className={`${size} text-primary`} />;
    }
  };

  const activeIntegDetails = integrations.find(integ => integ.id === activeIntegration);

  return (
    <div className="space-y-6">
      {/* Header section matching user's image */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Integrations</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Connect your workflow with SupportPilot's AI core.</p>
        </div>
        <button 
          onClick={() => setShowWebhookModal(true)}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary hover:bg-primary/95 text-xs font-semibold text-white transition-all shadow-md active:scale-95 animate-fade-in"
        >
          <Plus size={15} /> Custom Webhook
        </button>
      </div>

      {/* TOP CONFIGURATION CARD (Active details view) */}
      <div className="glass-card rounded-2xl border border-border/60 p-6 relative overflow-hidden glow-blue">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-[50px] pointer-events-none"></div>
        
        {/* Dynamic content depending on active integration selection */}
        {activeIntegration === 'jira' && (
          <div className="space-y-6">
            {/* Jira Top panel layout */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-border/40">
              {/* Left Column: Atlassian Jira Status */}
              <div className="flex items-start gap-4 lg:w-1/3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 shrink-0">
                  {renderLogo('jira', 'w-7 h-7')}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">Atlassian Jira</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">
                      {isJiraConnected ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">• Connected 12 days ago</span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Syncing Switches */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 lg:w-1/3 border-t lg:border-t-0 lg:border-x border-border/40 pt-4 lg:pt-0 lg:px-6 justify-center">
                <div className="space-y-3 shrink-0">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Syncing Settings</span>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-xs font-semibold text-foreground">Automatic Issue Creation</span>
                    <button
                      onClick={() => setIsJiraConnected(!isJiraConnected)}
                      className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${isJiraConnected ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-200 ${isJiraConnected ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-xs font-semibold text-foreground">Two-Way Status Syncing</span>
                    <button
                      onClick={() => setIsJiraConnected(!isJiraConnected)}
                      className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${isJiraConnected ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-200 ${isJiraConnected ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Middle Right Column: Target Projects */}
              <div className="flex flex-col gap-2 lg:w-1/4 pt-4 lg:pt-0 justify-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Target Projects</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                    PLAT-ENGINEERING
                  </span>
                  <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                    CX-SUPPORT
                  </span>
                  <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                    AI-CORE
                  </span>
                </div>
              </div>

              {/* Right Column: Recent Activity */}
              <div className="flex flex-col justify-between gap-4 lg:w-1/3 pt-4 lg:pt-0">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Recent Activity</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-foreground">
                      <span className="font-semibold truncate">Ticket #SP-492 synced</span>
                      <span className="text-[9px] text-muted-foreground shrink-0">2 minutes ago</span>
                    </div>
                    <div className="flex justify-between items-center text-foreground">
                      <span className="font-semibold truncate">Jira Issue Resolved: PLAT-882</span>
                      <span className="text-[9px] text-muted-foreground shrink-0">1 hour ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 shrink-0">
                  <button
                    onClick={handleJiraSync}
                    disabled={isJiraSyncing || !isJiraConnected}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground disabled:opacity-55"
                  >
                    <RotateCw size={12} className={isJiraSyncing ? "animate-spin" : ""} /> Sync Now
                  </button>
                  <button
                    onClick={() => setJiraTab(jiraTab === 'settings' ? 'backlog' : 'settings')}
                    className="flex items-center gap-1 h-8 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-xs font-semibold text-primary"
                  >
                    <Sliders size={12} /> {jiraTab === 'settings' ? 'View Synced Backlogs' : 'Hide Backlogs'}
                  </button>
                </div>
              </div>
            </div>

            {/* Jira Toggleable Synced Backlogs View */}
            {isJiraConnected && jiraTab === 'backlog' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Synced Jira Backlogs</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Jira tasks linked to open SupportPilot requests</p>
                  </div>
                  <button
                    onClick={() => setShowJiraCreateModal(true)}
                    className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-primary hover:bg-primary/95 text-[11px] font-semibold text-white transition-all shadow-sm active:scale-95"
                  >
                    <PlusCircle size={12} /> Create Task
                  </button>
                </div>

                {/* Backlogs table layout */}
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
                      {jiraTickets.map((t) => (
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
              </motion.div>
            )}
          </div>
        )}

        {activeIntegration === 'gmail' && (
          <div className="space-y-6">
            {/* Gmail config header */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-border/40">
              <div className="flex items-start gap-4 lg:w-1/3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 shrink-0">
                  {renderLogo('gmail', 'w-7 h-7')}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">Gmail Integration</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">ACTIVE</span>
                    <span className="text-[10px] text-muted-foreground">• Connected 10 days ago</span>
                  </div>
                </div>
              </div>

              {/* Status parameters */}
              <div className="flex flex-col gap-3 lg:w-1/3 border-t lg:border-t-0 lg:border-x border-border/40 pt-4 lg:pt-0 lg:px-6 justify-center">
                <div className="space-y-3 shrink-0">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Operational Settings</span>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-xs font-semibold text-foreground">Sync Draft Solutions</span>
                    <button className="relative w-8 h-4 rounded-full bg-primary">
                      <span className="absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full translate-x-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-xs font-semibold text-foreground">Auto-Dispatch Critical Alerts</span>
                    <button className="relative w-8 h-4 rounded-full bg-muted">
                      <span className="absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full translate-x-0" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end lg:w-1/3 pt-4 lg:pt-0 text-right">
                <p className="text-[11px] text-muted-foreground">Inbox Address Mapped:</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">support-inbound@supportpilot.ai</p>
              </div>
            </div>

            {/* Email Templates Editor & Delivery Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
              {/* Templates list & editor (col-span-7) */}
              <div className="lg:col-span-7 flex flex-col h-[400px] bg-background/30 rounded-xl border border-border/40 p-4 justify-between">
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={14} className="text-primary" /> Response Templates
                    </h4>
                    <button
                      onClick={handleSaveTemplate}
                      className="h-7 px-3 rounded-lg bg-primary hover:bg-primary/95 text-[11px] font-semibold text-white transition-all shadow-sm active:scale-95"
                    >
                      Save Template
                    </button>
                  </div>

                  {/* Template selector tab row */}
                  <div className="flex gap-2 pb-1 overflow-x-auto shrink-0">
                    {emailTemplates.map((temp) => (
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
                  <div className="flex-1 flex flex-col gap-2 min-h-0">
                    <div className="space-y-1">
                      <span className="text-[9px] text-muted-foreground font-semibold uppercase">Email Subject</span>
                      <input
                        type="text"
                        readOnly
                        value={selectedTemplate.subject}
                        className="w-full h-8 rounded-lg border border-border/50 bg-background px-3 text-xs focus:outline-none text-foreground font-semibold"
                      />
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                      <span className="text-[9px] text-muted-foreground font-semibold uppercase mb-1">Email Body Draft</span>
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
              <div className="lg:col-span-5 flex flex-col h-[400px] bg-background/30 rounded-xl border border-border/40 p-4 overflow-hidden">
                <div className="mb-3 shrink-0">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={14} className="text-primary" /> Delivery Audit Logs
                  </h4>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Real-time status updates of dispatched customer notification emails</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
                  {emailLogs.map((log) => (
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
                          <span className="text-[8px] text-muted-foreground">{new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground block truncate">{log.subject}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {log.status === 'sent' ? (
                          <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle size={8} /> Sent
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <XCircle size={8} /> Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedLog && (
                  <div className="mt-3 p-3 bg-muted/20 border border-border/40 rounded-xl shrink-0 space-y-1">
                    <span className="text-[8px] text-muted-foreground font-bold uppercase">Dispatched log details</span>
                    <p className="text-[10px] font-semibold text-foreground">Receiver: {selectedLog.to}</p>
                    <p className="text-[10px] text-muted-foreground truncate">Subject: {selectedLog.subject}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SLACK CONFIGURATION */}
        {activeIntegration === 'slack' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-border/40">
              <div className="flex items-start gap-4 lg:w-1/3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 shrink-0">
                  {renderLogo('slack', 'w-7 h-7')}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">Slack Workspace Alerting</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">ACTIVE</span>
                    <span className="text-[10px] text-muted-foreground">• Connected 3 days ago</span>
                  </div>
                </div>
              </div>

              {/* Status parameters */}
              <div className="flex flex-col gap-3 lg:w-1/3 border-t lg:border-t-0 lg:border-x border-border/40 pt-4 lg:pt-0 lg:px-6 justify-center">
                <div className="space-y-3 shrink-0">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Operational Settings</span>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-xs font-semibold text-foreground">Critical SLA Breach Alerts</span>
                    <button 
                      onClick={() => setSlackAlertsEnabled(!slackAlertsEnabled)}
                      className={`relative w-8 h-4 rounded-full transition-colors ${slackAlertsEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${slackAlertsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center lg:w-1/3 pt-4 lg:pt-0">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Target Slack Channel</span>
                <input
                  type="text"
                  value={slackChannel}
                  onChange={(e) => setSlackChannel(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Channel Webhook Dispatch History</h4>
              <div className="border border-border/40 rounded-lg overflow-hidden bg-background/40 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-foreground p-2 border-b border-border/20">
                  <span>🚀 SLA Alert: Ticket [SP-1041] escalated to L2 support in <strong>{slackChannel}</strong></span>
                  <span className="text-muted-foreground text-[10px]">5 minutes ago</span>
                </div>
                <div className="flex justify-between items-center text-foreground p-2">
                  <span>ℹ️ Diagnostic complete: Ticket [SP-1042] classified as "billing" (94% confidence)</span>
                  <span className="text-muted-foreground text-[10px]">45 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SALESFORCE CONFIGURATION */}
        {activeIntegration === 'salesforce' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-border/40">
              <div className="flex items-start gap-4 lg:w-1/3">
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-500 shrink-0">
                  {renderLogo('salesforce', 'w-7 h-7')}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">Salesforce CRM Sync</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">ACTIVE</span>
                    <span className="text-[10px] text-muted-foreground">• Connected 5 days ago</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-1/3 border-t lg:border-t-0 lg:border-x border-border/40 pt-4 lg:pt-0 lg:px-6 justify-center">
                <div className="space-y-3 shrink-0">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">CRM Sync Settings</span>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-xs font-semibold text-foreground">Sync Account Contact Profiles</span>
                    <button 
                      onClick={() => setSfAccountSync(!sfAccountSync)}
                      className={`relative w-8 h-4 rounded-full transition-colors ${sfAccountSync ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${sfAccountSync ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center lg:w-1/3 pt-4 lg:pt-0">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Synchronization Period</span>
                <select
                  value={sfSyncInterval}
                  onChange={(e) => setSfSyncInterval(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="5m">Every 5 minutes</option>
                  <option value="15m">Every 15 minutes</option>
                  <option value="1h">Every hour</option>
                  <option value="1d">Daily sync</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Active Salesforce Mappings</h4>
              <div className="grid grid-cols-3 gap-3 text-xs text-center font-medium">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 text-foreground">
                  <span className="text-[9px] text-muted-foreground block uppercase mb-1">CRM Contact</span>
                  <span>Contact Object</span>
                  <span className="text-[10px] text-primary block mt-1">↔ SupportPilot User</span>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 text-foreground">
                  <span className="text-[9px] text-muted-foreground block uppercase mb-1">CRM Account</span>
                  <span>Account Object</span>
                  <span className="text-[10px] text-primary block mt-1">↔ SupportPilot Organization</span>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 text-foreground">
                  <span className="text-[9px] text-muted-foreground block uppercase mb-1">CRM Cases</span>
                  <span>Case Object</span>
                  <span className="text-[10px] text-primary block mt-1">↔ SupportPilot Support Tickets</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER INACTIVE INTEGRATIONS CONFIGURATIONS */}
        {['zendesk', 'hubspot', 'msteams'].includes(activeIntegration) && (
          <div className="space-y-5 text-center py-6 flex flex-col items-center justify-center animate-fade-in">
            <div className="p-4 bg-muted/40 rounded-full border border-border/40 text-muted-foreground animate-pulse mb-2">
              {renderLogo(activeIntegration, "w-10 h-10")}
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-sm font-bold text-foreground capitalize">{activeIntegration} Connection Settings</h3>
              <p className="text-xs text-muted-foreground">
                Authorize SupportPilot to fetch, synchronize, and map data across your {activeIntegration} organization.
              </p>
            </div>
            <button
              onClick={() => handleConnectRequest(activeIntegration)}
              className="h-9 px-5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-semibold text-white transition-all shadow-md active:scale-95 mt-2"
            >
              Configure & Connect {activeIntegDetails?.name}
            </button>
          </div>
        )}
      </div>

      {/* LOWER GRID: ALL INTEGRATIONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Atlassian Jira Card */}
        <div 
          onClick={() => setActiveIntegration('jira')}
          className={`glass-card p-5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between h-[180px] ${
            activeIntegration === 'jira' 
              ? 'border-blue-500/50 bg-blue-500/5 glow-blue' 
              : 'border-border/40 hover:border-border/80 hover:bg-muted/10'
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500">
                {renderLogo('jira', 'w-6 h-6')}
              </div>
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
            </div>
            <h4 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">Atlassian Jira</h4>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              Synchronize customer tickets with engineering task backlogs, manage developers flow, and link escalations.
            </p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-border/20 mt-2 shrink-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveIntegration('jira');
              }}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Configure
            </button>
          </div>
        </div>

        {/* Other Integration Cards dynamically mapped */}
        {integrations.map((integ) => {
          const isActive = integ.status === 'ACTIVE';
          return (
            <div
              key={integ.id}
              onClick={() => {
                if (isActive) {
                  setActiveIntegration(integ.id);
                } else {
                  handleConnectRequest(integ.id);
                }
              }}
              className={`glass-card p-5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between h-[180px] ${
                activeIntegration === integ.id 
                  ? 'border-primary/50 bg-primary/5 glow-blue' 
                  : 'border-border/40 hover:border-border/80 hover:bg-muted/10'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 rounded-xl border bg-background shrink-0">
                    {renderLogo(integ.icon, 'w-6 h-6')}
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' 
                      : 'text-zinc-500 bg-zinc-500/10 border border-zinc-500/20'
                  }`}>
                    {integ.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">{integ.name}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{integ.description}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border/20 mt-2 shrink-0">
                {isActive ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIntegration(integ.id);
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Configure
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleIntegration(integ.id, integ.name);
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title={`Disconnect ${integ.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectRequest(integ.id);
                    }}
                    className="text-xs font-bold text-foreground hover:text-primary hover:underline"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* JIRA CREATE TASK DIALOG MODAL */}
      <AnimatePresence>
        {showJiraCreateModal && (
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
                <button onClick={() => setShowJiraCreateModal(false)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreateJira} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="Describe the issue scope..."
                    value={jiraSummary}
                    onChange={(e) => setJiraSummary(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Project</label>
                  <select
                    value={jiraProject}
                    onChange={(e) => setJiraProject(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs focus:outline-none text-foreground font-semibold"
                  >
                    <option value="Core Engineering">Core Engineering (ENG)</option>
                    <option value="Billing Infrastructure">Billing Infrastructure (BILL)</option>
                    <option value="Security Operations">Security Operations (SEC)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Priority</label>
                  <select
                    value={jiraPriority}
                    onChange={(e) => setJiraPriority(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs focus:outline-none text-foreground font-semibold"
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
                    onClick={() => setShowJiraCreateModal(false)}
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

      {/* WEBHOOK CREATOR MODAL */}
      <AnimatePresence>
        {showWebhookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md p-5 rounded-2xl border border-border/80 shadow-2xl relative glow-blue"
            >
              <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
                <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                  <Activity size={14} className="text-primary animate-pulse" /> Register Custom Webhook
                </span>
                <button onClick={() => setShowWebhookModal(false)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={submitWebhook} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Webhook Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Datadog Alerts Dispatcher"
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Target Endpoint URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://api.yourdomain.com/webhooks/receiver"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setShowWebhookModal(false)}
                    className="px-3 h-8 border rounded-lg text-xs font-semibold hover:bg-muted text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 h-8 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Register Webhook
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONNECT INTEGRATION AUTH DIALOG */}
      <AnimatePresence>
        {connectModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-sm p-5 rounded-2xl border border-border/80 shadow-2xl relative glow-blue text-center space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border/40 mb-2">
                <span className="text-xs font-bold text-foreground capitalize">
                  Connect {connectModalId}
                </span>
                <button onClick={() => setConnectModalId(null)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary animate-bounce">
                  {renderLogo(connectModalId, "w-8 h-8")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your {connectModalId} account secret token or credentials below to authenticate the integration client.
                </p>
              </div>

              <form onSubmit={submitConnect} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">API Integration Token</label>
                  <input
                    type="password"
                    required
                    placeholder="xoxb-secret-api-token-value"
                    value={mockApiKey}
                    onChange={(e) => setMockApiKey(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setConnectModalId(null)}
                    className="px-3 h-8 border rounded-lg text-xs font-semibold hover:bg-muted text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 h-8 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-semibold shadow-sm active:scale-95"
                  >
                    Authenticate
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
