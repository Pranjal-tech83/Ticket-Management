'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card p-5 rounded-xl flex flex-col justify-between min-h-[120px] transition-colors relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 p-6 bg-primary/5 rounded-full shrink-0 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon size={16} />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-2 mb-1">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold tracking-tight"
          >
            {value}
          </motion.span>
          {trend && (
            <span className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-emerald-500/10 text-emerald-500" 
                : "bg-rose-500/10 text-rose-500"
            )}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-1">{description}</p>
      </div>
    </motion.div>
  );
}
