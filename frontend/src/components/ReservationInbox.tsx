import React, { useState } from 'react';
import { Reservation } from '../types';
import { Check, X, Clock, PackageCheck, AlertCircle, MessageCircle } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

interface Props {
  reservations: Reservation[];
  onUpdateStatus: (id: string, status: Reservation['status']) => void;
}

type FilterTab = 'All' | 'Active' | 'In Progress' | 'Completed' | 'Cancelled';

export const ReservationInbox: React.FC<Props> = ({ reservations, onUpdateStatus }) => {
  const [filter, setFilter] = useState<FilterTab>('Active');
  const [activeChatReservation, setActiveChatReservation] = useState<Reservation | null>(null);

  const filtered = reservations.filter(r => {
    if (filter === 'All') return true;
    if (filter === 'In Progress') return r.status === 'Ready for Pickup' || r.status === 'Out for Delivery';
    if (filter === 'Completed') return r.status === 'Completed' || r.status === 'Delivered';
    return r.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Ready for Pickup': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Out for Delivery': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed': 
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {(['All', 'Active', 'In Progress', 'Completed', 'Cancelled'] as FilterTab[]).map(f => {
          const count = reservations.filter(r => {
            if (f === 'All') return true;
            if (f === 'In Progress') return r.status === 'Ready for Pickup' || r.status === 'Out for Delivery';
            if (f === 'Completed') return r.status === 'Completed' || r.status === 'Delivered';
            return r.status === f;
          }).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 ${
                filter === f 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                filter === f ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center text-slate-500">
            <PackageCheck className="w-10 h-10 text-slate-300 mb-3" />
            <div className="text-sm font-semibold text-slate-700">No {filter.toLowerCase()} reservations</div>
            <div className="text-xs mt-1">New reservations will appear here automatically.</div>
          </div>
        ) : (
          filtered.map(res => (
            <div key={res.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 transition-all hover:border-sky-300 relative overflow-hidden">
              
              {/* Highlight bar for new/active */}
              {res.status === 'Active' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
              )}

              <div className="flex items-start justify-between pl-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-extrabold text-slate-900">
                      {res.reservationCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(res.status)} flex items-center gap-1`}>
                      {res.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                      {res.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{res.medicineName}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {res.genericName} • {res.packCount} units
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-700">₹{res.price.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {res.timestamp}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {(res.status === 'Active' || res.status === 'Ready for Pickup' || res.status === 'Out for Delivery') && (
                <div className="pt-3 border-t border-slate-100 flex gap-2 pl-2">
                  {res.status === 'Active' && (
                    <button 
                      onClick={() => onUpdateStatus(res.id, res.deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup')}
                      className="flex-1 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      {res.deliveryType === 'delivery' ? 'Mark Out for Delivery' : 'Mark Ready for Pickup'}
                    </button>
                  )}
                  {res.status === 'Ready for Pickup' && (
                    <button 
                      onClick={() => onUpdateStatus(res.id, 'Completed')}
                      className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Mark Completed
                    </button>
                  )}
                  {res.status === 'Out for Delivery' && (
                    <button 
                      onClick={() => onUpdateStatus(res.id, 'Delivered')}
                      className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Mark Delivered
                    </button>
                  )}
                    <button 
                      onClick={() => onUpdateStatus(res.id, 'Cancelled')}
                      className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                      title="Cancel Reservation"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveChatReservation(res)}
                      className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-600 border border-slate-200 hover:border-sky-200 rounded-lg text-xs font-semibold transition-colors"
                      title="Message Customer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              {/* Customer info */}
              <div className="text-[10px] text-slate-400 pl-2 pt-1 border-t border-slate-100 mt-2 space-y-1">
                <div>
                  Customer Phone: <a href={`tel:${res.phone}`} className="font-semibold text-sky-600 hover:underline">{res.phone || 'Not provided'}</a>
                </div>
                {res.deliveryType === 'delivery' && res.deliveryAddress && (
                  <div>
                    Delivery Address: <span className="font-semibold text-slate-700">{res.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ChatInterface
        isOpen={Boolean(activeChatReservation)}
        onClose={() => setActiveChatReservation(null)}
        reservationId={activeChatReservation?.id || ''}
        currentUserRole="chemist"
        recipientName="Customer"
      />
    </div>
  );
};
