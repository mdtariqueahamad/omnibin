import React from 'react';
import { Bell, Search, Shield, Eye } from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Fleet Real-Time Core',
  map: 'Expanded Cartography Matrix',
  routes: 'NetworkX Optimizer Sandbox',
  history: 'Telemetry Audit Logs',
};

const DashboardHeader = ({ bins = [], isAdmin, activeTab }) => {
  const criticalCount = bins.filter(b => (b.fill_percentage || 0) > 80).length;
  const hasCritical = criticalCount > 0;
  const title = TAB_TITLES[activeTab] || 'Dashboard';

  return (
    <div className="glass-header rounded-2xl px-5 py-3.5 mb-6 flex items-center justify-between gap-4" id="dashboard-header">
      {/* Left: Page title */}
      <div className="text-left min-w-0">
        <h1 className="text-lg font-black text-white tracking-tight truncate">{title}</h1>
        <p className="text-[11px] text-emerald-400/40 mt-0.5">Automated telemetry streams • Live ESP32 monitoring</p>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search bins, zones, reports..."
            className="glass-input !py-2 !pl-9 !pr-4 !text-xs !rounded-xl w-full"
            id="dashboard-search"
          />
        </div>
      </div>

      {/* Right: Notifications + Role */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl hover:bg-eco-forest/50 transition-all cursor-pointer group" id="notification-bell" aria-label="Notifications">
          <Bell className={`w-4.5 h-4.5 transition-colors ${hasCritical ? 'text-rose-400' : 'text-emerald-400/50 group-hover:text-emerald-300'}`} />
          {hasCritical && <span className="notification-dot" />}
          
          {/* Tooltip dropdown */}
          {hasCritical && (
            <div className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-xl p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 text-left">
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1.5">⚠ Critical Alert</p>
              <p className="text-xs text-emerald-200/70">
                <span className="font-bold text-white">{criticalCount}</span> bin{criticalCount > 1 ? 's' : ''} exceeded 80% fill capacity and require{criticalCount === 1 ? 's' : ''} immediate dispatch.
              </p>
            </div>
          )}
        </button>

        {/* Role Badge */}
        {isAdmin ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-eco-emerald/10 border border-eco-emerald/20 text-[10px] font-bold text-eco-emerald uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Admin</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Guest</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
