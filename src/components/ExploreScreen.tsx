import React, { useState } from 'react';
import { 
  Check, 
  Search, 
  Camera, 
  Scan, 
  ArrowRight, 
  TrendingDown, 
  Phone, 
  CornerUpRight, 
  ShieldCheck, 
  ArrowLeftRight, 
  Info, 
  Sparkles,
  MapPin,
  Clock,
  PiggyBank
} from 'lucide-react';
import { Medicine, ChemistStore } from '../types';

interface ExploreScreenProps {
  medicines: Medicine[];
  nearbyChemists: ChemistStore[];
  onSelectMedicine: (medicineId: string) => void;
  onOpenScanModal: () => void;
  onOpenMapView: () => void;
  onCallPharmacy: (phone: string, name: string) => void;
  onGetDirections: (name: string, address: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  medicines,
  nearbyChemists,
  onSelectMedicine,
  onOpenScanModal,
  onOpenMapView,
  onCallPharmacy,
  onGetDirections,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchSuggestions, setSearchSuggestions] = useState<Medicine[]>([]);

  const categories = [
    'All',
    'Chronic Care',
    'Cardiovascular',
    'Diabetes',
    'Antibiotics',
    'Pain Relief',
    'Mental Health'
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const filtered = medicines.filter(
        (m) =>
          m.brandName.toLowerCase().includes(val.toLowerCase()) ||
          m.genericName.toLowerCase().includes(val.toLowerCase()) ||
          m.activeChemical.toLowerCase().includes(val.toLowerCase())
      );
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const found = medicines.find(
        (m) =>
          m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.activeChemical.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (found) {
        onSelectMedicine(found.id);
      } else {
        // default to first
        onSelectMedicine(medicines[0].id);
      }
    }
  };

  const filteredMedicines = selectedCategory === 'All' 
    ? medicines 
    : medicines.filter(m => m.therapeuticClass === selectedCategory);

  return (
    <div className="pb-24 space-y-4 px-4 pt-3 max-w-2xl mx-auto">
      {/* Hero Banner Section */}
      <div className="bg-sky-50/80 border border-sky-100/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        {/* Verified Equivalents Pill */}
        <div className="inline-flex items-center gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
            <span>Verified Equivalents</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Live Regulatory Match
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Save up to <span className="text-sky-600">85%</span> on exact generic matches.
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Search branded medicine or active chemical salt to compare certified bioequivalent pricing near you.
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="mt-4 relative" id="hero-medicine-search-form">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Brand (Lipitor) or Salt (Atorvastatin...)"
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-xs transition-all"
              id="hero-medicine-search-input"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              id="hero-compare-submit-btn"
            >
              Compare
            </button>
          </div>

          {/* Search Autocomplete Dropdown */}
          {searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden divide-y divide-slate-100">
              {searchSuggestions.map((med) => (
                <div
                  key={med.id}
                  onClick={() => {
                    onSelectMedicine(med.id);
                    setSearchSuggestions([]);
                    setSearchQuery('');
                  }}
                  className="p-3 hover:bg-sky-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {med.brandName} {med.dosage} <span className="text-slate-400 font-normal">vs</span>{' '}
                      <span className="text-sky-700">{med.genericName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Salt: {med.activeChemical}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {med.discountPercentage}% OFF
                    </span>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">
                      ₹{med.lowestGenericPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Scan Rx or Box OCR Banner Card */}
      <div 
        onClick={onOpenScanModal}
        className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:border-sky-300 hover:shadow-sm transition-all group"
        id="scan-rx-banner-card"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">Scan Rx or Box</span>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                OCR
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instant salt detection & price audit
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg border border-sky-200 bg-sky-50/50 flex items-center justify-center text-sky-700 group-hover:bg-sky-100 transition-colors">
          <Camera className="w-4 h-4" />
        </div>
      </div>

      {/* Therapeutic Classes Section */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
            THERAPEUTIC CLASSES
          </span>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="text-[11px] font-medium text-sky-700 hover:text-sky-800 transition-colors"
          >
            View 48 categories
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Verified Swaps Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Top Verified Swaps</h2>
            <p className="text-[11px] text-slate-500">Identical active ingredient, fraction of cost</p>
          </div>
          <button 
            onClick={() => onSelectMedicine('atorvastatin-20')}
            className="text-[11px] font-medium text-sky-700 hover:text-sky-800"
          >
            See Trends
          </button>
        </div>

        <div className="space-y-3">
          {filteredMedicines.map((med) => {
            return (
              <div
                key={med.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Top Row: Brand vs Generic + OFF Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {med.brandName} {med.dosage} <span className="font-normal text-slate-400">vs</span>{' '}
                      <span className="text-sky-700 font-bold">{med.genericName}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Active Chemical: <span className="text-slate-700 font-medium">{med.activeChemical}</span>
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {med.discountPercentage}% OFF
                  </span>
                </div>

                {/* Middle Box: Brand Avg vs Certified Generic */}
                <div className="bg-slate-50/70 rounded-lg p-2.5 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Brand Avg</div>
                    <div className="text-xs text-slate-400 line-through font-medium">
                      ₹{med.brandAvgPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Down Arrow / Zigzag */}
                  <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <TrendingDown className="w-4 h-4" />
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-sky-700 uppercase font-bold">Certified Generic</div>
                    <div className="text-base font-extrabold text-slate-900">
                      ₹{med.lowestGenericPrice.toFixed(2)}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">
                        / {med.defaultPackCount} tabs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Savings note + CTA */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1 text-emerald-700 text-xs font-medium">
                    <PiggyBank className="w-3.5 h-3.5" />
                    <span>Save ₹{med.savingsPerFill.toFixed(2)} per fill</span>
                  </div>

                  <button
                    onClick={() => onSelectMedicine(med.id)}
                    className="bg-[#005B94] hover:bg-[#004775] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
                    id={`view-pharmacies-btn-${med.id}`}
                  >
                    View {med.pharmacyCount} Pharmacies
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearby Verified Chemists Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Nearby Verified Chemists</h2>
            <p className="text-[11px] text-slate-500">Real-time inventory within walking distance</p>
          </div>
          <button
            onClick={onOpenMapView}
            className="text-[11px] font-medium text-sky-700 hover:text-sky-800"
            id="open-chemist-map-view-btn"
          >
            Map View
          </button>
        </div>

        <div className="space-y-2.5">
          {nearbyChemists.slice(0, 2).map((chemist) => (
            <div
              key={chemist.id}
              className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {chemist.name}
                  </span>
                  {chemist.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span className="bg-sky-50 text-sky-700 text-[10px] font-semibold px-1.5 py-0.2 rounded border border-sky-100">
                    {chemist.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{chemist.address}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Price Freshness: Updated {chemist.priceFreshnessMinutes}m ago</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCallPharmacy(chemist.phone, chemist.name)}
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
                  title="Call Pharmacy"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onGetDirections(chemist.name, chemist.address)}
                  className="w-8 h-8 rounded-lg border border-sky-200 bg-sky-50/50 hover:bg-sky-100 flex items-center justify-center text-sky-700 transition-colors"
                  title="Get Directions"
                >
                  <CornerUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Fidelity & Compliance Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
        {/* Compliance Header */}
        <div className="flex items-center gap-2 text-sky-900 font-bold text-xs sm:text-sm">
          <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span>Clinical Fidelity & Compliance</span>
        </div>

        {/* Compliance checklist */}
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/70">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-slate-700 leading-tight">
              <span className="font-bold text-slate-900">100% FDA Approved Salts</span> — Rigorously audited therapeutical equivalence ratings.
            </p>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/70">
            <ArrowLeftRight className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
            <p className="text-slate-700 leading-tight">
              <span className="font-bold text-slate-900">Zero Hidden Markups</span> — Transparent fair-market dispensing cost comparison.
            </p>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/70">
            <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-slate-700 leading-tight">
              <span className="font-bold text-slate-900">Neutral Non-Clinical Info</span> — Powered by validated public pharmacopeia datasets.
            </p>
          </div>
        </div>

        {/* Notice Disclaimer Box */}
        <div className="p-3 bg-slate-100/70 rounded-xl text-[11px] text-slate-600 leading-relaxed border border-slate-200/60">
          <span className="font-bold text-slate-800">Notice:</span> GenericMed operates purely as an algorithmic pricing aggregation and bioequivalence indexing portal. We do not prescribe medication or substitute independent licensed clinical judgment. Consult your primary physician or certified pharmacist before modifying drug dosages or formulations.
        </div>
      </div>
    </div>
  );
};
