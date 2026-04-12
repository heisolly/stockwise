'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { InventoryManager } from '@/components/inventory/InventoryManager';
import { StaffManager } from '@/components/staff/StaffManager';
import { useState } from 'react';
import { Package, Users, BarChart3, Settings } from 'lucide-react';

type WorkspaceTab = 'dashboard' | 'inventory' | 'staff' | 'settings';

export default function WorkspaceDashboard() {
  const { workspace, isOwner, isStaff } = useWorkspace();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');

  // Wrapper function to handle type conversion
  const handleSetActiveTab = (tab: string) => {
    if (['dashboard', 'inventory', 'staff', 'settings'].includes(tab)) {
      setActiveTab(tab as WorkspaceTab);
    }
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory', icon: Package },
    ...(isOwner ? [{ id: 'staff', name: 'Staff', icon: Users }] : []),
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryManager />;
      case 'staff':
        return isOwner ? <StaffManager /> : <div>Access Denied</div>;
      case 'settings':
        return <div>Settings coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AppLayout activeTab={activeTab} setActiveTab={handleSetActiveTab} navigation={navigation}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 font-primary">
            {workspace.name}
          </h1>
          <p className="text-neutral-500 font-secondary">
            {isOwner ? 'Owner Dashboard' : 'Staff Dashboard'}
          </p>
        </div>
        {renderContent()}
      </div>
    </AppLayout>
  );
}
