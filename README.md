# TicketNova 🚀 — AI Ticket Resolution Platform

An enterprise-ready, high-fidelity Single Page Application (SPA) dashboard showcasing automated incident triage, AI-driven ticket resolution, telemetry analytics, interactive diagnostics, and customer outreach orchestration.

TicketNova is built with premium UI designs, responsive custom styling, and live-updating interactive frontend components.

---

## 📂 Repository Structure

The project is organized cleanly with zero third-party framework dependencies, running completely in-browser:

```
Ticket-Management/
├── .github/
│   └── workflows/
│       └── static.yml         # GitHub Actions workflow for deploying to Pages
├── css/
│   └── styles.css             # Main stylesheet (Themes, CSS Grid/Flexbox layouts, glassmorphism)
├── js/
│   ├── app.js                 # Master orchestrator, Router, Theme Engine, and UI components switcher
│   ├── data.js                # Mock database layer (Tickets, KB Articles, Categories, Users, etc.)
│   ├── tickets.js             # Incidents Workspace (Table management, Filters, Details Drawer, Creation Modal)
│   ├── assistant.js           # AI Assistant chat module with interactive diagnostic capabilities
│   ├── knowledge.js           # Knowledge Base manager (Search, Article generation, AI summarization)
│   ├── workflow.js            # Resolution pipeline visualizer (Triage, Analysis, Verification, Resolving)
│   ├── analytics.js           # Telemetry metrics aggregator (SLA trackers, CSS-based live graphs)
│   ├── email.js               # Integrated inbox simulator (Templated email replies, outbound triage)
│   └── settings.js            # User profile editor, system configurations, and dark/light themes
├── index.html                 # Main application structure containing all SPA views
└── README.md                  # Documentation (This file)
```

---

## ✨ Key Features & Capability Modules

### 1. 📊 Platform Overview (Dashboard View)
*   **KPI Telemetry Cards**: Displays real-time metrics for Total Tickets, Open Issues, Resolved Issues, and AI Resolution Rate with week-over-week trends.
*   **Interactive Live SLA Chart**: Custom CSS bar chart visualising weekly AI Resolution SLA performance with responsive height fills.
*   **Quick Action Shortcuts**: Quick paths to generate new tickets, execute assistant chat commands, and run workflows.
*   **Recent System Activity**: Real-time ticker displaying the 5 latest system actions, with rows linking directly to ticket workspace details.

### 2. 🎫 Incidents Workspace (Tickets View)
*   **Multi-Column Sorting & Searching**: Dynamic search filtering by ticket ID, reporter name, or subject line. Column header sorting by ID, reporter, subject, department, priority, or status.
*   **Granular Filters**: Interactive dropdown menus to narrow down records by Department, Severity/Priority, and Ticket Status.
*   **Details Inspect Drawer**: Side drawer pulling out metadata, attachments, chronological escalation history, resolution timelines, and automated AI suggestions (Suggested Priority, Department, and Resolution guides).
*   **Resolution Actions**: Triage actions to Resolve, Escalate, or Assign tickets directly inside the drawer.
*   **Mock Export Utility**: One-click download tool for CSV report generation.

### 3. 💬 Diagnostics Copilot (AI Assistant View)
*   **Custom Prompting Playground**: Interactive chatbot interface initialized with platform telemetry context.
*   **Diagnostic Templates**: Quick-select templates matching live tickets for automated query diagnostics.
*   **Contextual Responses**: Simulates natural responses based on selected active tickets.

### 4. 📚 Knowledge Base
*   **Searchable Directory**: Retrieve reference material for authentication protocols, payment configuration, webhook configurations, and database replicas.
*   **AI Enhancement Tool**: Click "AI Summarize" on articles to compile them into actionable troubleshooting guides.
*   **Article Composer**: Write and publish new articles immediately.

### 5. ⚙️ Agent workflow Simulator (Workflow View)
*   **Live Pipeline Pipeline Tracking**: Visualizes resolution flows divided into four sequential stages: **Triage**, **Analysis**, **Verification**, and **Resolution**.
*   **Real-Time Simulation**: Interactive triggers to advance tickets step-by-step through the automated resolution sequence.

### 6. 📈 Detailed Metrics (Analytics View)
*   **Resolution Breakdown**: Displays priority distributions (Urgent, High, Medium, Low) and department metrics (Customer Support, Engineering, Billing).
*   **Time-to-Resolve Telemetry**: Summarizes Average First Response Time (SLA) and Average Close Time metrics.

### 7. 📬 Outbox Orchestrator (Email Automation View)
*   **Email Queue Manager**: Lists automated notification emails generated when tickets update.
*   **Template Composer**: Pick from canned notification templates (Ticket Received, Investigation, Resolution Confirmed).
*   **Send Reply Simulator**: Compose and dispatch customer emails directly from the dashboard.

### 8. 🛠️ Control Panel (Settings View)
*   **Profile Customizer**: Edit name, avatar background color, and avatar image. Updates sidebar and navbar profiles in real-time.
*   **Appearance**: Switch between Light Mode and Dark Mode.
*   **System Rules**: Modify confidence thresholds, SLA alert levels, and auto-escalation criteria.

---

## 🎨 Styling & Design Aesthetics

TicketNova features premium web design standards:
*   **Variable Theme Scoping**: CSS custom properties (`--accent-primary`, `--bg-surface`, etc.) to control light/dark palettes seamlessly.
*   **Premium Typography**: Uses modern fonts, clean letter-spacing, and clear font weights.
*   **Smooth Micro-Animations**: Interactivity supported by transition effects on buttons, sidebar collapsibility, active routes, drawer animations, and toast notification popups.
*   **Glassmorphic Overlays**: Modern backdrop blur aesthetics on dialogs and action components.

---

## 🚀 Getting Started

Since TicketNova is fully implemented client-side with native HTML5, CSS3, and ES6+ modules, it requires **zero local backend setup or packages**:

### Local Execution
1. Clone the repository to your local machine.
2. Double-click the `index.html` file or run it via a local development server (e.g., Live Server extension in VS Code).
3. Sign in using the default mock credentials pre-filled on the login screen.

### Continuous Deployment
This repository is configured with a GitHub Actions workflow (`static.yml`) under `.github/workflows/`.
Every push to the default `master` branch will automatically build, upload, and deploy the latest build to **GitHub Pages**.
