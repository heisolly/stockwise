'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/store';
import { OnboardingFlow }  from './OnboardingFlow';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, businessProfile } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    console.log('AuthGuard state:', { isLoading, isAuthenticated, user: !!user, businessProfile: !!businessProfile });
    if (!isLoading && !isAuthenticated) {
      console.log('AuthGuard: Redirecting to login');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    console.log('AuthGuard: Loading...');
    return null;
  }
  if (!isAuthenticated || !user) {
    console.log('AuthGuard: Not authenticated, showing null');
    return null; // brief flash while redirecting
  }

  if (!businessProfile?.onboarded) {
    console.log('AuthGuard: Business not onboarded, showing OnboardingFlow');
    return <OnboardingFlow />;
  }

  console.log('AuthGuard: Rendering children');
  return <>{children}</>;
}
