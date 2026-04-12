'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WorkspacePage() {
  const { workspace, isLoading } = useWorkspace();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && workspace) {
      // Redirect to dashboard
      router.push(`/${workspace.subdomain}/dashboard`);
    }
  }, [workspace, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  );
}
