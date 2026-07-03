import { type ClassValue, clsx } from "clsx"
import { any } from "zod";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'open':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'in_progress':
      return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    case 'resolved':
      return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    case 'escalated':
      return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'low':
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    case 'medium':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'high':
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'critical':
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
  }
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case 'S4':
      return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    case 'S3':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'S2':
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'S1':
      return 'bg-red-600/10 text-red-500 border border-red-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
  }
}
