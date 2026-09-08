import React from 'react';
import { Bookmark, Clock, QrCode, Trash2, CheckCircle2, ArrowRight, Store, MapPin } from 'lucide-react';
import { Reservation, Medicine } from '../types';

interface SavedScreenProps {
  reservations: Reservation[];
  savedMedicines: Medicine[];
  onSelectMedicine: (medicineId: string) => void;
  onRemoveReservation: (id: string) => void;
  onRemoveSavedMedicine: (id: string) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  reservations,
  savedMedicines,
  onSelectMedicine,
  onRemoveReservation,
  onRemoveSavedMedicine,
}) => {
  return (
    <div className="pb-28 space-y-4 px-4 pt-3 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Saved & Prescriptions
        </h2>
        <p className="text-xs text-slate-500">
          Your active pharmacy price locks, reservations, and bookmarked generic swaps.
        </p>
      </div>

      {/* Active Reservations Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Active Dispensary Pickups ({reservations.length})
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">24hr Price Lock Active</span>
        </div>

        {reservations.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">No active pharmacy reservations</div>
            <p className="text-[11px] text-slate-400">
              When you reserve a generic offer at any chemist, your pickup token will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs font-bold">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {res.medicineName} ({res.genericName})
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span>{res.pharmacyName}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded-lg">
                    {res.reservationCode}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Locked Cash Price: </span>
                    <span className="font-extrabold text-slate-900">₹{res.price.toFixed(2)}</span>
                    <span className="text-slate-400 line-through text-[10px] ml-1.5">
                      ₹{res.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px]">
                    Saved ₹{res.savings.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-[11px] text-slate-500">
                    Expires: <span className="font-medium text-slate-700">{res.expiresAt}</span>
                  </div>
                  <button
                    onClick={() => onRemoveReservation(res.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Cancel Reservation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Medicines Section */}
      <div className="space-y-2.5 pt-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Bookmarked Equivalents ({savedMedicines.length})
        </span>

        <div className="space-y-2">
          {savedMedicines.map((med) => (
            <div
              key={med.id}
              className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              <div 
                onClick={() => onSelectMedicine(med.id)}
                className="cursor-pointer flex-1 min-w-0"
              >
                <div className="text-xs font-bold text-slate-900 truncate">
                  {med.brandName} {med.dosage} vs <span className="text-sky-700">{med.genericName}</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Salt: {med.activeChemical} • From ₹{med.lowestGenericPrice.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {med.discountPercentage}% OFF
                </span>
                <button
                  onClick={() => onSelectMedicine(med.id)}
                  className="p-1.5 rounded-lg bg-[#006398] text-white hover:bg-[#004f7a]"
                  title="View Offers"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
