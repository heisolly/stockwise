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
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-y-0 left-0 z-50 bg-white border-r border-neutral-200/80 overflow-hidden flex flex-col shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)]"
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="h-[68px] flex items-center px-5 border-b border-neutral-100/80 shrink-0">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm shadow-primary-500/20">
                  <Package className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-[15px] font-semibold text-neutral-900 font-primary leading-tight tracking-tight">StockWise</h1>
                </div>
                {!isMobile && (
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full flex items-center justify-between">
                <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm shadow-primary-500/20">
                  <Package className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                </div>
                {!isMobile && (
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-thin">
            <div className="mb-2 px-3">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.15em] font-primary">Menu</p>
            </div>
            {filteredNavigation.map((item) => {
              const isActive = currentActiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    currentSetActiveTab(item.id as NavigationTab);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 rounded-xl transition-all duration-200 group ${
                    sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon 
                    className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'
                    }`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!sidebarCollapsed && (
                    <span className={`text-[13px] font-medium font-secondary tracking-tight ${isActive ? 'text-white' : ''}`}>
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-neutral-100/80 shrink-0">
            {!sidebarCollapsed ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 text-sm font-semibold shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-neutral-900 font-primary truncate leading-tight">{user?.name}</p>
                    <p className="text-[11px] text-neutral-400 font-secondary truncate" title={user?.email}>{user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-[12px] font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col min-h-screen overflow-hidden"
        style={{ 
          marginLeft: !isMobile && sidebarOpen ? (sidebarCollapsed ? 80 : 250) : 0,
          transition: 'margin-left 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Header */}
        <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 sticky top-0 z-30 px-5 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-500 transition-all"
            >
              <Menu className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.15em] font-primary">
                {currentActiveTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-5">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3" strokeWidth={2} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-9 pl-9 pr-4 text-[13px] font-secondary bg-neutral-50 border border-neutral-200/60 rounded-xl text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/10 w-56 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-neutral-100 rounded-xl text-neutral-500 transition-all">
              <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Business Info */}
            <div className="flex items-center gap-3 pl-3 sm:pl-5 border-l border-neutral-200/60">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold text-neutral-900 leading-none font-primary">{businessProfile?.name}</p>
                <p className="text-[10px] font-medium text-emerald-600 uppercase mt-1 tracking-wide font-secondary">Verified</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm shadow-primary-500/20">
                {businessProfile?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={currentActiveTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
