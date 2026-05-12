import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Route, History, Settings, Leaf, Sparkles, LogOut, Eye } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isConnected, userRole, onLogout }) => {
  const navigate = useNavigate();
  const isAdmin = userRole === 'admin';

  const menuItems = [
    { id: 'dashboard', label: 'Live Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Interactive Telemetry Map', icon: MapPin },
    { id: 'routes', label: 'TSP Optimal Routings', icon: Route },
    { id: 'history', label: 'Historical Audit Logs', icon: History },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 glass-panel border-r border-emerald-500/10 flex flex-col h-screen sticky top-0 z-30 shrink-0">
      {/* Premium Brand Header */}
      <div className="p-6 border-b border-emerald-500/10 flex items-center gap-3.5">
        <div className="p-2.5 bg-gradient-to-br from-eco-emerald via-eco-teal to-eco-aqua rounded-xl shadow-lg shadow-emerald-500/15 eco-glow">
          <Leaf className="w-5 h-5 text-eco-deep stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
            OmniBin
          </h1>
          <p className="text-[11px] text-eco-emerald font-medium flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3" /> AI Route Engine v1
          </p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-6 pt-4">
        {isAdmin ? (
          <div className="px-3 py-1.5 rounded-lg bg-eco-emerald/10 border border-eco-emerald/20 flex items-center gap-2 text-[10px] font-bold text-eco-emerald uppercase tracking-wider">
            <Settings className="w-3 h-3" /> Admin Access
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <Eye className="w-3 h-3" /> Guest Read-Only
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <p className="px-3 text-[10px] font-semibold text-emerald-500/40 uppercase tracking-wider mb-2.5">
          Main Views
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                isActive
                  ? 'bg-eco-forest/80 text-white shadow-sm border border-eco-emerald/20 eco-glow'
                  : 'text-emerald-300/50 hover:text-emerald-200 hover:bg-eco-forest/40'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-eco-emerald' : 'text-emerald-500/40'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Connection Indicator Footer */}
      <div className="px-4 pb-2">
        <div className="p-3.5 rounded-xl bg-eco-deep/50 border border-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-eco-emerald' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-eco-emerald' : 'bg-amber-500'}`}></span>
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-emerald-200/70">FastAPI Gateway</p>
              <p className="text-[10px] text-emerald-500/30">{isConnected ? 'Live Synchronized' : 'Polling Sync...'}</p>
            </div>
          </div>
          {isAdmin && (
            <Settings className="w-4 h-4 text-emerald-500/30 cursor-pointer hover:text-emerald-300 transition-colors shrink-0" />
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
