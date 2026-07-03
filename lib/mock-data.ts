import { Ticket, KnowledgeArticle, JiraTicket, EmailTemplate, EmailLog, Notification, DashboardStats } from '../types';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketId: 'SP-1042',
    subject: 'Cannot access workspace billing details with owner credentials',
    description: 'When logging into the admin billing console and clicking on the invoices tab, I receive a 500 error page. I am the primary owner of the enterprise workspace. This has been happening for 3 days now and we need to download our latest invoice for accounting reconciliation.',
    status: 'open',
    priority: 'high',
    severity: 'S2',
    category: 'billing',
    department: 'Finance',
    assignedAgent: 'Sophia Martinez',
    createdBy: 'Sneh Singh (sneh.singh@stripe.com)',
    createdAt: '2026-07-03T10:00:00Z',
    updatedAt: '2026-07-03T10:15:00Z',
    aiConfidence: 94,
    tags: ['billing', 'invoice', 'permission-error'],
    slaDeadline: '2026-07-03T14:00:00Z',
    aiClassification: {
      category: 'billing',
      confidence: 94,
      severity: 'S2',
      priority: 'high',
      suggestedDepartment: 'Finance',
      riskLevel: 'medium',
      reasoning: 'The ticket mentions billing console 500 errors and inability to download invoices for reconciliation, impacting finance workflows. Detected keyword "invoice" and "billing console". Confidence is high.'
    },
    timeline: [
      {
        id: 't1',
        type: 'created',
        message: 'Ticket submitted by Sneh Singh',
        timestamp: '2026-07-03T10:00:00Z'
      },
      {
        id: 't2',
        type: 'ai_action',
        message: 'SupportPilot AI classified ticket: Billing category, High priority, S2 severity (94% confidence)',
        timestamp: '2026-07-03T10:01:00Z'
      },
      {
        id: 't3',
        type: 'assigned',
        message: 'Assigned to Sophia Martinez (Billing & Finance specialist)',
        timestamp: '2026-07-03T10:15:00Z'
      }
    ],
    attachments: [
      {
        id: 'a1',
        name: 'billing_500_error.png',
        size: 245000,
        type: 'image/png',
        url: '#',
        uploadedAt: '2026-07-03T10:00:00Z'
      }
    ],
    generatedSolution: `Based on internal runs, this 500 error in the Billing Console is often associated with cached Stripe session metadata. 

### Suggested Solution
1. Instruct the user to clear their browser storage or try in an Incognito window.
2. In the Admin Dashboard:
   - Navigate to the **User Management** panel.
   - Look up \`sneh.singh@stripe.com\`.
   - Click **Reset Billing Connection Tokens** to trigger a token refresh from our gateway.
3. If this fails, escalate to the Core Infrastructure Team.`,
    knowledgeSources: [
      'KB-2931: Fixing 500 Errors on Invoice Downloads',
      'KB-1049: Stripe API Session Synchronization & Renewal Policies'
    ]
  },
  {
    id: '2',
    ticketId: 'SP-1041',
    subject: 'Critical: Production API gateway timeout under load spikes',
    description: 'We are seeing latency spikes up to 12s on the /v1/resolve endpoint. In the logs we see "ERR_SOCKET_TIMEOUT" warnings. This is affecting all live production integrations. Need immediate load-balancing review.',
    status: 'escalated',
    priority: 'critical',
    severity: 'S1',
    category: 'technical',
    department: 'Engineering',
    assignedAgent: 'Alex Rivera',
    createdBy: 'Mithra (mithra@hashicorp.com)',
    createdAt: '2026-07-03T09:12:00Z',
    updatedAt: '2026-07-03T09:45:00Z',
    aiConfidence: 98,
    tags: ['api-gateway', 'timeout', 'critical-bug'],
    slaDeadline: '2026-07-03T10:12:00Z',
    aiClassification: {
      category: 'technical',
      confidence: 98,
      severity: 'S1',
      priority: 'critical',
      suggestedDepartment: 'Engineering',
      riskLevel: 'high',
      reasoning: 'Urgent reports of "ERR_SOCKET_TIMEOUT" on production endpoint /v1/resolve. Latency is 12s. High customer impact detected.'
    },
    timeline: [
      {
        id: 't4',
        type: 'created',
        message: 'Ticket submitted via API integration',
        timestamp: '2026-07-03T09:12:00Z'
      },
      {
        id: 't5',
        type: 'ai_action',
        message: 'SupportPilot AI: Classified as S1 Critical. SLA flag set to 1 hour.',
        timestamp: '2026-07-03T09:13:00Z'
      },
      {
        id: 't6',
        type: 'escalated',
        message: 'Escalated to Engineering On-Call level 2 support',
        timestamp: '2026-07-03T09:45:00Z'
      }
    ],
    escalationHistory: [
      {
        id: 'e1',
        fromAgent: 'SupportPilot AI',
        toAgent: 'Alex Rivera',
        reason: 'SLA deadline approaching, high severity latency issues require L2 intervention.',
        timestamp: '2026-07-03T09:45:00Z',
        level: 2
      }
    ]
  },
  {
    id: '3',
    ticketId: 'SP-1040',
    subject: 'Requesting permission to add custom domain for public widget',
    description: 'We want to bind support.ourcompany.com to our customer portal widget. Can you enable custom SSL binding on our account? We are on the Enterprise plan.',
    status: 'in_progress',
    priority: 'medium',
    severity: 'S3',
    category: 'feature_request',
    department: 'Customer Success',
    assignedAgent: 'Emily Watson',
    createdBy: 'Ruchitha (ruchitha@facebook.com)',
    createdAt: '2026-07-02T16:30:00Z',
    updatedAt: '2026-07-03T08:30:00Z',
    aiConfidence: 89,
    tags: ['custom-domain', 'ssl', 'dns'],
    slaDeadline: '2026-07-04T16:30:00Z',
    aiClassification: {
      category: 'feature_request',
      confidence: 89,
      severity: 'S3',
      priority: 'medium',
      suggestedDepartment: 'Customer Success',
      riskLevel: 'low',
      reasoning: 'User is requesting custom DNS SSL certificate binding which is a premium feature configuration.'
    },
    timeline: [
      {
        id: 't7',
        type: 'created',
        message: 'Ticket created',
        timestamp: '2026-07-02T16:30:00Z'
      },
      {
        id: 't8',
        type: 'comment',
        message: 'Emily Watson requested DNS TXT records to verify domain ownership.',
        timestamp: '2026-07-03T08:30:00Z'
      }
    ]
  },
  {
    id: '4',
    ticketId: 'SP-1039',
    subject: 'Reset multifactor authentication (MFA) token for team member',
    description: 'One of our developers lost their authenticator device. Can we reset the MFA status for user developer.alex@corporation.com?',
    status: 'resolved',
    priority: 'medium',
    severity: 'S3',
    category: 'account',
    department: 'Security',
    assignedAgent: 'Marcus Vance',
    createdBy: 'Anu (anu@corporation.com)',
    createdAt: '2026-07-02T11:00:00Z',
    updatedAt: '2026-07-02T12:00:00Z',
    resolvedAt: '2026-07-02T12:00:00Z',
    aiConfidence: 95,
    customerSatisfaction: 5,
    tags: ['mfa', 'security', 'account-reset'],
    aiClassification: {
      category: 'account',
      confidence: 95,
      severity: 'S3',
      priority: 'medium',
      suggestedDepartment: 'Security',
      riskLevel: 'medium',
      reasoning: 'Detected MFA reset request. High security implication. Requires L1 verification check.'
    },
    timeline: [
      {
        id: 't9',
        type: 'created',
        message: 'Ticket created',
        timestamp: '2026-07-02T11:00:00Z'
      },
      {
        id: 't10',
        type: 'ai_action',
        message: 'AI generated MFA reset guidelines & sent instructions.',
        timestamp: '2026-07-02T11:02:00Z'
      },
      {
        id: 't11',
        type: 'resolved',
        message: 'Marcus Vance completed verification & reset MFA.',
        timestamp: '2026-07-02T12:00:00Z'
      }
    ]
  },
  {
    id: '5',
    ticketId: 'SP-1038',
    subject: 'Integrate SAML/OIDC with Microsoft Entra ID',
    description: 'We are onboarding our corporate team and require single sign-on setup. Can you send over the metadata XML or tenant endpoint guidelines for configuration?',
    status: 'open',
    priority: 'low',
    severity: 'S4',
    category: 'technical',
    department: 'Support L1',
    createdBy: 'Pranjal Kumar (roman838303@gmail.com)',
    createdAt: '2026-07-03T11:05:00Z',
    updatedAt: '2026-07-03T11:05:00Z',
    aiConfidence: 91,
    tags: ['sso', 'saml', 'entra-id'],
    slaDeadline: '2026-07-05T11:05:00Z',
    aiClassification: {
      category: 'technical',
      confidence: 91,
      severity: 'S4',
      priority: 'low',
      suggestedDepartment: 'Support L1',
      riskLevel: 'low',
      reasoning: 'SSO installation request. Non-blocking standard setup.'
    }
  }
];

export const mockStats: DashboardStats = {
  totalTickets: 1240,
  openTickets: 42,
  resolvedTickets: 1120,
  aiResolutionRate: 78.4,
  avgResponseTime: 4.2,
  customerSatisfaction: 4.8,
  weeklyTrend: [
    { day: 'Mon', tickets: 120, resolved: 95, escalated: 15 },
    { day: 'Tue', tickets: 145, resolved: 110, escalated: 20 },
    { day: 'Wed', tickets: 160, resolved: 130, escalated: 12 },
    { day: 'Thu', tickets: 110, resolved: 90, escalated: 10 },
    { day: 'Fri', tickets: 135, resolved: 105, escalated: 18 },
    { day: 'Sat', tickets: 60, resolved: 50, escalated: 5 },
    { day: 'Sun', tickets: 45, resolved: 40, escalated: 2 }
  ],
  categoryDistribution: [
    { name: 'Billing Issues', value: 310, color: '#3b82f6' },
    { name: 'Technical / API', value: 450, color: '#10b981' },
    { name: 'Account & Security', value: 240, color: '#ef4444' },
    { name: 'Feature Requests', value: 160, color: '#f59e0b' },
    { name: 'Others', value: 80, color: '#8b5cf6' }
  ],
  agentPerformance: [
    { agent: 'Sophia Martinez', resolved: 145, avgTime: 8.5, satisfaction: 4.9 },
    { agent: 'Alex Rivera', resolved: 112, avgTime: 12.0, satisfaction: 4.7 },
    { agent: 'Emily Watson', resolved: 130, avgTime: 6.2, satisfaction: 4.8 },
    { agent: 'Marcus Vance', resolved: 98, avgTime: 9.8, satisfaction: 4.6 }
  ]
};

export const mockKnowledgeBase: KnowledgeArticle[] = [
  {
    id: 'kb1',
    title: 'Resolving Billing Console 500 Internal Server Errors',
    content: 'When users get a 500 error on loading invoices or stripe cards, the typical reason is an expired billing session synchronization cache. To resolve this: \n\n1. Ask the administrator to clear their browser local storage for supportpilot.io.\n2. In SupportPilot Admin, go to User Settings -> Reset Billing Cache.\n3. Verify if billing endpoints show healthy 200 OK status codes.',
    category: 'Billing',
    tags: ['billing', 'invoice', '500-error'],
    confidence: 97,
    lastUpdated: '2026-06-25T12:00:00Z',
    views: 412,
    helpful: 89
  },
  {
    id: 'kb2',
    title: 'Configuring SSO & SAML with Okta and Microsoft Entra ID',
    content: 'SupportPilot supports single sign-on via SAML 2.0. To set it up, you need:\n\n1. **Assertion Consumer Service (ACS) URL**: `https://api.supportpilot.io/auth/saml/acs`\n2. **Entity ID / Audience URI**: `supportpilot-saml-audience`\n\nEnsure mapping parameters contain email, firstName, and lastName.',
    category: 'Security',
    tags: ['sso', 'saml', 'okta', 'entra-id'],
    confidence: 94,
    lastUpdated: '2026-05-18T14:30:00Z',
    views: 289,
    helpful: 52
  },
  {
    id: 'kb3',
    title: 'API Rate Limits & Latency Optimization Guidelines',
    content: 'Our API has a default threshold of 1000 requests per minute per IP address. If rate limits are exceeded, the API responds with HTTP 429 Too Many Requests. To avoid gateways socket time-out (ERR_SOCKET_TIMEOUT), use batch resolution endpoints or verify keep-alive headers in HTTP client configurations.',
    category: 'Technical',
    tags: ['api', 'rate-limit', 'latency'],
    confidence: 88,
    lastUpdated: '2026-07-01T09:00:00Z',
    views: 654,
    helpful: 120
  }
];

export const mockJiraTickets: JiraTicket[] = [
  {
    id: 'j1',
    key: 'ENG-3921',
    summary: 'Fix Stripe billing webhook missing session refresh payloads',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Mark Dev',
    project: 'Core Engineering',
    createdAt: '2026-07-02T10:00:00Z',
    link: '#'
  },
  {
    id: 'j2',
    key: 'ENG-3920',
    summary: 'Investigate ERR_SOCKET_TIMEOUT on /v1/resolve under load',
    status: 'To Do',
    priority: 'Highest',
    assignee: 'Alice Oncall',
    project: 'Core Engineering',
    createdAt: '2026-07-03T09:20:00Z',
    link: '#'
  }
];

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'et1',
    name: 'Ticket Resolved Notification',
    subject: 'SupportPilot: Your ticket [Ticket ID] has been resolved',
    body: 'Hi [Customer Name],\n\nWe have successfully resolved your issue regarding [Subject].\n\nIf you have further questions, feel free to reply directly to this thread.\n\nBest,\nSupportPilot AI Team',
    category: 'resolution',
    lastUsed: '2026-07-03T11:00:00Z'
  },
  {
    id: 'et2',
    name: 'Escalation to L2 Engineers',
    subject: 'ALERT: Urgent Ticket [Ticket ID] escalated',
    body: 'Hello Team,\n\nThe ticket regarding [Subject] has been escalated to Engineering L2. Please review logs and SLA details here: [Ticket Link].\n\nSeverity: [Severity]\nSLA Target: [SLA]',
    category: 'escalation',
    lastUsed: '2026-07-03T09:45:00Z'
  }
];

export const mockEmailLogs: EmailLog[] = [
  {
    id: 'el1',
    to: 'david.chen@stripe.com',
    subject: 'SupportPilot: Your ticket SP-1042 has been updated',
    status: 'sent',
    sentAt: '2026-07-03T10:16:00Z',
    template: 'Ticket Updated Notification'
  },
  {
    id: 'el2',
    to: 'sarah.j@hashicorp.com',
    subject: 'SupportPilot: Your ticket SP-1041 is escalated to L2',
    status: 'sent',
    sentAt: '2026-07-03T09:46:00Z',
    template: 'Escalation to L2 Engineers'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'new_ticket',
    title: 'New High Priority Ticket',
    message: 'Ticket SP-1042 regarding Billing has been submitted by david.chen@stripe.com.',
    timestamp: '2026-07-03T10:00:00Z',
    read: false,
    ticketId: '1'
  },
  {
    id: 'n2',
    type: 'escalation',
    title: 'Ticket Escalated to Alex Rivera',
    message: 'SP-1041 has been escalated due to SLA warning limits.',
    timestamp: '2026-07-03T09:45:00Z',
    read: false,
    ticketId: '2'
  },
  {
    id: 'n3',
    type: 'jira_updated',
    title: 'Jira Issue Linked',
    message: 'ENG-3920 is now successfully linked to Ticket SP-1041.',
    timestamp: '2026-07-03T09:22:00Z',
    read: true,
    ticketId: '2'
  }
];
