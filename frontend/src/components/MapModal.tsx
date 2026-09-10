import React, { useState } from 'react';
import { X, MapPin, Navigation, Phone, ShieldCheck, Clock, Store } from 'lucide-react';
import { ChemistStore } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  chemists: ChemistStore[];
  onSelectChemist: (chemist: ChemistStore) => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  chemists,
  onSelectChemist,
}) => {
  const [selectedChemist, setSelectedChemist] = useState<ChemistStore>(chemists[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95"
        id="chemist-map-modal"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Nearby Verified Dispensaries</h3>
              <p className="text-xs text-slate-500">Real-time inventory and pricing radius • Brooklyn 11201</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Canvas + Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Simulated Interactive Vector Map Canvas */}
          <div className="flex-1 bg-slate-100 relative min-h-[260px] p-4 flex items-center justify-center overflow-hidden">
            {/* Map Grid Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:28px_28px] opacity-40"></div>

            {/* Simulated Roads */}
            <div className="absolute top-1/3 left-0 right-0 h-4 bg-slate-300 transform -rotate-6"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-6 bg-slate-300 transform rotate-12"></div>
            <div className="absolute bottom-1/4 left-0 right-0 h-5 bg-sky-200/80 transform rotate-3"></div>

            {/* Central User Location Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-lg ring-4 ring-sky-300 animate-ping"></div>
              <span className="text-[9px] font-extrabold text-sky-900 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1">
                You (Downtown Brooklyn)
              </span>
            </div>

            {/* Chemist Map Markers */}
            {chemists.map((chem, idx) => {
              const isSelected = selectedChemist.id === chem.id;
              // distribute visually
              const positions = [
                { top: '35%', left: '38%' },
                { top: '65%', left: '60%' },
                { top: '25%', left: '72%' },
                { top: '70%', left: '30%' },
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={chem.id}
                  style={pos}
                  onClick={() => setSelectedChemist(chem)}
                  className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 flex flex-col items-center`}
                >
                  <div className={`p-1.5 rounded-full shadow-md flex items-center justify-center ${
                    isSelected ? 'bg-emerald-600 text-white ring-4 ring-emerald-200' : 'bg-slate-900 text-white'
                  }`}>
                    <Store className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap mt-0.5 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-white/90 text-slate-800'
                  }`}>
                    {chem.name.split(' ')[0]} ({chem.distanceMiles}mi)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right/Bottom Pharmacy Info Drawer */}
          <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-4 flex flex-col justify-between space-y-3 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedChemist.name}
                    </h4>
                    {selectedChemist.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedChemist.address}</p>
                </div>
                <span className="bg-sky-50 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-200">
                  {selectedChemist.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Walking Distance:</span>
                  <span className="font-bold text-slate-900">{selectedChemist.distanceMiles} miles (~7 min walk)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Price Freshness:</span>
                  <span className="font-bold text-emerald-700">Updated {selectedChemist.priceFreshnessMinutes}m ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Dispensary Contact:</span>
                  <span className="font-mono text-[11px] text-slate-800">{selectedChemist.phone}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                Participating licensed network chemist with active live inventory integration.
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onSelectChemist(selectedChemist);
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 bg-[#006398] hover:bg-[#004f7a] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>View Generic Stock</span>
                <Navigation className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
