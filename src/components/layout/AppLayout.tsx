'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings, 
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '@/store/slices/authSlice';
import { fetchProducts, fetchActivityLogs } from '@/store/slices/inventorySlice';
import { fetchSales, fetchExpenses } from '@/store/slices/salesSlice';
import { UserRole, NavigationTab } from '@/types';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Helper function for media queries
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

// Component imports
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SimpleDashboard } from '@/components/dashboard/SimpleDashboard';
import { StaffDashboard } from '@/components/dashboard/StaffDashboard';
import { InventoryManager } from '@/components/inventory/InventoryManager';
import { SalesPOS } from '@/components/sales/SalesPOS';
import { ReportsView } from '@/components/reports/ReportsView';
import { StaffManager } from '@/components/staff/StaffManager';
import { Settings as SettingsComponent } from '@/components/settings/Settings';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  navigation?: Array<{
    id: string;
    name: string;
    icon: any;
  }>;
}

export function AppLayout({ 
  children, 
  activeTab: externalActiveTab, 
  setActiveTab: externalSetActiveTab,
  navigation: externalNavigation 
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState<NavigationTab>('dashboard');
  const { user, businessProfile } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const mediaQuery = useMediaQuery('(max-width: 768px)');

  console.log('AppLayout: Rendering with user:', !!user, 'businessProfile:', !!businessProfile);

  // Use external navigation if provided, otherwise use default
  const currentActiveTab = externalActiveTab || internalActiveTab;
  const currentSetActiveTab = externalSetActiveTab || setInternalActiveTab;

  const isOwner = user?.role === UserRole.OWNER;

  useEffect(() => {
    setIsMobile(mediaQuery);
    if (!mediaQuery) setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [mediaQuery, setSidebarOpen]);

  useEffect(() => {
    if (businessProfile?.id) {
      // Load initial data
      dispatch(fetchProducts(businessProfile.id));
      dispatch(fetchSales(businessProfile.id));
      dispatch(fetchExpenses(businessProfile.id));
      dispatch(fetchActivityLogs(businessProfile.id));

      // ── Realtime Subscriptions ──
      const channel = supabase
        .channel('db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products', filter: `business_id=eq.${businessProfile.id}` },
          () => dispatch(fetchProducts(businessProfile.id))
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sales', filter: `business_id=eq.${businessProfile.id}` },
          () => dispatch(fetchSales(businessProfile.id))
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'activity_logs', filter: `business_id=eq.${businessProfile.id}` },
          () => dispatch(fetchActivityLogs(businessProfile.id))
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [dispatch, businessProfile?.id]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Failed to logout');
    }
  };

  // Use external navigation if provided, otherwise use default
  const defaultNavigation: { id: NavigationTab; name: string; icon: any; roles: UserRole[] }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, roles: [UserRole.OWNER, UserRole.EMPLOYEE] },
    { id: 'inventory', name: 'Inventory', icon: Package, roles: [UserRole.OWNER, UserRole.EMPLOYEE] },
    { id: 'sales', name: 'Sales (POS)', icon: ShoppingCart, roles: [UserRole.OWNER, UserRole.EMPLOYEE] },
    { id: 'reports', name: 'Reports', icon: BarChart3, roles: [UserRole.OWNER] },
    { id: 'staff', name: 'Staff Management', icon: Users, roles: [UserRole.OWNER] },
    { id: 'settings', name: 'Settings', icon: Settings, roles: [UserRole.OWNER] },
  ];

  // Convert external navigation to internal format if provided
  const navigation = externalNavigation 
    ? externalNavigation.map(item => ({
        id: item.id as NavigationTab,
        name: item.name,
        icon: item.icon,
        roles: [UserRole.OWNER, UserRole.EMPLOYEE] // Allow all for external navigation
      }))
    : defaultNavigation;

  const filteredNavigation = navigation.filter(item => 
    user?.role ? item.roles.includes(user.role) : false
  );

  const renderContent = () => {
    // If external navigation is provided, render children directly
    if (externalNavigation) {
      return children;
    }
    
    // Otherwise use default routing logic
    switch (currentActiveTab) {
      case 'dashboard':
        return user?.role === UserRole.OWNER ? <SimpleDashboard /> : <StaffDashboard />;
      case 'inventory':
        return <InventoryManager />;
      case 'sales':
        return <SalesPOS />;
      case 'reports':
        return <ReportsView />;
      case 'staff':
        return <StaffManager />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return user?.role === UserRole.OWNER ? <SimpleDashboard /> : <StaffDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? (isMobile ? '280px' : sidebarCollapsed ? '80px' : '250px') : '0px',
          x: sidebarOpen ? 0 : (isMobile ? -280 : 0),
          opacity: sidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-neutral-200 overflow-hidden flex flex-col lg:shadow-sm`}
      >
        <div className="flex flex-col h-full">
          {/* Header with Toggle */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100">
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-neutral-900 font-primary">StockWise</h1>
                  <p className="text-xs text-neutral-500 font-secondary">Inventory Management</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-full flex justify-center">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            {!isMobile && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-6 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  currentSetActiveTab(item.id as NavigationTab);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-4' : 'px-6'} py-4 text-sm font-medium rounded-lg transition-colors ${
                  currentActiveTab === item.id
                    ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-500'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={`w-6 h-6 ${sidebarCollapsed ? '' : 'mr-6'} ${
                  currentActiveTab === item.id ? 'text-primary-600' : 'text-neutral-400'
                }`} />
                {!sidebarCollapsed && (
                  <span className="font-secondary">{item.name}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 border-t border-neutral-100">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 text-base font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-neutral-900 truncate font-primary">{user?.name}</p>
                    <p className="text-sm text-neutral-500 truncate font-secondary">{user?.email}</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 text-base font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-300 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-widest font-primary">{currentActiveTab.replace('-', ' ')}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="input-field pl-10 pr-4 text-sm w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent-lime rounded-full border-2 border-white"></span>
              </button>
            </div>

            {/* Business Info */}
            <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-neutral-300">
              <div className="text-right hidden xs:block">
                <p className="text-sm font-semibold text-neutral-900 leading-none font-primary">{businessProfile?.name}</p>
                <p className="text-[10px] font-bold text-accent-lime uppercase mt-1 tracking-tighter font-secondary">Verified Business</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                SW
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={currentActiveTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
