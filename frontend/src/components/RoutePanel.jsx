import React, { useState } from 'react';
import { Route, Sparkles, RefreshCw, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { fetchOptimalRoute, fetchOsrmRoute } from '../services/api';

const RoutePanel = ({ optimalRoute, setOptimalRoute, bins = [], isReadOnly = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRoute = async () => {
    if (isReadOnly) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOptimalRoute();
      if (data && data.route) {
        const startCoord = '77.4027,23.2244';
        const endCoord = '77.5404,23.2524';
        const middleCoords = data.route
          .filter((id) => id !== 'depot')
          .map((id) => {
            const target = bins.find((b) => b.bin_id === id);
            if (target && target.longitude && target.latitude) {
              return `${target.longitude},${target.latitude}`;
            }
            return null;
          })
          .filter(Boolean);
        const fullRouteCoords = [startCoord, ...middleCoords, endCoord];
        if (fullRouteCoords.length >= 2) {
          try {
            const osrmData = await fetchOsrmRoute(fullRouteCoords.join(';'));
            if (osrmData?.routes?.[0]) {
              const geojsonCoords = osrmData.routes[0].geometry.coordinates;
              data.roadGeometry = geojsonCoords.map(([lng, lat]) => [lat, lng]);
            }
          } catch (osrmErr) {
            console.error("OSRM road geometry extraction fallback:", osrmErr);
          }
        }
      }
      setOptimalRoute(data);
    } catch (err) {
      setError('Failed to compute TSP optimization route. Ensure backend microservice is operational.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/10 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Route className="w-5 h-5 text-eco-teal" /> AI Fleet Dispatch Optimizer
          </h2>
          <p className="text-xs text-emerald-400/40 mt-0.5">
            Powered by NetworkX graph-theoretic TSP approximations &amp; Numpy Haversine distance bounds
          </p>
        </div>
        {isReadOnly ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-eco-deep/40 border border-emerald-500/10 text-xs text-emerald-500/40 shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Only</span>
          </div>
        ) : (
          <button
            onClick={handleGenerateRoute}
            disabled={loading}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-xl group bg-gradient-to-br from-eco-emerald via-eco-teal to-eco-aqua hover:text-white text-white focus:ring-2 focus:outline-none focus:ring-eco-emerald/40 transition-all active:scale-95 shadow-lg shadow-eco-emerald/20 shrink-0 cursor-pointer"
          >
            <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-eco-deep rounded-[10px] group-hover:bg-opacity-0 flex items-center gap-2">
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin text-eco-teal" /><span>Computing Topology...</span></>
              ) : (
                <><Sparkles className="w-4 h-4 text-eco-emerald group-hover:text-white transition-colors" /><span>Generate Optimal Route</span></>
              )}
            </span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      {optimalRoute && optimalRoute.details && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-eco-deep/40 border border-emerald-500/10 text-xs">
            <div>
              <span className="text-emerald-500/40 block text-[10px] uppercase font-semibold">Total Hubs</span>
              <span className="font-bold text-white text-sm">{optimalRoute.details.length} Hubs</span>
            </div>
            <div>
              <span className="text-emerald-500/40 block text-[10px] uppercase font-semibold">Haversine</span>
              <span className="font-bold text-eco-teal text-sm">{optimalRoute.total_distance} km</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-emerald-500/40 block text-[10px] uppercase font-semibold">Engine</span>
              <span className="font-medium text-eco-emerald text-[11px] truncate block">{optimalRoute.message || 'TSP Tour Solved'}</span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-emerald-400/50 uppercase tracking-wider mb-3">Optimized Sequence</h3>
            {optimalRoute.details.length === 0 ? (
              <div className="p-4 rounded-xl text-center text-xs text-emerald-500/30 bg-eco-deep/40 border border-emerald-500/8">
                <CheckCircle className="w-5 h-5 mx-auto mb-1 text-eco-emerald/60" />
                Fleet is balanced. No bins qualify.
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {optimalRoute.details.map((step, idx) => (
                  <div key={`${step.bin_id}-${idx}`} className="p-3 rounded-xl bg-eco-deep/30 border border-emerald-500/8 flex items-center justify-between gap-3 hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center gap-3.5">
                      <span className="w-6 h-6 rounded-lg bg-eco-teal/10 border border-eco-teal/20 font-mono text-[11px] font-bold text-eco-teal flex items-center justify-center shrink-0">{step.step_order}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{step.location || step.bin_id}</p>
                        <p className="text-[10px] text-emerald-500/30 font-mono">Node: {step.bin_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <span className="text-[9px] text-emerald-500/30 block">Priority</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${step.priority === 3 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : step.priority === 2 ? 'bg-amber-500/10 text-amber-400' : 'bg-eco-deep/50 text-emerald-400/50'}`}>Tier {step.priority}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-emerald-500/30 block">Load</span>
                        <span className="text-xs font-bold text-emerald-100">{step.fill_percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePanel;
