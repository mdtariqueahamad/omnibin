import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import AnalyticsCards from '../components/AnalyticsCards';
import ReportsPanel from '../components/ReportsPanel';
import BinZoneCards from '../components/BinZoneCards';
import MapBlock from '../components/MapBlock';
import MapView from '../components/MapView';
import RoutePanel from '../components/RoutePanel';
import AIChatbot from '../components/AIChatbot';
import { fetchBins, fetchBinHistory, seedBins } from '../services/api';
import { Sparkles, X, Activity, Server } from 'lucide-react';

function DashboardLayout() {
  const { userRole, logout } = useAuth();
  const isAdmin = userRole === 'admin';

  const [bins, setBins] = useState([]);
  const [optimalRoute, setOptimalRoute] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [binHistory, setBinHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Background polling interval checking /api/bins status every 5 seconds
  useEffect(() => {
    const loadBinsData = async () => {
      try {
        const data = await fetchBins();
        setBins(data);
        setIsConnected(true);
      } catch (err) {
        setIsConnected(false);
      }
    };

    loadBinsData();
    const interval = setInterval(loadBinsData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Monitor selected node interactions to trigger secondary log loads
  useEffect(() => {
    if (!selectedBin) {
      setBinHistory(null);
      return;
    }

    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const data = await fetchBinHistory(selectedBin.bin_id);
        setBinHistory(data?.history || []);
      } catch (err) {
        setBinHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [selectedBin]);

  // Seed sample database nodes utility hook — Admin only
  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const seeded = await seedBins();
      setBins(seeded);
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-eco-deep text-green-50 selection:bg-eco-emerald selection:text-eco-deep">
      {/* Side Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        userRole={userRole}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto relative">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-eco-emerald/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-eco-teal/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

        <div className="relative z-10">
          {/* ═══════════════ GLASS HEADER BAR ═══════════════ */}
          <DashboardHeader bins={bins} isAdmin={isAdmin} activeTab={activeTab} />

          {/* Guest mode indicator — shown for read-only users */}
          {!isAdmin && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15 flex items-center gap-3 animate-fade-in">
              <span className="guest-badge">Read-Only</span>
              <span className="text-xs text-amber-300/70">You are viewing in guest mode. Admin controls are completely hidden.</span>
            </div>
          )}

          {/* Admin-only: Seed banner when zero bins */}
          {isAdmin && bins.length === 0 && isConnected && (
            <div className="mb-6 p-4 rounded-2xl glass-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="p-2.5 bg-eco-emerald/10 rounded-xl text-eco-emerald shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Zero Active Nodes Monitored</h3>
                  <p className="text-xs text-emerald-300/50 mt-0.5">Click below to populate simulated smart container parameters.</p>
                </div>
              </div>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="glass-button-primary shrink-0 flex items-center gap-2 !text-xs !py-2.5 !px-4"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {seeding ? 'Seeding Gateway...' : 'Seed Testing Fleet'}
              </button>
            </div>
          )}

          {/* ═══════════════ DASHBOARD TAB ═══════════════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* 1. Analytics Cards */}
              <AnalyticsCards bins={bins} />

              {/* 2. Reports Panel */}
              <ReportsPanel isAdmin={isAdmin} />

              {/* 3. Interactive Bin Zone Cards */}
              <BinZoneCards bins={bins} onSelectBin={setSelectedBin} />

              {/* 4. Collapsible Map Block */}
              <MapBlock
                bins={bins}
                optimalRoute={optimalRoute}
                setOptimalRoute={setOptimalRoute}
                setSelectedBin={setSelectedBin}
                isAdmin={isAdmin}
              />

              {/* 5. Urgent Outage Hubs */}
              <div className="glass-panel rounded-2xl p-4 border border-emerald-500/10 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400/50 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500 animate-pulse" /> Urgent Outage Hubs
                </h3>
                {bins.filter(b => b.status === 'Critical').length === 0 ? (
                  <div className="text-xs text-emerald-500/30 italic p-4 bg-eco-deep/40 rounded-xl border border-emerald-500/8 text-center">
                    Zero hardware capacity overflows logged.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1.5">
                    {bins.filter(b => b.status === 'Critical').map(b => (
                      <div key={b.bin_id} onClick={() => setSelectedBin(b)} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between cursor-pointer hover:bg-rose-500/15 transition-all">
                        <div className="truncate pr-2">
                          <p className="text-xs font-bold text-white truncate">{b.location}</p>
                          <p className="text-[9px] text-rose-400 font-mono">{b.bin_id}</p>
                        </div>
                        <span className="text-xs font-black text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded shrink-0">
                          {b.fill_percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════ MAP TAB ═══════════════ */}
          {activeTab === 'map' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold text-white">Expanded Cartography Matrix</h2>
                <p className="text-xs text-emerald-400/50">Click container markers to analyze volume properties and active priority rules</p>
              </div>
              <MapView bins={bins} optimalRoute={optimalRoute} setSelectedBin={setSelectedBin} />
              {isAdmin && (
                <RoutePanel optimalRoute={optimalRoute} setOptimalRoute={setOptimalRoute} bins={bins} isReadOnly={false} />
              )}
            </div>
          )}

          {/* ═══════════════ ROUTES TAB ═══════════════ */}
          {activeTab === 'routes' && (
            <div className="space-y-6 animate-fade-in text-left max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-white">NetworkX Optimizer Sandbox</h2>
                <p className="text-xs text-emerald-400/50">Evaluate dynamic edge limits and shortest metrics calculated from the depot</p>
              </div>
              {isAdmin ? (
                <RoutePanel optimalRoute={optimalRoute} setOptimalRoute={setOptimalRoute} bins={bins} isReadOnly={false} />
              ) : (
                <div className="glass-panel rounded-2xl p-8 text-center border border-emerald-500/10">
                  <p className="text-sm text-emerald-400/40">Route optimization is available for admin users only.</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ HISTORY TAB ═══════════════ */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold text-white">Telemetry Database Audit Logs</h2>
                <p className="text-xs text-emerald-400/50">Historical records of device payload syncs persisted asynchronously into MongoDB</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bins.map((b) => (
                  <div key={b.bin_id} onClick={() => setSelectedBin(b)} className="glass-card p-4 rounded-xl cursor-pointer hover:border-eco-emerald/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-white">{b.location}</p>
                      <p className="text-xs text-emerald-400/40 font-mono mt-0.5">Node: {b.bin_id}</p>
                    </div>
                    <span className="text-xs font-semibold text-eco-emerald underline shrink-0">Inspect Timeline &rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ═══════════════ BIN DETAIL MODAL ═══════════════ */}
      {selectedBin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-deep/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBin(null)}>
          <div className="glass-login w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl text-left flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="p-4 bg-eco-forest/60 border-b border-emerald-500/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-eco-emerald uppercase tracking-wider block">IoT Sensor Logbook</span>
                <h3 className="font-bold text-sm text-white">{selectedBin.location}</h3>
              </div>
              <button onClick={() => setSelectedBin(null)} className="p-1.5 rounded-lg hover:bg-eco-forest text-emerald-400/50 hover:text-white transition-colors cursor-pointer shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal metrics */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-2 bg-eco-deep/40 p-2.5 rounded-xl border border-emerald-500/10 text-center text-xs">
                <div>
                  <span className="text-[9px] text-emerald-500/40 block">Saturation</span>
                  <span className="font-extrabold text-white">{selectedBin.fill_percentage}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-500/40 block">Dispatch</span>
                  <span className="font-extrabold text-white">Tier {selectedBin.priority}</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-500/40 block">Status</span>
                  <span className={`font-bold text-[11px] ${selectedBin.status === 'Critical' ? 'text-rose-400 animate-pulse' : 'text-eco-emerald'}`}>
                    {selectedBin.status}
                  </span>
                </div>
              </div>

              {/* History Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-400/50 mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-eco-teal" /> Historic Storage Logs
                </h4>
                {historyLoading ? (
                  <div className="p-8 text-center text-xs text-emerald-500/30 italic">Retrieving time-series data...</div>
                ) : binHistory && binHistory.length > 0 ? (
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1.5">
                    {binHistory.map((item, index) => {
                      const d = new Date(item.timestamp);
                      const time = isNaN(d.getTime()) ? item.timestamp : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const date = isNaN(d.getTime()) ? '' : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                      return (
                        <div key={index} className="p-2.5 rounded-xl bg-eco-deep/40 border border-emerald-500/8 flex items-center justify-between text-xs">
                          <div className="text-left pr-2">
                            <span className="font-mono text-[10px] text-emerald-200/70 block">{time}</span>
                            <span className="text-[9px] text-emerald-500/30 block">{date}</span>
                          </div>
                          <div className="flex items-center gap-2.5 w-32 justify-end shrink-0">
                            <div className="w-16 bg-eco-deep/60 rounded-full h-1 overflow-hidden">
                              <div className={`h-full rounded-full ${item.fill_percentage > 80 ? 'bg-rose-500' : 'bg-eco-emerald'}`} style={{ width: `${Math.min(item.fill_percentage, 100)}%` }} />
                            </div>
                            <span className="font-bold text-emerald-100 text-right w-8">{item.fill_percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-500/25 italic p-4 text-center bg-eco-deep/30 rounded-xl">
                    Zero timeline archives saved for this token.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ FLOATING AI CHATBOT ═══════════════ */}
      <AIChatbot />
    </div>
  );
}

export default DashboardLayout;
