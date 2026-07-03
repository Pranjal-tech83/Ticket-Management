'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { activeTab } = useUIStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-medium">Redirecting...</span>
      </div>
    </div>
  );
}
