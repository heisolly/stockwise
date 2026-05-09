'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RootState } from '@/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, businessProfile } = useSelector(
    (state: RootState) => state.auth
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoading || !mounted) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (businessProfile && !businessProfile.onboarded) {
      router.replace('/setup');
      return;
    }
  }, [isLoading, isAuthenticated, businessProfile, mounted, router]);

  // Don't render anything until we know the auth + onboarding state
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#004838]/30 border-t-[#004838] rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Block rendering if not onboarded (prevent dashboard flash)
  if (businessProfile && !businessProfile.onboarded) {
    return null;
  }

  return <>{children}</>;
}
