'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchBusinessProfile } from '@/store/slices/authSlice';

interface Workspace {
  id: string;
  name: string;
  subdomain: string;
  ownerName: string;
  currency: string;
  settings: {
    allowStaffInvites: boolean;
    requireApprovalForStaff: boolean;
  };
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  isOwner: boolean;
  isStaff: boolean;
  refreshWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

interface WorkspaceProviderProps {
  children: ReactNode;
  subdomain?: string;
}

export function WorkspaceProvider({ children, subdomain }: WorkspaceProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, businessProfile, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.role === 'owner' || user?.role === 'OWNER';
  const isStaff = user?.role === 'employee' || user?.role === 'EMPLOYEE';

  const refreshWorkspace = async () => {
    if (!isAuthenticated || !subdomain) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch business profile for the subdomain
      await dispatch(fetchBusinessProfile()).unwrap();
      
      if (businessProfile) {
        const workspaceData: Workspace = {
          id: businessProfile.id,
          name: businessProfile.name,
          subdomain: subdomain,
          ownerName: businessProfile.ownerName || '',
          currency: businessProfile.currency || '₦',
          settings: {
            allowStaffInvites: businessProfile.settings?.allowStaffInvites ?? true,
            requireApprovalForStaff: businessProfile.settings?.requireApprovalForStaff ?? false,
          },
        };
        
        setWorkspace(workspaceData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspace');
      console.error('Workspace loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWorkspace();
  }, [isAuthenticated, subdomain, dispatch]);

  const value: WorkspaceContextType = {
    workspace,
    isLoading,
    error,
    isOwner,
    isStaff,
    refreshWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// Utility function to extract subdomain from current hostname
export function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // If we have more than 2 parts (e.g., olly.stockwise.com), the first part is the subdomain
  if (parts.length > 2 && parts[parts.length - 2] === 'stockwise' && parts[parts.length - 1] === 'com') {
    return parts[0];
  }
  
  return null;
}
