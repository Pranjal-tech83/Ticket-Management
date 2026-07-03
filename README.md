# SupportPilot – AI Ticket Resolution Agent

SupportPilot is a modern enterprise AI SaaS frontend built to orchestrate, diagnose, and resolve support requests with multi-agent workflows, vector-based RAG knowledge matches, Jira syncs, and email automation dispatchers.

## Tech Stack
- **Framework**: Next.js 15 (App Router, turbopack supported)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Chart Data**: Recharts
- **Forms**: React Hook Form
- **Tables**: TanStack Table
- **Styling**: Tailwind CSS, next-themes (Dark/Light)
- **Icon Library**: Lucide Icons
- **Toast Notifications**: React Hot Toast

## Project Features

1. **Dashboard View**
   - High-fidelity metrics stats cards detailing Total, Open, Resolved tickets, AI resolution rate, and weighted CSAT.
   - Interactive Recharts volume trends line charts and category distribution pie charts.
   - Quick command action buttons triggering ticket creators, RAG vector lookup indexes, or Jira pipelines.

2. **Tickets Table Grid & Drawer**
   - Full search filters, priority select categorizations, sorting attributes, pagination, and CSV exporter.
   - Click to slide-out details drawer containing full ticket content, timelines audit tracks, and AI suggested resolution draft templates.

3. **Multi-Agent Diagnostics Pipeline**
   - Beautiful visual agent workflow showing sequential runs of Diagnosis -> Knowledge -> Reasoning -> Solution -> Validation -> Escalation Agents.
   - Detailed terminal logs box detailing LLM output processes and completion time thresholds.

4. **Split Knowledge Base (RAG)**
   - Left side: searchable internal guidelines articles matching categories.
   - Right side: AI generated resolution draft, step-by-step checklists, RAG confidence match score gauges, and copying options.

5. **Jira & Email Integrations**
   - Sync backlogs, create linked developer issues, connect toggler.
   - Edit notification drafts, review email templates, audit delivery logs.

6. **Settings System**
   - Manage user profiles, copy developer API access keys, toggle dark/light theme, and select preferred LLM engine thresholds (GPT-4o, Claude 3.5).

## Getting Started

First, install the npm dependencies:
```bash
npm install
```

Second, spin up the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to preview the app!

## Standalone Preview
You can also open the custom static [index.html](./index.html) file directly in your browser for a quick overview of features without having to install dependencies!
