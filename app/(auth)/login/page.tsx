'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Terminal, Brain, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('roman838303@gmail.com');
  const [name, setName] = useState('Pranjal Kumar');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, name);
    router.push('/dashboard');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#090d16] text-white overflow-hidden relative px-4">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and branding title */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg glow-blue mb-3">
            <Terminal size={24} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Welcome to SupportPilot
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Enterprise AI Ticket Resolution & RAG Diagnostics Co-pilot
          </p>
        </div>

        {/* Login form card */}
        <div className="glass-card p-7 rounded-2xl border border-white/5 bg-slate-900/60 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Username / Profile Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-slate-950 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-slate-950 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-slate-950 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              Sign In to Workspace <ArrowRight size={14} />
            </button>
          </form>

          {/* Social credentials guidelines */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> SSO Verified</span>
            <span className="cursor-pointer hover:text-white" onClick={() => router.push('/register')}>Create New Profile</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-zinc-500 mt-6">
          By signing in, you agree to our Terms of Service and security rules.
        </p>
      </motion.div>
    </div>
  );
}
