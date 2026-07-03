'use client';

import React, { useState } from 'react';
import { mockKnowledgeBase } from '@/lib/mock-data';
import { KnowledgeArticle } from '@/types';
import { 
  Search, 
  BookOpen, 
  Brain, 
  Copy, 
  Check, 
  Filter, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle>(mockKnowledgeBase[0]);
  const [copied, setCopied] = useState(false);

  // Filters logic
  const filteredArticles = mockKnowledgeBase.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || art.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['all', 'Billing', 'Technical', 'Security'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-140px)] min-h-[500px]">
      {/* Left Column: Articles List (col-span-5) */}
      <div className="lg:col-span-5 flex flex-col h-full bg-card/30 rounded-xl border border-border/40 p-4 overflow-hidden">
        <div className="mb-4 space-y-3 shrink-0">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Knowledge Articles</h3>
            <p className="text-[11px] text-muted-foreground">Search and manage internal documentation guidelines</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by keywords, tags, or articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider capitalize border shrink-0 transition-all ${
                  categoryFilter === cat 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-background hover:bg-muted text-muted-foreground border-border/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No matching knowledge base articles found.
            </div>
          ) : (
            filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  setSelectedArticle(art);
                  setCopied(false);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center group ${
                  selectedArticle.id === art.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/40 hover:bg-muted/30'
                }`}
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">
                    {art.category}
                  </span>
                  <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {art.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                    <span>{art.views} views</span>
                    <span>•</span>
                    <span>{art.helpful}% helpful</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: AI Generated Solution & Details (col-span-7) */}
      <div className="lg:col-span-7 flex flex-col h-full bg-card/30 rounded-xl border border-border/40 p-5 overflow-hidden justify-between">
        <AnimatePresence mode="wait">
          {selectedArticle ? (
            <motion.div
              key={selectedArticle.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-5">
                {/* Article header */}
                <div className="border-b border-border/40 pb-4 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground leading-snug">{selectedArticle.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Last Updated: {new Date(selectedArticle.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-muted-foreground font-semibold">RAG Match Confidence</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {selectedArticle.confidence}% Match
                    </span>
                  </div>
                </div>

                {/* AI Solution Panel */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Brain size={14} className="animate-pulse" /> AI Resolution Guide
                    </h4>
                    <button
                      onClick={() => handleCopy(selectedArticle.content)}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground border border-border px-2 py-1 rounded-lg bg-background"
                    >
                      {copied ? (
                        <>
                          <Check size={11} className="text-emerald-500" /> Copied Draft
                        </>
                      ) : (
                        <>
                          <Copy size={11} /> Copy Blueprint
                        </>
                      )}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 rounded-xl border border-border bg-background text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedArticle.content}
                  </div>
                </div>

                {/* Step by step instructions summary */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={13} /> Step-by-step Action Checklist
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                      <p className="text-muted-foreground pt-0.5">Diagnose parameters triggers logs for cached user keys errors.</p>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                      <p className="text-muted-foreground pt-0.5">Invoke reset sync hooks or guide customer to utilize Private storage tabs.</p>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                      <p className="text-muted-foreground pt-0.5">Check downstream logs stats to guarantee a 200 HTTP response boundary.</p>
                    </div>
                  </div>
                </div>

                {/* Related Documents links */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <FileText size={13} /> Associated Vector Documents
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-[9px] font-mono text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-0.5 rounded-full border cursor-pointer capitalize"
                      >
                        doc-{tag}-guide.pdf
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-xs">
              Select an article from the list to view RAG solutions.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
