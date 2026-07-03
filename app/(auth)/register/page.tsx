'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Terminal, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [dept, setDept] = useState('Support L1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
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
            Create Operator Profile
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Join the SupportPilot AI Ticket resolution platform
          </p>
        </div>

        {/* Register form card */}
        <div className="glass-card p-7 rounded-2xl border border-white/5 bg-slate-900/60 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Username / Profile Name</label>
              <input
                type="text"
                required
                placeholder="Emily Watson"
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
                placeholder="emily@supportpilot.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-slate-950 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Assigned Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-slate-950 px-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              >
                <option value="Support L1">Support L1</option>
                <option value="Finance">Finance / Billing</option>
                <option value="Engineering">Engineering</option>
                <option value="Security">Security Ops</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-slate-950 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              Register & Login <ArrowRight size={14} />
            </button>
          </form>

          {/* Social credentials guidelines */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
            <button 
              onClick={() => router.push('/login')} 
              className="flex items-center gap-1 hover:text-white text-zinc-500 font-medium"
            >
              <ArrowLeft size={12} /> Back to Login
            </button>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> SSO Enabled</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
