// Core Types for SupportPilot

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'escalated' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketSeverity = 'S1' | 'S2' | 'S3' | 'S4';
export type TicketCategory = 'billing' | 'technical' | 'account' | 'feature_request' | 'bug' | 'security' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'agent' | 'user';
  department: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  severity: TicketSeverity;
  category: TicketCategory;
  department: string;
  assignedAgent?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  aiConfidence?: number;
  aiClassification?: AIClassification;
  timeline?: TimelineEvent[];
  attachments?: Attachment[];
  generatedSolution?: string;
  knowledgeSources?: string[];
  escalationHistory?: EscalationEvent[];
  tags?: string[];
  slaDeadline?: string;
  customerSatisfaction?: number;
}

export interface AIClassification {
  category: TicketCategory;
  confidence: number;
  severity: TicketSeverity;
  priority: TicketPriority;
  suggestedDepartment: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'assigned' | 'status_change' | 'comment' | 'escalated' | 'resolved' | 'ai_action';
  message: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, unknown>;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface EscalationEvent {
  id: string;
  fromAgent: string;
  toAgent: string;
  reason: string;
  timestamp: string;
  level: number;
}

export interface AgentStep {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  executionTime?: number;
  progress: number;
  logs: string[];
  icon: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  confidence: number;
  lastUpdated: string;
  views: number;
  helpful: number;
}

export interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
  project: string;
  createdAt: string;
  link: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  lastUsed: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending' | 'bounced';
  sentAt: string;
  template: string;
}

export interface Notification {
  id: string;
  type: 'new_ticket' | 'escalation' | 'resolved' | 'email_sent' | 'ai_failed' | 'jira_updated';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  ticketId?: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  aiResolutionRate: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  weeklyTrend: WeeklyDataPoint[];
  categoryDistribution: CategoryDataPoint[];
  agentPerformance: AgentPerformanceDataPoint[];
}

export interface WeeklyDataPoint {
  day: string;
  tickets: number;
  resolved: number;
  escalated: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface AgentPerformanceDataPoint {
  agent: string;
  resolved: number;
  avgTime: number;
  satisfaction: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
