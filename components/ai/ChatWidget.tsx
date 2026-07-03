'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  CornerDownLeft,
  ArrowRight
} from 'lucide-react';
import { ChatMessage } from '@/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hello! I am SupportPilot AI copilot. How can I assist you with ticket resolution operations today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'How do I resolve Stripe invoice 500 errors?',
    'What is our SLA resolution rate this week?',
    'Can I sync engineering issues to Jira?'
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on questions
    setTimeout(() => {
      let content = "I've scanned our knowledge bases but couldn't find a direct answer. Let me know if you would like to escalate this request.";
      let sources: string[] = [];

      if (text.toLowerCase().includes('stripe') || text.toLowerCase().includes('500')) {
        content = `To resolve Stripe invoice 500 errors, execute these steps:
\`\`\`bash
# 1. Reset the Stripe metadata gateway link
curl -X POST https://api.supportpilot.io/v1/billing/reset-sync \\
  -H "Authorization: Bearer <API_KEY>"
\`\`\`
2. Instruct the user to clear their browser storage or access the dashboard in an Incognito window.`;
        sources = ['KB-2931: Fixing 500 Errors on Invoice Downloads'];
      } else if (text.toLowerCase().includes('sla') || text.toLowerCase().includes('resolution')) {
        content = "Our current SLA resolution rate is **78.4%** across all departments. The engineering team has resolved 120 critical tickets, with an average response threshold of 4.2 minutes.";
        sources = ['Q3 SLA Performance Audit Report'];
      } else if (text.toLowerCase().includes('jira') || text.toLowerCase().includes('sync')) {
        content = "Yes! You can link any incoming ticket directly to Jira under the Integrations dashboard. Once linked, the sync status is updated in real-time.";
        sources = ['Jira Integration API Setup Guide'];
      }

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        sources: sources.length > 0 ? sources : undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-lg cursor-pointer glow-blue relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-16 right-0 w-80 sm:w-[360px] h-[500px] rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col glow-blue"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">SupportPilot AI Assistant</h4>
                  <span className="text-[9px] text-muted-foreground">Always active to resolve queries</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                <X size={14} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                const hasCodeBlock = msg.content.includes('```');

                return (
                  <div key={msg.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                    <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                      isAssistant 
                        ? 'bg-muted/40 text-foreground rounded-tl-sm border border-border/40' 
                        : 'bg-primary text-white rounded-tr-sm'
                    }`}>
                      {hasCodeBlock ? (
                        <div className="space-y-2">
                          <p>{msg.content.split('```')[0]}</p>
                          <div className="bg-zinc-950 p-2 rounded-lg font-mono text-[10px] text-zinc-300 relative border border-zinc-900 mt-1">
                            <button
                              onClick={() => handleCopyCode(msg.content.split('```')[1]?.split('```')[0] || '', msg.id)}
                              className="absolute top-2 right-2 p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            >
                              {copiedId === msg.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                            </button>
                            <pre className="overflow-x-auto">{msg.content.split('```')[1]?.split('```')[0] || ''}</pre>
                          </div>
                          <p>{msg.content.split('```')[2]}</p>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}

                      {/* Source indicators */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 pt-1 border-t border-border/40 text-[9px] text-muted-foreground">
                          <span className="font-semibold text-primary block uppercase mb-0.5">RAG Sources:</span>
                          {msg.sources.map((src, i) => (
                            <span key={i} className="block hover:underline truncate">
                              • {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] text-muted-foreground/60 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 text-xs w-20">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts list (if assistant is waiting for queries) */}
            {messages.length === 1 && (
              <div className="p-3 bg-muted/10 border-t border-border/40 shrink-0 space-y-2">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Suggested Questions</span>
                <div className="flex flex-col gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] text-left p-2 rounded-lg border border-border/40 bg-card hover:bg-muted/50 text-foreground transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{q}</span>
                      <ArrowRight size={10} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-border/40 shrink-0 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputValue);
                }}
                className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="p-2 rounded-lg bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-sm"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
