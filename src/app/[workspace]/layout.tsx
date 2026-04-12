'use client';

import { ReactNode } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { workspace, isLoading, error } = useWorkspace();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!workspace || error)) {
      // Redirect to main site if workspace doesn't exist
      router.push('/');
    }
  }, [workspace, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Workspace Not Found</h1>
          <p className="text-neutral-500">This workspace doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
