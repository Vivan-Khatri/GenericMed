import React from 'react';
import { X, Check, ShieldCheck, ArrowRight, TrendingDown, Store, Sparkles, Building2, MapPin } from 'lucide-react';
import { Medicine, ChemistOffer } from '../types';

interface SideBySideComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine;
  selectedOffers: ChemistOffer[];
  onReserveOffer: (offer: ChemistOffer) => void;
}

export const SideBySideComparisonModal: React.FC<SideBySideComparisonModalProps> = ({
  isOpen,
  onClose,
  medicine,
  selectedOffers,
  onReserveOffer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95"
        id="side-by-side-comparison-modal"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Side-by-Side Bioequivalent Comparison
                </h3>
                <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {medicine.genericName} {medicine.dosage}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Audited against reference brand: {medicine.brandName} ({medicine.referenceManufacturer})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            id="close-comparison-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table Matrix */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">
                  Attributes
                </th>

                {/* Reference Brand Column */}
                <th className="py-3 px-3 text-xs font-bold text-slate-700 bg-slate-50/80 rounded-t-xl w-1/4 border-x border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>{medicine.brandName} (Brand)</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-normal">
                      Baseline
                    </span>
                  </div>
                </th>

                {/* Selected Generic Offers */}
                {selectedOffers.map((offer) => (
                  <th key={offer.id} className="py-3 px-3 text-xs font-bold text-sky-900 bg-sky-50/50 rounded-t-xl border-r border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{offer.productBrandName}</span>
                      {offer.isBestPrice && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                          Best Price
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Row: Dispensing Pharmacy */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-500">Pharmacy & Distance</td>
                <td className="py-3 px-3 bg-slate-50/40 border-x border-slate-200 text-slate-700">
                  Walgreens / Retail Partner
                </td>
                {selectedOffers.map((offer) => (
                  <td key={offer.id} className="py-3 px-3 bg-sky-50/20 border-r border-slate-200 text-slate-900">
                    <div className="font-bold flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-sky-600" />
                      <span className="truncate">{offer.pharmacyName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{offer.distanceMiles} mi away</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Active Chemical Salt */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-500">Active Chemical</td>
                <td className="py-3 px-3 bg-slate-50/40 border-x border-slate-200 font-mono text-[11px] text-slate-700">
                  {medicine.activeChemical}
                </td>
                {selectedOffers.map((offer) => (
                  <td key={offer.id} className="py-3 px-3 bg-sky-50/20 border-r border-slate-200 font-mono text-[11px] text-emerald-800">
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>{medicine.activeChemical}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Bioequivalence Rating */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-500">FDA Bioequivalence</td>
                <td className="py-3 px-3 bg-slate-50/40 border-x border-slate-200 text-slate-700">
                  Innovator Reference (RLD)
                </td>
                {selectedOffers.map((offer) => (
                  <td key={offer.id} className="py-3 px-3 bg-sky-50/20 border-r border-slate-200 font-semibold text-sky-800">
                    {offer.bioequivalenceRating}
                  </td>
                ))}
              </tr>

              {/* Row: Manufacturer & Standards */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-500">Manufacturer & Quality</td>
                <td className="py-3 px-3 bg-slate-50/40 border-x border-slate-200 text-slate-700">
                  {medicine.referenceManufacturer}
                </td>
                {selectedOffers.map((offer) => (
                  <td key={offer.id} className="py-3 px-3 bg-sky-50/20 border-r border-slate-200 text-slate-700">
                    <div className="font-semibold text-slate-900">{offer.manufacturer}</div>
                    <div className="text-[11px] text-slate-500">{offer.certification}</div>
                  </td>
                ))}
              </tr>

              {/* Row: Unit Price Per Tablet */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-500">Unit Price / Tab</td>
                <td className="py-3 px-3 bg-slate-50/40 border-x border-slate-200 font-bold text-slate-700 tabular-nums">
                  ₹{(medicine.brandAvgPrice / medicine.defaultPackCount).toFixed(2)} / tab
                </td>
                {selectedOffers.map((offer) => (
                  <td key={offer.id} className="py-3 px-3 bg-sky-50/20 border-r border-slate-200 font-bold text-emerald-700 tabular-nums">
                    ₹{offer.perTabletPrice.toFixed(2)} / tab
                  </td>
                ))}
              </tr>

              {/* Row: Pack Total Price */}
              <tr className="bg-slate-50/30">
                <td className="py-3 px-3 font-bold text-slate-900">Total Pack Price ({medicine.defaultPackCount} count)</td>
                <td className="py-3 px-3 bg-slate-100/70 border-x border-slate-200 font-extrabold text-base text-slate-500 tabular-nums">
                  ₹{medicine.brandAvgPrice.toFixed(2)}
                </td>
                {selectedOffers.map((offer) => (
                  <td key={offer.id} className="py-3 px-3 bg-emerald-50/50 border-r border-slate-200 font-extrabold text-base text-slate-900 tabular-nums">
                    <div className="flex items-center gap-2">
                      <span>₹{offer.price.toFixed(2)}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {offer.discountPercent}% OFF
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: 1-Year Projected Savings */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-500">1-Year Savings (4 refills)</td>
                <td className="py-3 px-3 bg-slate-50/40 border-x border-slate-200 text-slate-400">
                  ₹0.00
                </td>
                {selectedOffers.map((offer) => {
                  const yearlySave = (medicine.brandAvgPrice - offer.price) * 4;
                  return (
                    <td key={offer.id} className="py-3 px-3 bg-sky-50/20 border-r border-slate-200 font-bold text-emerald-700 tabular-nums">
                      +₹{yearlySave.toFixed(2)} saved
                    </td>
                  );
                })}
              </tr>

              {/* Action Row */}
              <tr>
                <td className="py-4 px-3 font-semibold text-slate-500">Dispensing Action</td>
                <td className="py-4 px-3 bg-slate-50/40 border-x border-slate-200 text-slate-400 text-xs">
                  Reference Standard
                </td>
                {selectedOffers.map((offer) => (
                  <td key={offer.id} className="py-4 px-3 bg-sky-50/20 border-r border-slate-200">
                    <button
                      onClick={() => {
                        onReserveOffer(offer);
                        onClose();
                      }}
                      className="w-full py-2 px-3 bg-[#006398] hover:bg-[#004f7a] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
                      id={`comparison-reserve-btn-${offer.id}`}
                    >
                      <span>Reserve (₹{offer.price.toFixed(2)})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>AB therapeutic equivalence confirms bioequivalence by the US-FDA Orange Book standards.</span>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
