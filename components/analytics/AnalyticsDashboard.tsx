'use client';

import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Award, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { mockStats as statsData } from '@/lib/mock-data';

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8 text-center text-xs animate-pulse">Loading analytics engine...</div>;
  }

  // SLA data mock
  const slaData = [
    { name: 'S1 Critical', met: 98.4, breached: 1.6 },
    { name: 'S2 High', met: 96.5, breached: 3.5 },
    { name: 'S3 Medium', met: 99.1, breached: 0.9 },
    { name: 'S4 Low', met: 100, breached: 0 }
  ];

  // AI vs Agent performance
  const accuracyData = [
    { subject: 'Billing Context', AI: 94, Agent: 98 },
    { subject: 'SSO Setups', AI: 89, Agent: 95 },
    { subject: 'API Rate Limits', AI: 91, Agent: 94 },
    { subject: 'Router Retries', AI: 95, Agent: 99 },
    { subject: 'Domain SSL Bind', AI: 86, Agent: 93 }
  ];

  // CSAT monthly breakdown
  const csatTrend = [
    { month: 'Jan', rating: 4.5 },
    { month: 'Feb', rating: 4.6 },
    { month: 'Mar', rating: 4.8 },
    { month: 'Apr', rating: 4.7 },
    { month: 'May', rating: 4.9 },
    { month: 'Jun', rating: 4.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-4 rounded-xl border border-border/40 gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Performance Analytics Portal</h3>
          <p className="text-[11px] text-muted-foreground">Historical data reporting SLA resolution speeds, AI agent correctness rates, and CSAT scores</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all"
        >
          <FileText size={13} /> Export Report
        </button>
      </div>

      {/* Grid Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Ticket Volume & Resolution Rates */}
        <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={14} className="text-primary" /> Ticket Volume Trend vs SLA Met
            </h4>
            <p className="text-[10px] text-muted-foreground mb-4">Weekly incoming vs resolved statistics</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={statsData.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Legend iconSize={8} formatter={(value) => <span className="text-[10px] text-muted-foreground">{value}</span>} />
                <Bar dataKey="tickets" barSize={15} fill="#3b82f6" radius={[3, 3, 0, 0]} name="Inbound Volume" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved On Time" />
                <Line type="monotone" dataKey="escalated" stroke="#ef4444" strokeWidth={1.5} name="Escalations" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Model Accuracy vs Human Experts */}
        <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} className="text-primary" /> AI Model Accuracy Audit
            </h4>
            <p className="text-[10px] text-muted-foreground mb-4">Precision correlation (%) comparing AI auto-replies vs senior human agent review</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={accuracyData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#888888" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888888" fontSize={8} />
                <Radar name="SupportPilot AI" dataKey="AI" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="Senior Agent" dataKey="Agent" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Legend iconSize={8} formatter={(value) => <span className="text-[10px] text-muted-foreground">{value}</span>} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance Targets */}
        <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
              <Clock size={14} className="text-primary" /> SLA Met Target distribution
            </h4>
            <p className="text-[10px] text-muted-foreground mb-4">Breakdown comparing SLA breach window compliance</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={slaData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis type="number" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Legend iconSize={8} formatter={(value) => <span className="text-[10px] text-muted-foreground">{value}</span>} />
                <Bar dataKey="met" stackId="a" fill="#10b981" barSize={12} radius={[0, 3, 3, 0]} name="Met (%)" />
                <Bar dataKey="breached" stackId="a" fill="#ef4444" barSize={12} radius={[0, 3, 3, 0]} name="Breached (%)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Satisfaction rating trend */}
        <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
              <Award size={14} className="text-primary" /> CSAT Monthly Growth Index
            </h4>
            <p className="text-[10px] text-muted-foreground mb-4">Customer Satisfaction Score growth rating (out of 5)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={csatTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[3.5, 5.0]} stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 6 }} name="CSAT score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
