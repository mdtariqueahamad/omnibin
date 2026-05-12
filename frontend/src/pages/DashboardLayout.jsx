import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AnalyticsCards from '../components/AnalyticsCards';
import MapView from '../components/MapView';
import RoutePanel from '../components/RoutePanel';
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

    // Execute first instant call
    loadBinsData();

    // Trigger interval loop
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

  // Seed sample database nodes utility hook
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
      {/* Decoupled Side Navigation Layout */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        userRole={userRole}
        onLogout={logout}
      />

      {/* Main Orchestrator Canvas Workspace */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto relative">
        {/* Subtle ambient glow in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-eco-emerald/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-eco-teal/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

        <div className="relative z-10">
          {/* Guest mode indicator banner */}
          {!isAdmin && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15 flex items-center gap-3 animate-fade-in">
              <span className="guest-badge">Read-Only</span>
              <span className="text-xs text-amber-300/70">You are viewing in guest mode. Admin controls are hidden.</span>
            </div>
          )}

          {/* Helper Banner for clean out-of-the-box demonstration deployment */}
          {bins.length === 0 && isConnected && isAdmin && (
            <div className="mb-6 p-4 rounded-2xl glass-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="p-2.5 bg-eco-emerald/10 rounded-xl text-eco-emerald shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Zero Active Nodes Monitored</h3>
                  <p className="text-xs text-emerald-300/50 mt-0.5">Click below to automatically populate simulated smart container mock parameters.</p>
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

          {/* Live Active Overview Matrix Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header branding block */}
              <div className="text-left mb-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Fleet Real-Time Core</h1>
                <p className="text-xs text-emerald-400/50 mt-0.5">Automated telemetry streams mapping continuous live ESP32 status updates</p>
              </div>

              {/* Status Analytics summary layers */}
              <AnalyticsCards bins={bins} />

              {/* Split workspace view layout: Left canvas for Maps, Right panel for route management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MapView bins={bins} optimalRoute={optimalRoute} setSelectedBin={setSelectedBin} />
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <RoutePanel optimalRoute={optimalRoute} setOptimalRoute={setOptimalRoute} bins={bins} isReadOnly={!isAdmin} />
                  
                  {/* Instant focus alert block mapping critical state hubs */}
                  <div className="glass-panel rounded-2xl p-4 border border-emerald-500/10 text-left flex-1 flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400/50 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-500 animate-pulse" /> Urgent Outage Hubs
                    </h3>
                    {bins.filter(b => b.status === 'Critical').length === 0 ? (
                      <div className="text-xs text-emerald-500/30 italic p-4 bg-eco-deep/40 rounded-xl border border-emerald-500/8 text-center flex-1 flex items-center justify-center">
                        Zero hardware capacity overflows logged.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1.5">
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
              </div>
            </div>
          )}

          {/* Fullscreen interactive Map interface */}
          {activeTab === 'map' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold text-white">Expanded Cartography Matrix</h2>
                <p className="text-xs text-emerald-400/50">Click container markers to analyze volume properties and active priority rules</p>
              </div>
              <MapView bins={bins} optimalRoute={optimalRoute} setSelectedBin={setSelectedBin} />
            </div>
          )}

          {/* Dedicated Combinatorial Routing view */}
          {activeTab === 'routes' && (
            <div className="space-y-6 animate-fade-in text-left max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-white">NetworkX Optimizer Sandbox</h2>
                <p className="text-xs text-emerald-400/50">Evaluate dynamic edge limits and shortest metrics calculated from the depot</p>
              </div>
              <RoutePanel optimalRoute={optimalRoute} setOptimalRoute={setOptimalRoute} bins={bins} isReadOnly={!isAdmin} />
            </div>
          )}

          {/* Central Analytics time-series list preview */}
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

      {/* Analytics Drilldown Interactive Overlays Modal */}
      {selectedBin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-deep/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-login w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl text-left flex flex-col max-h-[85vh]">
            {/* Modal header banner */}
            <div className="p-4 bg-eco-forest/60 border-b border-emerald-500/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-eco-emerald uppercase tracking-wider block">IoT Sensor Logbook</span>
                <h3 className="font-bold text-sm text-white">{selectedBin.location}</h3>
              </div>
              <button onClick={() => setSelectedBin(null)} className="p-1.5 rounded-lg hover:bg-eco-forest text-emerald-400/50 hover:text-white transition-colors cursor-pointer shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal internal metrics */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-2 bg-eco-deep/40 p-2.5 rounded-xl border border-emerald-500/10 text-center text-xs">
                <div>
                  <span className="text-[9px] text-emerald-500/40 block">Current Saturation</span>
                  <span className="font-extrabold text-white">{selectedBin.fill_percentage}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-500/40 block">Dispatch Level</span>
                  <span className="font-extrabold text-white">Tier {selectedBin.priority}</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-500/40 block">Status State</span>
                  <span className={`font-bold text-[11px] ${selectedBin.status === 'Critical' ? 'text-rose-400 animate-pulse' : 'text-eco-emerald'}`}>
                    {selectedBin.status}
                  </span>
                </div>
              </div>

              {/* Log Timeline block */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-400/50 mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-eco-teal" /> Historic Storage Logs
                </h4>
                
                {historyLoading ? (
                  <div className="p-8 text-center text-xs text-emerald-500/30 italic">
                    Retrieving time-series bounds from database...
                  </div>
                ) : binHistory && binHistory.length > 0 ? (
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1.5">
                    {binHistory.map((item, index) => {
                      const d = new Date(item.timestamp);
                      const timeFormatted = isNaN(d.getTime()) ? item.timestamp : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const dateFormatted = isNaN(d.getTime()) ? '' : d.toLocaleDateString([], { month: 'short', day: 'numeric' });

                      return (
                        <div key={index} className="p-2.5 rounded-xl bg-eco-deep/40 border border-emerald-500/8 flex items-center justify-between text-xs">
                          <div className="text-left pr-2">
                            <span className="font-mono text-[10px] text-emerald-200/70 block">{timeFormatted}</span>
                            <span className="text-[9px] text-emerald-500/30 block">{dateFormatted}</span>
                          </div>
                          
                          {/* Progress volume indicator */}
                          <div className="flex items-center gap-2.5 w-32 justify-end shrink-0">
                            <div className="w-16 bg-eco-deep/60 rounded-full h-1 overflow-hidden">
                              <div className={`h-full rounded-full ${item.fill_percentage > 80 ? 'bg-rose-500' : 'bg-eco-emerald'}`} style={{ width: `${Math.min(item.fill_percentage, 100)}%` }}></div>
                            </div>
                            <span className="font-bold text-emerald-100 text-right w-8">{item.fill_percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-500/25 italic p-4 text-center bg-eco-deep/30 rounded-xl">
                    Zero timeline archives saved for this hardware token.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
