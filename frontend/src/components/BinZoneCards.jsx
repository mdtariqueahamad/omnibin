import React, { useState, useMemo } from 'react';
import { Building2, Home, Factory, X, Activity, MapPin } from 'lucide-react';

const ZONES = [
  {
    id: 'commercial',
    name: 'Central Commercial',
    icon: Building2,
    gradient: 'zone-gradient-1',
    keywords: ['Mall', 'MP Nagar', 'Market', 'Commercial', 'DB City', 'Shop'],
    description: 'High-traffic commercial hubs & retail corridors',
    accentColor: 'text-eco-emerald',
    accentBg: 'bg-eco-emerald/10',
    accentBorder: 'border-eco-emerald/20',
  },
  {
    id: 'residential',
    name: 'Residential Colony',
    icon: Home,
    gradient: 'zone-gradient-2',
    keywords: ['Colony', 'Arera', 'Nagar', 'Residential', 'Housing', 'Sector'],
    description: 'Residential neighborhoods & housing complexes',
    accentColor: 'text-eco-teal',
    accentBg: 'bg-eco-teal/10',
    accentBorder: 'border-eco-teal/20',
  },
  {
    id: 'industrial',
    name: 'Industrial & Transit',
    icon: Factory,
    gradient: 'zone-gradient-3',
    keywords: ['Industrial', 'Railway', 'Station', 'Govindpura', 'Factory', 'Transit', 'Depot'],
    description: 'Industrial zones, transit hubs & logistics areas',
    accentColor: 'text-eco-aqua',
    accentBg: 'bg-eco-aqua/10',
    accentBorder: 'border-eco-aqua/20',
  },
];

function classifyBin(bin) {
  const loc = (bin.location || '').toLowerCase();
  for (const zone of ZONES) {
    if (zone.keywords.some(kw => loc.includes(kw.toLowerCase()))) {
      return zone.id;
    }
  }
  return 'commercial'; // default fallback
}

const BinZoneCards = ({ bins = [], onSelectBin }) => {
  const [activeZone, setActiveZone] = useState(null);

  const zoneBins = useMemo(() => {
    const grouped = { commercial: [], residential: [], industrial: [] };
    bins.forEach(b => {
      const zoneId = classifyBin(b);
      grouped[zoneId].push(b);
    });
    return grouped;
  }, [bins]);

  const activeZoneData = ZONES.find(z => z.id === activeZone);
  const activeBins = activeZone ? (zoneBins[activeZone] || []) : [];

  return (
    <>
      {/* Zone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="bin-zone-cards">
        {ZONES.map((zone) => {
          const Icon = zone.icon;
          const zBins = zoneBins[zone.id] || [];
          const count = zBins.length;
          const avgFill = count > 0 ? Math.round(zBins.reduce((a, b) => a + (b.fill_percentage || 0), 0) / count) : 0;
          const criticalCount = zBins.filter(b => (b.fill_percentage || 0) > 80).length;

          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`glass-card ${zone.gradient} rounded-2xl p-5 text-left cursor-pointer group relative overflow-hidden transition-all duration-300`}
              id={`zone-card-${zone.id}`}
            >
              {/* Ambient glow */}
              <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl ${zone.accentBg} opacity-50 group-hover:opacity-80 transition-opacity`} aria-hidden="true" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${zone.accentBg} border ${zone.accentBorder} ${zone.accentColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {criticalCount > 0 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 text-[10px] font-bold animate-pulse">
                      {criticalCount} critical
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-0.5">{zone.name}</h3>
                <p className="text-[10px] text-emerald-400/40 mb-3">{zone.description}</p>

                <div className="flex items-center gap-4 text-[11px]">
                  <div>
                    <span className="text-emerald-500/30 block text-[9px] uppercase font-semibold">Bins</span>
                    <span className="font-bold text-white">{count}</span>
                  </div>
                  <div>
                    <span className="text-emerald-500/30 block text-[9px] uppercase font-semibold">Avg Fill</span>
                    <span className={`font-bold ${avgFill > 75 ? 'text-rose-400' : 'text-eco-emerald'}`}>{avgFill}%</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Zone Detail Modal */}
      {activeZone && activeZoneData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-deep/80 backdrop-blur-sm animate-fade-in" onClick={() => setActiveZone(null)}>
          <div className="glass-login w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl text-left flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-4 bg-eco-forest/60 border-b border-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeZoneData.accentBg} ${activeZoneData.accentColor}`}>
                  {React.createElement(activeZoneData.icon, { className: 'w-4 h-4' })}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-eco-emerald uppercase tracking-wider block">Zone Drilldown</span>
                  <h3 className="font-bold text-sm text-white">{activeZoneData.name}</h3>
                </div>
              </div>
              <button onClick={() => setActiveZone(null)} className="p-1.5 rounded-lg hover:bg-eco-forest text-emerald-400/50 hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bins List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {activeBins.length === 0 ? (
                <div className="text-xs text-emerald-500/30 italic p-6 text-center bg-eco-deep/30 rounded-xl">
                  No bins currently assigned to this zone.
                </div>
              ) : (
                activeBins.map(bin => (
                  <div
                    key={bin.bin_id}
                    onClick={() => { setActiveZone(null); onSelectBin?.(bin); }}
                    className="p-3 rounded-xl bg-eco-deep/30 border border-emerald-500/8 flex items-center justify-between gap-3 hover:border-emerald-500/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${(bin.fill_percentage || 0) > 80 ? 'text-rose-400' : 'text-eco-emerald'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{bin.location}</p>
                        <p className="text-[10px] text-emerald-500/30 font-mono">{bin.bin_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <div>
                        <span className="text-[9px] text-emerald-500/30 block">Fill</span>
                        <span className={`text-xs font-bold ${(bin.fill_percentage || 0) > 80 ? 'text-rose-400' : 'text-eco-emerald'}`}>{bin.fill_percentage}%</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${bin.status === 'Critical' ? 'bg-rose-500/15 text-rose-400' : bin.status === 'Needs Collection' ? 'bg-amber-500/10 text-amber-400' : 'bg-eco-emerald/10 text-eco-emerald'}`}>
                        {bin.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BinZoneCards;
