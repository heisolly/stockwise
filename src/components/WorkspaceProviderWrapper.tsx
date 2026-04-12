'use client';

import { useEffect, useState } from 'react';
import { WorkspaceProvider, getSubdomain } from '@/contexts/WorkspaceContext';

interface WorkspaceProviderWrapperProps {
  children: React.ReactNode;
}

export function WorkspaceProviderWrapper({ children }: WorkspaceProviderWrapperProps) {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    // Get subdomain from hostname only on client side
    const subdomainFromHost = getSubdomain();
    setSubdomain(subdomainFromHost);
  }, []);

  return (
    <WorkspaceProvider subdomain={subdomain || undefined}>
      {children}
    </WorkspaceProvider>
  );
}
