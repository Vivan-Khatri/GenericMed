import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Check, 
  SlidersHorizontal, 
  CheckCircle2, 
  Store, 
  Info, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Medicine, ChemistOffer } from '../types';

interface SearchResultsScreenProps {
  medicine: Medicine;
  offers: ChemistOffer[];
  onBack: () => void;
  onReserveOffer: (offer: ChemistOffer) => void;
  onOpenSideBySideModal: (selectedOfferIds: string[]) => void;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  medicine,
  offers,
  onBack,
  onReserveOffer,
  onOpenSideBySideModal,
}) => {
  const [sortBy, setSortBy] = useState<'lowest' | 'highest' | 'distance' | 'freshness'>('lowest');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [homeDeliveryOnly, setHomeDeliveryOnly] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>(['offer-1', 'offer-2']);

  const toggleCompare = (offerId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(offerId)) {
        return prev.filter((id) => id !== offerId);
      } else {
        return [...prev, offerId];
      }
    });
  };

  // Filter and sort offers
  const filteredOffers = offers
    .filter((offer) => {
      if (inStockOnly && !offer.inStock) return false;
      if (homeDeliveryOnly && !offer.hasHomeDelivery) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'lowest') return a.price - b.price;
      if (sortBy === 'highest') return b.price - a.price;
      if (sortBy === 'distance') return a.distanceMiles - b.distanceMiles;
      if (sortBy === 'freshness') return a.updatedMinutesAgo - b.updatedMinutesAgo;
      return 0;
    });

  return (
    <div className="pb-32 space-y-3 px-4 pt-3 max-w-2xl mx-auto">
      {/* Back Button & Medicine Title Section */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
            id="results-back-button"
            title="Back to Explore"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <span>{medicine.genericName} {medicine.dosage}</span>
            </div>
            <span className="bg-sky-100/90 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
              {medicine.brandName}® bio-equivalent
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 pl-10">
          Showing {filteredOffers.length} Chemist offers for {medicine.activeChemical} ({medicine.form}, {medicine.defaultPackCount} Count)
        </p>
      </div>

      {/* Sorting & Filter Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs cursor-pointer"
              id="sort-offers-select"
            >
              <option value="lowest">⇅ Price: Lowest to Highest</option>
              <option value="highest">⇅ Price: Highest to Lowest</option>
              <option value="distance">📍 Distance: Nearest First</option>
              <option value="freshness">⏱️ Price Freshness: Recently Updated</option>
            </select>
          </div>

          <button
            onClick={() => {
              setInStockOnly(!inStockOnly);
              setVerifiedOnly(!verifiedOnly);
            }}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-xs"
            title="Toggle Filter Preferences"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
              inStockOnly
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
            <span>In Stock Only</span>
          </button>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
              verifiedOnly
                ? 'bg-cyan-600 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {verifiedOnly && <Check className="w-3 h-3 stroke-[3]" />}
            <span>Verified Generic</span>
          </button>

          <button
            onClick={() => setHomeDeliveryOnly(!homeDeliveryOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
              homeDeliveryOnly
                ? 'bg-sky-700 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {homeDeliveryOnly && <Check className="w-3 h-3 stroke-[3]" />}
            <span>Home Delivery</span>
          </button>
        </div>
      </div>

      {/* Savings Opportunity Card */}
      <div className="bg-sky-50/90 border border-sky-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-sky-100">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
            SAVINGS OPPORTUNITY
          </span>
          <span className="bg-emerald-100/90 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            Save ₹{medicine.savingsPerFill.toFixed(2)} / fill
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">Avg. Brand Price</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ₹{medicine.brandAvgPrice.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {medicine.brandName} ({medicine.referenceManufacturer})
            </div>
          </div>

          <div className="border-l border-sky-200/70 pl-4">
            <div className="text-xs text-slate-500 font-medium">Lowest Generic</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ₹{medicine.lowestGenericPrice.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
              <span>↘</span>
              <span>{medicine.discountPercentage}% Cheaper</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chemist Offers List */}
      <div className="space-y-3">
        {filteredOffers.map((offer, index) => {
          const isSelected = selectedForCompare.includes(offer.id);

          return (
            <div
              key={offer.id}
              className={`bg-white border rounded-2xl p-4 shadow-xs transition-all ${
                isSelected ? 'border-sky-500 ring-1 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Offer Header Row: Best Price Choice / Offer # & Verification */}
              <div className="flex items-center justify-between text-xs pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  {offer.isBestPrice ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Best Price Choice</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-500 text-[11px]">
                      Offer #{offer.offerNumber || index + 1}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>
                    {offer.updatedMinutesAgo < 60
                      ? `Verified ${offer.updatedMinutesAgo} mins ago`
                      : `Updated ${Math.round(offer.updatedMinutesAgo / 60)} hrs ago`}
                  </span>
                </div>
              </div>

              {/* Pharmacy Info & Thumbnail */}
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative">
                  <img
                    src={offer.imageUrl}
                    alt={offer.productBrandName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {offer.inStock && (
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs sm:text-sm truncate">
                    <Store className="w-3.5 h-3.5 text-sky-700 flex-shrink-0" />
                    <span className="truncate">{offer.pharmacyName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {offer.pharmacyAddress} • {offer.openHours}
                  </p>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {offer.productBrandName}{' '}
                    <span className="font-normal text-slate-500">
                      {offer.manufacturer} ({offer.certification})
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Savings Display */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      ₹{offer.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{offer.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      {offer.discountPercent}% Cheaper
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Per tab: ₹{offer.perTabletPrice.toFixed(2)} • {offer.packCount} Tablets
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    {offer.bioequivalenceRating}
                  </span>
                  {offer.hasHomeDelivery && (
                    <span className="text-[10px] text-sky-700 font-medium">Free Delivery on ₹250+</span>
                  )}
                </div>
              </div>

              {/* Feature Tags */}
              <div className="flex items-center gap-2 mt-2 text-[11px]">
                <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-medium border border-sky-100">
                  <Zap className="w-3 h-3 text-sky-600" />
                  <span>{offer.readyTime}</span>
                </span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  Bioequivalent
                </span>
              </div>

              {/* Actions & Compare Checkbox */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCompare(offer.id)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                  />
                  <span>Compare</span>
                </label>

                {offer.isBestPrice ? (
                  <button
                    onClick={() => onReserveOffer(offer)}
                    className="bg-[#006398] hover:bg-[#004f7a] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    id={`reserve-btn-${offer.id}`}
                  >
                    <span>Reserve / Directions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onReserveOffer(offer)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                    id={`reserve-btn-${offer.id}`}
                  >
                    <span>Reserve</span>
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Reference Brand Baseline Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Reference Brand Baseline
            </span>
            <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded">
              Brand Original
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
              <Store className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500">Walgreens / Retail Partner</div>
              <div className="text-sm font-bold text-slate-900">
                {medicine.referenceDrug}
              </div>
              <p className="text-[11px] text-slate-500">
                {medicine.activeChemical} reference drug
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{medicine.brandAvgPrice.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500">
                Standard Cash Retail Price
              </div>
            </div>

            <div>
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold px-2 py-1 rounded-md">
                No Discount Applied
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory / Clinical Disclaimer Callout */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Prices reported by licensed pharmacies. Consult your physician or pharmacist before switching medications. Generic medications are chemically bioequivalent to their brand counterparts as audited by the FDA.
          </p>
        </div>
      </div>

      {/* Floating Comparison Drawer / Sticky Bottom Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 z-30 px-4 max-w-2xl mx-auto pointer-events-none">
          <div className="bg-slate-950 text-white rounded-2xl p-3 shadow-2xl border border-slate-800 flex items-center justify-between pointer-events-auto animate-in slide-in-from-bottom-3">
            <div className="flex items-center gap-2.5 pl-1">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-extrabold flex items-center justify-center">
                {selectedForCompare.length}
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Medicines Selected
              </span>
            </div>

            <button
              onClick={() => onOpenSideBySideModal(selectedForCompare)}
              className="bg-[#006398] hover:bg-[#00507a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              id="compare-now-sticky-btn"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
