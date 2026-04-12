'use client';

import { TrendingUp, Package, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const metrics = [
  { label: "Today's Revenue",  value: '₦184,500', sub: '+12.4% vs yesterday', up: true,  icon: TrendingUp, color: 'text-blue-500'    },
  { label: 'Items in Stock',   value: '2,847',     sub: '23 low stock alerts', up: false, icon: Package,    color: 'text-orange-500'  },
  { label: 'Sales Today',      value: '138',        sub: '+8 in last hour',     up: true,  icon: ShoppingCart,color: 'text-emerald-500'},
];

const barHeights = [40, 65, 50, 80, 60, 95, 70, 85, 55, 75, 90, 68];

export function DashboardPreview() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-600 tracking-widest uppercase mb-5">
            Dashboard
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black text-gray-900 leading-tight tracking-tight">
            Everything at a glance
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            A beautiful command center showing your business health — updated in real-time.
          </p>
        </div>

        {/* Browser chrome mock */}
        <div className="max-w-5xl mx-auto rounded-md overflow-hidden shadow-2xl border border-gray-200 bg-white">

          {/* Browser top bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-100 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-400"  />
            <div className="w-3 h-3 rounded-full bg-yellow-400"/>
            <div className="w-3 h-3 rounded-full bg-green-400"/>
            <div className="flex-1 mx-4 bg-white rounded-md px-4 py-1 text-xs text-gray-400 text-center border border-gray-200">
              app.stockwise.ng/dashboard
            </div>
          </div>

          {/* App content */}
          <div className="p-6 bg-[#F8FAFF]">

            {/* Welcome */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Good morning, Ade 👋</h3>
              <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with Ade&apos;s Store today.</p>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{m.label}</p>
                      <div className={`w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center`}>
                        <Icon size={15} className={m.color} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 mb-1">{m.value}</p>
                    <div className="flex items-center gap-1">
                      {m.up
                        ? <ArrowUpRight size={12} className="text-emerald-500" />
                        : <ArrowDownRight size={12} className="text-orange-500" />}
                      <span className={`text-xs font-semibold ${m.up ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {m.sub}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-md p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Revenue Overview</p>
                  <p className="text-xs text-gray-400">Last 12 days</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-md">This Month</span>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-1.5 h-28">
                {barHeights.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ${
                        i === barHeights.indexOf(Math.max(...barHeights))
                          ? 'bg-blue-500'
                          : 'bg-blue-100 hover:bg-blue-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
