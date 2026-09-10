import React, { useState, useEffect } from 'react';
import { Store, ArrowLeft, Check, Bell, BellRing, UserCheck } from 'lucide-react';
import { ChemistOffer, Medicine, Reservation, ChemistStore, ChemistOnboardingStatus, NotificationEvent } from '../types';
import { useAuth } from '../context/AuthContext';
import { ChemistOnboardingFlow } from './ChemistOnboardingFlow';
import { ChemistAnalyticsDashboard } from './ChemistAnalyticsDashboard';
import { BulkInventoryUpload } from './BulkInventoryUpload';
import { ReservationInbox } from './ReservationInbox';
import { fetchUnreadNotifications, markNotificationsRead } from '../api/notifications';

interface ChemistPortalProps {
  offers: ChemistOffer[];
  medicines: Medicine[];
  reservations: Reservation[];
  store?: ChemistStore;
  onUpdateOfferPrice: (offerId: string, newPrice: number, inStock: boolean) => void;
  onUpdateReservationStatus: (id: string, status: Reservation['status']) => void;
  onBackToCustomer: () => void;
}

type Tab = 'listings' | 'reservations' | 'analytics' | 'import';

export const ChemistPortal: React.FC<ChemistPortalProps> = ({
  offers,
  medicines,
  reservations,
  store,
  onUpdateOfferPrice,
  onUpdateReservationStatus,
  onBackToCustomer,
}) => {
  const { user, userRole, chemistId } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const [onboardingStatus, setOnboardingStatus] = useState<ChemistOnboardingStatus | undefined>(store?.onboardingStatus);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Form State for listing edit
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Sync initial onboarding status from store
  useEffect(() => {
    if (store?.onboardingStatus) {
      setOnboardingStatus(store.onboardingStatus);
    } else if (userRole === 'admin') {
      // Admins bypass onboarding
      setOnboardingStatus('approved');
    }
  }, [store?.onboardingStatus, userRole]);

  // Polling for notifications & reservations (every 15s)
  useEffect(() => {
    if (onboardingStatus !== 'approved' || !chemistId) return;

    const poll = async () => {
      const unread = await fetchUnreadNotifications(chemistId);
      setNotifications(unread);
    };

    poll();
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [onboardingStatus, chemistId]);

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

  const handleMarkNotificationsRead = async () => {
    if (notifications.length === 0) return;
    const ids = notifications.map(n => n.id);
    setNotifications([]);
    await markNotificationsRead(ids);
  };

  // ── Onboarding Gate ──────────────────────────────────────────────────────────
  if (onboardingStatus !== 'approved') {
    return (
      <div className="bg-slate-50 min-h-screen">
        <ChemistOnboardingFlow 
          currentStatus={onboardingStatus} 
          onStatusChange={setOnboardingStatus} 
        />
      </div>
    );
  }

  // ── Full Portal ─────────────────────────────────────────────────────────────
  return (
    <div className="pb-28 space-y-4 px-4 pt-3 max-w-5xl mx-auto">
      {/* Portal Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Chemist Partner Console
            </span>
            <span className="text-emerald-300 text-xs">• {store?.name || 'Your Store'}</span>
          </div>
          <button
            onClick={onBackToCustomer}
            className="flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white bg-emerald-800/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Live Dispensing & Price Sync
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Manage local inventory, pricing feeds, and patient holds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-800/80 px-3 py-1.5 rounded-xl text-center">
              <div className="text-[10px] text-emerald-300">Listings</div>
              <div className="text-sm font-extrabold">{offers.length}</div>
            </div>
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (showNotifications) handleMarkNotificationsRead();
                }}
                className={`p-2.5 rounded-xl transition-colors relative ${
                  notifications.length > 0 ? 'bg-emerald-700 text-white animate-pulse' : 'bg-emerald-800/80 text-emerald-200 hover:text-white'
                }`}
              >
                {notifications.length > 0 ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-emerald-900">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={handleMarkNotificationsRead} className="text-[10px] font-semibold text-emerald-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No new notifications.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{n.title}</div>
                            <div className="text-[11px] text-slate-600">{n.message}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
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
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 hide-scrollbar">
        {(['listings', 'import', 'reservations', 'analytics'] as Tab[]).map((tab) => {
          const labels: Record<Tab, string> = {
            listings: `Active Listings (${offers.length})`,
            import: 'Bulk Import CSV',
            reservations: `Inbox (${reservations.filter(r => r.status === 'Active').length} New)`,
            analytics: 'Revenue Dashboard',
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'listings' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
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
        )}

        {activeTab === 'import' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <BulkInventoryUpload 
              chemistId={chemistId || store?.id || ''} 
              onUploadSuccess={() => {
                setSaveSuccessMessage('Bulk inventory updated successfully!');
                setTimeout(() => setSaveSuccessMessage(null), 3000);
                setActiveTab('listings');
              }} 
            />
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <ReservationInbox 
              reservations={reservations} 
              onUpdateStatus={onUpdateReservationStatus} 
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <ChemistAnalyticsDashboard chemistId={chemistId || store?.id || ''} />
          </div>
        )}
      </div>
    </div>
  );
};
