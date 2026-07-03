'use client';

import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useTicketStore } from '@/store/useTicketStore';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import TicketTable from '@/components/tickets/TicketTable';
import TicketDrawer from '@/components/tickets/TicketDrawer';
import AgentWorkflow from '@/components/ai/AgentWorkflow';
import KnowledgeBase from '@/components/knowledge/KnowledgeBase';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import IntegrationsDashboard from '@/components/integrations/IntegrationsDashboard';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { mockStats } from '@/lib/mock-data';
import { 
  Layers, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  Cpu, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { activeTab } = useUIStore();
  const { selectedTicket, setSelectedTicket } = useTicketStore();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Pilot Control Dashboard</h2>
              <p className="text-xs text-muted-foreground">Monitor real-time ticket volume, AI auto-resolutions, and SLA breach risks</p>
            </div>

            {/* 6 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <StatCard
                title="Total Tickets"
                value={mockStats.totalTickets}
                icon={Layers}
                description="Cumulative inbound requests"
                trend={{ value: 12.3, isPositive: true }}
              />
              <StatCard
                title="Open Tickets"
                value={mockStats.openTickets}
                icon={AlertCircle}
                description="Active backlog items"
                trend={{ value: 4.8, isPositive: false }}
              />
              <StatCard
                title="Resolved"
                value={mockStats.resolvedTickets}
                icon={CheckCircle}
                description="Successfully closed"
                trend={{ value: 18.2, isPositive: true }}
              />
              <StatCard
                title="AI Resolution Rate"
                value={`${mockStats.aiResolutionRate}%`}
                icon={Cpu}
                description="Self-resolved via agent"
                trend={{ value: 5.4, isPositive: true }}
              />
              <StatCard
                title="Avg Response Time"
                value={`${mockStats.avgResponseTime}m`}
                icon={Clock}
                description="First response speed"
                trend={{ value: 15.1, isPositive: true }}
              />
              <StatCard
                title="Satisfaction"
                value={`${mockStats.customerSatisfaction}/5`}
                icon={HelpCircle}
                description="Weighted CSAT review"
                trend={{ value: 2.1, isPositive: true }}
              />
            </div>

            {/* Charts grid & Activity panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <ChartCard
                  title="Inbound Volume vs Resolution Trends"
                  description="Comparison metrics comparing inbound tickets and successfully completed actions"
                  type="line"
                  data={mockStats.weeklyTrend}
                />
              </div>
              <div>
                <ChartCard
                  title="Ticket Categories Distribution"
                  description="Top classifications routed by SupportPilot AI"
                  type="pie"
                  data={mockStats.categoryDistribution}
                />
              </div>
            </div>

            {/* Bottom Section: Recent Live updates & Command Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <RecentActivity />
              <QuickActions />
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-6 relative">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Support Tickets Queue</h2>
              <p className="text-xs text-muted-foreground">Manage queue workflows, inspect AI diagnostic logs, and resolve tickets</p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <TicketTable />
            </div>

            {/* Sliding Ticket Detail Drawer Overlay */}
            <AnimatePresence>
              {selectedTicket && (
                <>
                  {/* Backdrop overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedTicket(null)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
                  />
                  {/* Drawer Content */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-card border-l border-border shadow-2xl z-50 overflow-hidden"
                  >
                    <TicketDrawer ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        );

      case 'ai-agent':
        return <AgentWorkflow />;

      case 'knowledge-base':
        return <KnowledgeBase />;

      case 'analytics':
        return <AnalyticsDashboard />;

      case 'integrations':
        return <IntegrationsDashboard />;

      case 'settings':
        return <SettingsPanel />;

      default:
        return (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Feature component in development. Select another menu tab.
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderTabContent()}
    </div>
  );
}
