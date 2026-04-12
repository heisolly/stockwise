'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings, 
  Brain, 
  CreditCard,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { NavigationTab, UserRole } from '@/types';
import { CURRENCY, APP_CONFIG } from '@/constants';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  role: UserRole;
  businessName: string;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, role, businessName, onLogout }: SidebarProps) {
  const isOwner = role === UserRole.OWNER;

  const navigationItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: [UserRole.OWNER, UserRole.EMPLOYEE],
    },
    {
      id: 'inventory' as NavigationTab,
      label: 'Inventory',
      icon: Package,
      roles: [UserRole.OWNER, UserRole.EMPLOYEE],
    },
    {
      id: 'sales' as NavigationTab,
      label: 'Sales POS',
      icon: ShoppingCart,
      roles: [UserRole.OWNER],
    },
    {
      id: 'reports' as NavigationTab,
      label: 'Reports',
      icon: BarChart3,
      roles: [UserRole.OWNER],
    },
    {
      id: 'staff' as NavigationTab,
      label: 'Staff',
      icon: Users,
      roles: [UserRole.OWNER],
    },
    {
      id: 'ai-insights' as NavigationTab,
      label: 'AI Insights',
      icon: Brain,
      roles: [UserRole.OWNER],
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
      roles: [UserRole.OWNER],
    },
    {
      id: 'subscription' as NavigationTab,
      label: 'Subscription',
      icon: CreditCard,
      roles: [UserRole.OWNER],
    },
  ];

  const filteredItems = navigationItems.filter(item => item.roles.includes(role));

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-black text-lg shadow-strong">
            S
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 font-outfit">
              {APP_CONFIG.NAME}
            </h1>
            <p className="text-xs text-slate-500 font-varela truncate">
              {businessName}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} />
              <span className="font-outfit">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Balance</span>
            <span className="text-xs font-semibold text-primary-600">
              {CURRENCY}0.00
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {isOwner ? 'Owner Account' : 'Employee Account'}
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span className="font-outfit">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
