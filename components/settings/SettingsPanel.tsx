'use client';

import React, { useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  Cpu, 
  Globe, 
  Check, 
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPanel() {
  const { user, updateUser } = useAuthStore();
  const { currentTheme, setTheme } = useUIStore();
  const [model, setModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('sp_live_948f2jK910dja9201Lskdj12');
  const [showKey, setShowKey] = useState(false);
  
  // Controlled form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        updateUser({ avatar: event.target.result });
        toast.success('Profile picture updated successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-card p-4 rounded-xl border border-border/40">
        <h3 className="text-sm font-semibold tracking-tight">System Settings</h3>
        <p className="text-[11px] text-muted-foreground">Manage profile, configure API access credentials, and adjust AI models thresholds</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Profile Details */}
        <div className="glass-card p-5 rounded-xl border border-border/40 space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
            <User size={14} className="text-primary" /> Profile Settings
          </h4>
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                alt="Avatar" 
                className="h-20 w-20 rounded-full border border-border object-cover bg-muted cursor-pointer hover:opacity-80 transition-all duration-200"
                onClick={handleAvatarClick}
              />
              <button
                type="button"
                onClick={handleAvatarClick}
                className="px-2.5 py-1 text-[10px] font-semibold text-primary hover:underline border border-primary/20 rounded bg-primary/5 active:scale-95 transition-transform shrink-0"
              >
                Choose Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full pt-1">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Username</span>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 focus:outline-none text-foreground font-semibold"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Email Address</span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 focus:outline-none text-foreground font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="glass-card p-5 rounded-xl border border-border/40 space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
            <Key size={14} className="text-primary" /> Access API Credentials
          </h4>
          <div className="space-y-2 text-xs">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Live Access Secret Token</span>
            <div className="relative">
              <input 
                type={showKey ? 'text' : 'password'} 
                readOnly
                value={apiKey} 
                className="w-full h-9 rounded-lg border border-border bg-background pl-3 pr-20 focus:outline-none text-foreground font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Utilize this secret key to log customer support tickets through API endpoints. Keep this safe.
            </p>
          </div>
        </div>

        {/* AI Model Optimization */}
        <div className="glass-card p-5 rounded-xl border border-border/40 space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
            <Cpu size={14} className="text-primary" /> AI Model Selection
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Select LLM Engine</span>
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-2.5 focus:outline-none text-foreground"
              >
                <option value="gpt-4o">OpenAI GPT-4o (Default Recommended)</option>
                <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
                <option value="gemini-1-5">Google Gemini 1.5 Pro</option>
                <option value="llama-3">Meta Llama 3 (Self-Hosted)</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Temperature Confidence (Bypass threshold)</span>
              <select className="w-full h-9 rounded-lg border border-border bg-background px-2.5 focus:outline-none text-foreground">
                <option value="0.2">0.2 - Highly Deterministic</option>
                <option value="0.5">0.5 - Balanced</option>
                <option value="0.8">0.8 - Creative</option>
              </select>
            </div>
          </div>
        </div>

        {/* Settings Buttons */}
        <div className="flex justify-end gap-2.5">
          <button 
            type="submit"
            className="px-4 py-2 bg-primary text-white font-semibold text-xs rounded-lg shadow hover:bg-primary/95 transition-all"
          >
            Save All Changes
          </button>
        </div>

      </form>
    </div>
  );
}
