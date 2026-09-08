import React from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { AVAILABLE_LOCATIONS } from '../data/mockData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="location-picker-modal"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Select Pharmacy District</h3>
              <p className="text-xs text-slate-500">Live prices from verified neighborhood dispensaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            id="close-location-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
          {AVAILABLE_LOCATIONS.map((loc) => {
            const isSelected = currentLocation === loc.area;
            return (
              <button
                key={loc.zip}
                onClick={() => {
                  onSelectLocation(loc.area);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-semibold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {loc.city[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{loc.area}</div>
                    <div className="text-[11px] text-slate-400">Zip code: {loc.zip} • Real-time API Active</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-sky-600" />}
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Prices update automatically based on local stock.</span>
          <span className="font-semibold text-sky-700">GPS Auto-detect</span>
        </div>
      </div>
    </div>
  );
};
