import React, { useState } from 'react';
import { Store, ShieldCheck, Check, Clock, Plus, RefreshCw, AlertCircle, TrendingDown, ArrowLeft } from 'lucide-react';
import { ChemistOffer, Medicine, Reservation } from '../types';

interface ChemistPortalProps {
  offers: ChemistOffer[];
  medicines: Medicine[];
  reservations: Reservation[];
  onUpdateOfferPrice: (offerId: string, newPrice: number, inStock: boolean) => void;
  onBackToCustomer: () => void;
}

export const ChemistPortal: React.FC<ChemistPortalProps> = ({
  offers,
  medicines,
  reservations,
  onUpdateOfferPrice,
  onBackToCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'reservations'>('listings');
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const startEdit = (offer: ChemistOffer) => {
    setEditingOfferId(offer.id);
    setEditPrice(offer.price.toString());
    setEditInStock(offer.inStock);
  };

  const handleSave = (offerId: string) => {
    const val = parseFloat(editPrice);
    if (!isNaN(val) && val > 0) {
      onUpdateOfferPrice(offerId, val, editInStock);
      setEditingOfferId(null);
      setSaveSuccessMessage('Listing price updated and verified across network!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="pb-28 space-y-4 px-4 pt-3 max-w-4xl mx-auto">
      {/* Portal Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Chemist Partner Console
            </span>
            <span className="text-emerald-300 text-xs">• Apollo Pharmacy Metro Hub (#NY-9912)</span>
          </div>
          <button
            onClick={onBackToCustomer}
            className="flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white bg-emerald-800/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Live Dispensing & Price Sync
            </h2>
            <p className="text-xs text-emerald-200">
              Manage local bioequivalent medicine inventory, pricing feeds, and patient holds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-emerald-800/80 px-3 py-1.5 rounded-xl text-center">
              <div className="text-[10px] text-emerald-300">Active Listings</div>
              <div className="text-base font-extrabold">{offers.length}</div>
            </div>
            <div className="bg-emerald-800/80 px-3 py-1.5 rounded-xl text-center">
              <div className="text-[10px] text-emerald-300">Open Holds</div>
              <div className="text-base font-extrabold">{reservations.length}</div>
            </div>
          </div>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'listings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Listings & Prices ({offers.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'reservations' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Customer Holds & Reservations ({reservations.length})
        </button>
      </div>

      {activeTab === 'listings' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Click any listing to modify unit price or toggle stock in real time.</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced
            </span>
          </div>

          <div className="space-y-3">
            {offers.map((offer) => {
              const med = medicines.find((m) => m.id === offer.medicineId) || medicines[0];
              const isEditing = editingOfferId === offer.id;

              return (
                <div
                  key={offer.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={offer.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {offer.productBrandName}
                          </span>
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                            {offer.bioequivalenceRating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {med.activeChemical} • {offer.packCount} Tablets
                        </p>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Manufacturer: {offer.manufacturer} ({offer.certification})
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-extrabold text-slate-900">
                        ₹{offer.price.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Brand Ref: ₹{offer.originalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            New Cash Price (₹)
                          </label>
                          <input
                            type="number"
                            step="0.50"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Stock Status
                          </label>
                          <select
                            value={editInStock ? 'true' : 'false'}
                            onChange={(e) => setEditInStock(e.target.value === 'true')}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                          >
                            <option value="true">In Stock (Dispensing)</option>
                            <option value="false">Out of Stock</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingOfferId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(offer.id)}
                          className="px-4 py-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                        >
                          Save & Publish Live
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          offer.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${offer.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {offer.inStock ? 'In Stock (Dispensing)' : 'Out of Stock'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Updated {offer.updatedMinutesAgo}m ago
                        </span>
                      </div>

                      <button
                        onClick={() => startEdit(offer)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors"
                      >
                        Edit Price / Stock
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Holds & Reservations View */
        <div className="space-y-3">
          {reservations.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
              No active customer reservation holds at this moment.
            </div>
          ) : (
            reservations.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {res.reservationCode}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{res.medicineName}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {res.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Customer requested pickup for {res.packCount} count. Price held at ₹{res.price.toFixed(2)}.
                </p>
                <div className="text-[11px] text-slate-400">Created: {res.timestamp}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
