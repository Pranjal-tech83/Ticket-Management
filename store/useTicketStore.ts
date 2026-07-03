import { create } from 'zustand';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../types';
import { mockTickets } from '../lib/mock-data';

interface TicketStore {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  searchQuery: string;
  statusFilter: TicketStatus | 'all';
  priorityFilter: TicketPriority | 'all';
  categoryFilter: TicketCategory | 'all';
  setSelectedTicket: (ticket: Ticket | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: TicketStatus | 'all') => void;
  setPriorityFilter: (priority: TicketPriority | 'all') => void;
  setCategoryFilter: (category: TicketCategory | 'all') => void;
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketId' | 'createdAt' | 'updatedAt'>) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  assignTicket: (id: string, agentName: string) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: mockTickets,
  selectedTicket: null,
  searchQuery: '',
  statusFilter: 'all',
  priorityFilter: 'all',
  categoryFilter: 'all',
  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  addTicket: (newTicketData) => {
    const id = String(Math.floor(Math.random() * 1000000));
    const ticketId = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    
    // Simulate AI confidence and prediction
    const aiConfidence = 85 + Math.floor(Math.random() * 14);
    const mockAIClassification = {
      category: newTicketData.category,
      confidence: aiConfidence,
      severity: newTicketData.severity,
      priority: newTicketData.priority,
      suggestedDepartment: newTicketData.department,
      riskLevel: (newTicketData.priority === 'critical' || newTicketData.priority === 'high' ? 'high' : 'low') as 'low' | 'medium' | 'high' | 'critical',
      reasoning: `AI matched description keywords. High structural match with current templates for "${newTicketData.category}".`
    };

    const newTicket: Ticket = {
      ...newTicketData,
      id,
      ticketId,
      createdAt: now,
      updatedAt: now,
      aiConfidence,
      aiClassification: mockAIClassification,
      timeline: [
        {
          id: `t_${id}_1`,
          type: 'created',
          message: `Ticket submitted by ${newTicketData.createdBy}`,
          timestamp: now,
        },
        {
          id: `t_${id}_2`,
          type: 'ai_action',
          message: `SupportPilot AI auto-classified: category=${newTicketData.category}, priority=${newTicketData.priority} (confidence ${aiConfidence}%)`,
          timestamp: now,
        }
      ]
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets]
    }));

    return newTicket;
  },
  updateTicketStatus: (id, status) => set((state) => {
    const now = new Date().toISOString();
    const updatedTickets = state.tickets.map((t) => {
      if (t.id === id) {
        const timeline = [
          ...(t.timeline || []),
          {
            id: `t_${id}_status_${now}`,
            type: 'status_change' as const,
            message: `Status updated to ${status.replace('_', ' ')}`,
            timestamp: now,
          }
        ];
        return {
          ...t,
          status,
          updatedAt: now,
          resolvedAt: status === 'resolved' ? now : t.resolvedAt,
          timeline
        };
      }
      return t;
    });

    const currentSelected = state.selectedTicket?.id === id 
      ? updatedTickets.find(t => t.id === id) || null 
      : state.selectedTicket;

    return { tickets: updatedTickets, selectedTicket: currentSelected };
  }),
  assignTicket: (id, agentName) => set((state) => {
    const now = new Date().toISOString();
    const updatedTickets = state.tickets.map((t) => {
      if (t.id === id) {
        const timeline = [
          ...(t.timeline || []),
          {
            id: `t_${id}_assign_${now}`,
            type: 'assigned' as const,
            message: `Ticket assigned to ${agentName}`,
            timestamp: now,
          }
        ];
        return { ...t, assignedAgent: agentName, updatedAt: now, timeline };
      }
      return t;
    });

    const currentSelected = state.selectedTicket?.id === id 
      ? updatedTickets.find(t => t.id === id) || null 
      : state.selectedTicket;

    return { tickets: updatedTickets, selectedTicket: currentSelected };
  }),
}));
