'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCw, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  Send,
  CornerDownLeft,
  ArrowRight,
  Database,
  Brain,
  FileCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Bot,
  ListRestart,
  FileInput,
  ScanEye,
  Settings,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PipelineStep {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  duration: string;
  log: string;
  icon: React.ElementType;
}

export default function AgentWorkflow() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pipeline steps matching screenshot & layout
  const [steps, setSteps] = useState<PipelineStep[]>([
    { 
      id: 'input', 
      name: 'Ticket Input', 
      status: 'completed', 
      duration: '0.1s', 
      log: '> Payload parsed successfully.',
      icon: FileInput 
    },
    { 
      id: 'diagnosis', 
      name: 'Diagnosis', 
      status: 'completed', 
      duration: '0.8s', 
      log: '> Intent: Refund Request.',
      icon: ScanEye 
    },
    { 
      id: 'rag', 
      name: 'Knowledge RAG', 
      status: 'completed', 
      duration: '1.5s', 
      log: '> 3 policy chunks retrieved.',
      icon: Database 
    },
    { 
      id: 'reasoning', 
      name: 'Reasoning', 
      status: 'running', 
      duration: '2.4s', 
      log: '> Evaluating refund constraints...',
      icon: Brain 
    },
    { 
      id: 'solution', 
      name: 'Solution', 
      status: 'idle', 
      duration: '1.1s', 
      log: '> Awaiting reasoning parameters...',
      icon: FileCheck 
    },
    { 
      id: 'validation', 
      name: 'Validation', 
      status: 'idle', 
      duration: '0.7s', 
      log: '> Awaiting compliance metrics...',
      icon: CheckCircle2 
    }
  ]);

  // Chat window state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'agent'; text: string }>>([
    {
      id: 'initial',
      sender: 'agent',
      text: 'Monitoring workflow... Reasoning agent is currently evaluating refund constraints based on user history.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAgentTyping]);

  // Pipeline simulation logic
  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStepIndex(0);

    // Reset all steps to idle except first
    setSteps(prev => prev.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'running' : 'idle',
      log: idx === 0 ? '> Processing incoming payload...' : '> Awaiting upstream data...'
    })));

    setChatMessages([
      {
        id: 'sim-start',
        sender: 'agent',
        text: 'Initializing execution monitoring for Ticket #SP-8942. Pipeline starting...'
      }
    ]);
  };

  useEffect(() => {
    if (!isRunning) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) {
      setIsRunning(false);
      toast.success('Resolution Pipeline execution completed successfully!');
      return;
    }

    // Determine simulation timings
    let runTime = 800; // default duration
    if (currentStep.id === 'input') runTime = 500;
    if (currentStep.id === 'diagnosis') runTime = 1000;
    if (currentStep.id === 'rag') runTime = 1500;
    if (currentStep.id === 'reasoning') runTime = 2000;
    if (currentStep.id === 'solution') runTime = 1200;
    if (currentStep.id === 'validation') runTime = 900;

    const timer = setTimeout(() => {
      // Complete current step
      setSteps(prev => prev.map((s, idx) => {
        if (idx === currentStepIndex) {
          let logText = '> Process completed.';
          if (s.id === 'input') logText = '> Payload parsed successfully.';
          if (s.id === 'diagnosis') logText = '> Intent: Refund Request.';
          if (s.id === 'rag') logText = '> 3 policy chunks retrieved.';
          if (s.id === 'reasoning') logText = '> Evaluating refund constraints based on user history.';
          if (s.id === 'solution') logText = '> Auto-response resolution template draft prepared.';
          if (s.id === 'validation') logText = '> Compliance checklist passed. Auto-resolve pre-approved.';
          return { ...s, status: 'completed', log: logText };
        }
        // Start next step
        if (idx === currentStepIndex + 1) {
          let logText = '> Running diagnostics...';
          if (s.id === 'diagnosis') logText = '> Scanning customer intent parameters...';
          if (s.id === 'rag') logText = '> Fetching vector database context...';
          if (s.id === 'reasoning') logText = '> Evaluating refund constraints...';
          if (s.id === 'solution') logText = '> Compiling resolution layout...';
          if (s.id === 'validation') logText = '> Running safety compliance validator...';
          return { ...s, status: 'running', log: logText };
        }
        return s;
      }));

      // Update chat prompt log
      let chatPromptText = '';
      if (currentStep.id === 'input') {
        chatPromptText = 'Ticket Input: Parsed webhook attributes. Initiating intent classification...';
      } else if (currentStep.id === 'diagnosis') {
        chatPromptText = 'Diagnosis Agent: Customer is requesting a refund. Routing context variables to RAG index search...';
      } else if (currentStep.id === 'rag') {
        chatPromptText = 'Knowledge RAG: Found 3 relevant policy documents. Reasoning agent will evaluate refund parameters...';
      } else if (currentStep.id === 'reasoning') {
        chatPromptText = 'Reasoning Agent: Formulating optimal solution structure. Validating limits...';
      } else if (currentStep.id === 'solution') {
        chatPromptText = 'Solution Agent: Response template drafted. Triggering validation checkpoints...';
      } else if (currentStep.id === 'validation') {
        chatPromptText = 'Validation Agent: Draft passed checklist. Workflow completed successfully. Dispatch pre-approved.';
      }

      setChatMessages(prev => [
        ...prev,
        { id: `step-${currentStepIndex}`, sender: 'agent', text: chatPromptText }
      ]);

      setCurrentStepIndex(prev => prev + 1);
    }, runTime);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex]);

  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: chatInput
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAgentTyping(true);

    // Simulate smart pipeline contextual responses
    setTimeout(() => {
      let replyText = "I'm monitoring the active Resolution Pipeline. Let me know if you would like me to explain any specific stage or trigger execution logs.";
      const query = chatInput.toLowerCase();

      if (query.includes('intent') || query.includes('diagnosis')) {
        replyText = "The Diagnosis Agent identified the customer's intent as a 'Refund Request' for their annual billing subscription discrepancy.";
      } else if (query.includes('rag') || query.includes('knowledge') || query.includes('policy')) {
        replyText = "The Knowledge RAG Agent queried our internal vector store and returned 3 articles, including 'Refunding Annual Subscription Fees' and 'Billing Adjustment Approvals Level 1'. These policies confirm that refunds within 14 days of purchase are pre-approved.";
      } else if (query.includes('reasoning') || query.includes('constraints')) {
        replyText = "The Reasoning Agent is currently cross-checking the customer account history. It confirmed this customer has no past billing disputes, making them eligible for the automatic resolution refund template.";
      } else if (query.includes('validation') || query.includes('rules')) {
        replyText = "The Validation Agent runs automated checklists to check for spelling errors, sensitive keys/secrets leaks, and validates that the solution code corresponds to a valid SLA template resolution pattern.";
      } else if (query.includes('ticket') || query.includes('sp-')) {
        replyText = "We are currently diagnosing Ticket #SP-8942: 'Requested annual billing reconciliation refund for duplicate invoices'.";
      }

      setChatMessages(prev => [
        ...prev,
        { id: `agent-reply-${Date.now()}`, sender: 'agent', text: replyText }
      ]);
      setIsAgentTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)] pb-24">
      {/* Top Header section matching user's image */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Resolution Pipeline</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Live execution monitoring for Ticket #SP-8942</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search bar matching screenshot */}
          <div className="relative flex-1 sm:w-64 max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workflow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>

          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary hover:bg-primary/95 text-xs font-semibold text-white transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isRunning ? (
              <>
                <RotateCw size={13} className="animate-spin" /> Simulating...
              </>
            ) : (
              <>
                <ListRestart size={13} /> Re-run Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {/* SEQUENTIAL PIPELINE ROW */}
      <div className="glass-card rounded-2xl border border-border/40 p-6 overflow-hidden glow-blue flex flex-col justify-center min-h-[300px]">
        {/* Horizontal scroll wrapper for steps timeline */}
        <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-border">
          <div className="flex items-center justify-between min-w-[1000px] px-4 relative">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = step.status === 'completed';
              const isRunningStep = step.status === 'running';
              const isIdle = step.status === 'idle';

              return (
                <React.Fragment key={step.id}>
                  {/* STEP CARD */}
                  <div 
                    className={`w-[220px] rounded-xl border p-4 bg-card/60 backdrop-blur-md transition-all relative shrink-0 ${
                      isRunningStep 
                        ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-primary/20 scale-[1.02]' 
                        : isCompleted 
                          ? 'border-border/60 bg-muted/10' 
                          : 'border-border/30 opacity-60'
                    }`}
                  >
                    {/* Top status & metadata info */}
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-1.5 rounded-lg border ${
                          isRunningStep 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : isCompleted 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                              : 'bg-muted text-muted-foreground border-border/40'
                        }`}>
                          <StepIcon size={14} className={isRunningStep ? "animate-pulse" : ""} />
                        </div>
                        <span className="text-xs font-bold text-foreground truncate block max-w-[100px]">{step.name}</span>
                      </div>
                      
                      {/* Done or Running indicator tag */}
                      {isCompleted ? (
                        <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                          <CheckCircle size={8} /> Done
                        </span>
                      ) : isRunningStep ? (
                        <span className="text-[8px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 animate-pulse">
                          <RotateCw size={8} className="animate-spin" /> Active
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold text-zinc-500 bg-zinc-500/10 border border-border px-1.5 py-0.5 rounded shrink-0">
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Progress visual bar with duration */}
                    <div className="space-y-1 my-3">
                      <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground">
                        <span>Duration</span>
                        <span>{step.duration}</span>
                      </div>
                      
                      <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            isCompleted ? 'bg-primary w-full' : isRunningStep ? 'bg-primary animate-pulse' : 'w-0'
                          }`}
                          style={{ width: isRunningStep ? '50%' : undefined }}
                        />
                      </div>
                    </div>

                    {/* Compact terminal log terminal text box */}
                    <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-border/30 font-mono text-[9px] text-zinc-300 h-14 overflow-hidden mt-2">
                      <p className="leading-snug text-foreground">
                        {step.log}
                      </p>
                    </div>
                  </div>

                  {/* PIPELINE CONNECTOR LINE (shown between steps) */}
                  {idx < steps.length - 1 && (
                    <div className="flex-1 px-2 shrink-0 flex justify-center items-center">
                      {isCompleted ? (
                        <div className="h-[2px] w-full bg-primary" />
                      ) : isRunningStep ? (
                        <div className="h-[2px] w-full bg-gradient-to-r from-primary to-border/40 relative overflow-hidden">
                          <span className="absolute inset-0 bg-primary/40 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-full flex justify-between gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} className="h-[2px] w-1 bg-border/40 shrink-0" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* CENTRAL CHAT WIDGET */}
      <div className="flex justify-center w-full pt-4">
        <div className="w-full max-w-2xl">
          <div className="glass-card rounded-2xl border border-border/80 bg-card/90 shadow-2xl p-4 space-y-3 relative glow-blue flex flex-col h-[350px] justify-between">
            
            {/* Header info */}
            <div className="flex justify-between items-center pb-2 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                  Execution Monitor
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground">Ticket #SP-8942</span>
            </div>

            {/* Messages lists scrollable area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 min-h-0 select-text">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`p-3 rounded-2xl text-[11px] max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-muted/40 text-foreground border border-border/40 rounded-tl-none font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {isAgentTyping && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 text-xs w-16">
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Interactive Query Input Bar */}
            <form onSubmit={handleChatSubmit} className="pt-2 border-t border-border/40 shrink-0 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about this execution..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 h-8 rounded-lg border border-border bg-background px-3 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium"
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-sm active:scale-95 shrink-0"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
