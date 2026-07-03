'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';

export default function SettingsPage() {
  const router = useRouter();
  const { setActiveTab } = useUIStore();

  useEffect(() => {
    setActiveTab('settings');
    router.push('/dashboard');
  }, [router, setActiveTab]);

  return null;
}
