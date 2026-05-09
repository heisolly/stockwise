'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchCurrentUser } from '@/store/slices/authSlice';
import { onAuthStateChange } from '@/lib/supabase';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AppPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
    const { data: { subscription } } = onAuthStateChange(async (_event, session) => {
      if (session?.user) dispatch(fetchCurrentUser());
    });
    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <AuthGuard>
      <AppLayout>
        <div />
      </AppLayout>
    </AuthGuard>
  );
}
