import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import MapView from './MapView';
import RoutePanel from './RoutePanel';

const MapBlock = ({ bins, optimalRoute, setOptimalRoute, setSelectedBin, isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-panel rounded-2xl border border-emerald-500/10 overflow-hidden" id="map-block">
      {/* Collapsed Header / Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-eco-forest/20 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-eco-aqua/10 border border-eco-aqua/20 rounded-xl text-eco-aqua">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Interactive Cartography Map</h3>
            <p className="text-[10px] text-emerald-400/40 mt-0.5">
              {isExpanded ? 'Click to collapse map view' : 'Click to explore live bin locations & route optimization'}
            </p>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-eco-deep/40 text-emerald-400/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Expanded Content */}
      <div className={isExpanded ? 'map-block-expanded' : 'map-block-collapsed'} style={!isExpanded ? { maxHeight: 0 } : undefined}>
        <div className="px-4 pb-4 space-y-4">
          {/* Map View */}
          <MapView bins={bins} optimalRoute={optimalRoute} setSelectedBin={setSelectedBin} />

          {/* Route Panel — Admin Only (completely omitted for guests) */}
          {isAdmin && (
            <RoutePanel optimalRoute={optimalRoute} setOptimalRoute={setOptimalRoute} bins={bins} isReadOnly={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapBlock;
