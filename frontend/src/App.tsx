import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ExploreScreen } from './components/ExploreScreen';
import { SearchResultsScreen } from './components/SearchResultsScreen';
import { SavedScreen } from './components/SavedScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { LocationModal } from './components/LocationModal';
import { ScanRxModal } from './components/ScanRxModal';
import { SideBySideComparisonModal } from './components/SideBySideComparisonModal';
import { ReserveModal } from './components/ReserveModal';
import { MapModal } from './components/MapModal';
import { ChemistPortal } from './components/ChemistPortal';
import { AdminModerationPortal } from './components/AdminModerationPortal';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

import { fetchMedicines } from './api/medicines';
import { fetchAllOffers, updateOffer } from './api/offers';
import { fetchChemists } from './api/chemists';
import { fetchUserReservations, fetchChemistReservations, updateReservationStatus, createReservation, cancelReservation } from './api/reservations';
import { fetchAuditLogs, appendAuditLog } from './api/auditLogs';

import { LOCATIONS } from './data/mockData';
import { PortalRole, ActiveTab, Medicine, ChemistOffer, Reservation, AuditLogEntry, ChemistStore, AppPortal } from './types';

// Haversine formula to calculate distance in miles
function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

// ─── Inner App (has access to AuthContext) ────────────────────────────────────
function AppInner() {
  const { user, userRole, isAuthenticated, chemistId } = useAuth();

  // Navigation & Role State
  const [currentPortal, setCurrentPortal] = useState<PortalRole>('customer');
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].name);
  const [insuranceProvider, setInsuranceProvider] = useState<string>('None');

  // Data State
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [offers, setOffers] = useState<ChemistOffer[]>([]);
  const [chemists, setChemists] = useState<ChemistStore[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [savedMedicineIds, setSavedMedicineIds] = useState<string[]>(['atorvastatin-20', 'metformin-1000']);

  // Loading & Error States
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Selection & Modal States
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('atorvastatin-20');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [comparingOfferIds, setComparingOfferIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [reservingOffer, setReservingOffer] = useState<ChemistOffer | null>(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);
  const [pendingPortalChange, setPendingPortalChange] = useState<AppPortal | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // ── Initial Data Load ────────────────────────────────────────────────────────
  const loadCoreData = useCallback(async () => {
    try {
      setIsDataLoading(true);
      setDataError(null);
      const [med, off, chem, logs] = await Promise.all([
        fetchMedicines(),
        fetchAllOffers(),
        fetchChemists(),
        fetchAuditLogs(),
      ]);
      setMedicines(med);
      setOffers(off);
      setChemists(chem);
      setAuditLogs(logs);
    } catch (err) {
      console.error('[App] loadCoreData error:', err);
      setDataError('Failed to load data. Running in offline mode.');
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => { loadCoreData(); }, [loadCoreData]);

  // ── Load user/chemist reservations when auth changes ────────────────────────
  useEffect(() => {
    if (isAuthenticated && user) {
      if (userRole === 'chemist' && chemistId) {
        fetchChemistReservations(chemistId).then(setReservations).catch(console.error);
      } else {
        fetchUserReservations(user.id).then(setReservations).catch(console.error);
      }
    }
  }, [isAuthenticated, user, userRole, chemistId]);

  // ── Complete pending portal change after login ────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && pendingPortalChange) {
      setCurrentPortal(pendingPortalChange);
      setPendingPortalChange(null);
    }
  }, [isAuthenticated, pendingPortalChange]);

  // ── Real-time price freshness: re-fetch offers every 60 seconds ───────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await fetchAllOffers();
        setOffers(fresh);
      } catch { /* silent */ }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Derived Data ─────────────────────────────────────────────────────────────
  const currentMedicine = medicines.find((m) => m.id === selectedMedicineId) || medicines[0];
  const currentOffers = offers.filter((o) => o.medicineId === currentMedicine?.id);
  const savedMedicinesList = medicines.filter((m) => savedMedicineIds.includes(m.id));

  // ── Portal Access Guard ────────────────────────────────────────────────────────
  const handlePortalAccessDenied = (portal: AppPortal) => {
    setPendingPortalChange(portal);
    const roleNeeded = portal === 'admin' ? 'admin' : 'chemist or admin';
    setAuthPromptMessage(`The ${portal} portal requires a ${roleNeeded} account. Please sign in to continue.`);
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handlePortalChange = (portal: PortalRole) => {
    setCurrentPortal(portal);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelectMedicine = (medId: string) => {
    setSelectedMedicineId(medId);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSideBySideModal = (offerIds: string[]) => {
    setComparingOfferIds(offerIds);
    setIsComparisonModalOpen(true);
  };

  const handleReserveOffer = (offer: ChemistOffer) => {
    if (!isAuthenticated) {
      setAuthPromptMessage('Sign in to lock a price and generate your reservation code.');
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      return;
    }
    setReservingOffer(offer);
  };

  const handleConfirmReservation = async (newReservation: Reservation) => {
    if (isAuthenticated && user && currentMedicine) {
      // Attempt to persist to MongoDB via backend
      const saved = await createReservation({
        userId:          user.id,
        offerId:         reservingOffer?.id ?? '',
        medicineName:    newReservation.medicineName,
        genericName:     newReservation.genericName,
        pharmacyName:    newReservation.pharmacyName,
        pharmacyAddress: newReservation.pharmacyAddress,
        phone:           newReservation.phone,
        price:           newReservation.price,
        originalPrice:   newReservation.originalPrice,
        savings:         newReservation.savings,
        packCount:       newReservation.packCount,
      });
      if (saved) {
        setReservations((prev) => [saved, ...prev]);
        showToast(`Reservation ${saved.reservationCode} created for ${saved.medicineName}`);
        return;
      }
    }
    // Fallback: use the locally-generated reservation
    setReservations((prev) => [newReservation, ...prev]);
    showToast(`Reservation ${newReservation.reservationCode} created for ${newReservation.medicineName}`);
  };

  const handleRemoveReservation = async (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    await cancelReservation(id).catch(console.error);
    showToast('Reservation cancelled');
  };

  const handleUpdateReservationStatus = async (id: string, status: Reservation['status']) => {
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    await updateReservationStatus(id, status).catch(console.error);
    showToast(`Reservation marked as ${status}`);
  };

  const handleRemoveSavedMedicine = (id: string) => {
    setSavedMedicineIds((prev) => prev.filter((mId) => mId !== id));
  };

  const handleUpdateChemistOffer = async (offerId: string, newPrice: number, inStock: boolean) => {
    // Optimistic UI update
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) {
          const discount = Math.round(((o.originalPrice - newPrice) / o.originalPrice) * 100);
          return {
            ...o,
            price: newPrice,
            inStock,
            discountPercent: discount,
            perTabletPrice: Number((newPrice / o.packCount).toFixed(2)),
            updatedMinutesAgo: 0,
          };
        }
        return o;
      })
    );

    // Persist to MongoDB via backend
    await updateOffer(offerId, newPrice, inStock).catch(console.error);

    // Append audit log
    const newLog: Omit<AuditLogEntry, 'id' | 'timestamp'> = {
      actor:         user?.email ?? 'Chemist Partner',
      actorRole:     'Chemist Partner',
      action:        'UPDATE_LISTING_PRICE',
      targetObject:  `Offer ${offerId}`,
      changeSummary: `Price adjusted to $${newPrice.toFixed(2)} (Stock: ${inStock ? 'In Stock' : 'Out'})`,
      severity:      'info',
    };
    const localLog: AuditLogEntry = {
      ...newLog,
      id:        `audit-${Date.now()}`,
      timestamp: 'Just now',
    };
    setAuditLogs((prev) => [localLog, ...prev]);
    await appendAuditLog(newLog).catch(console.error);
  };

  const handleCallPharmacy = (phone: string, name: string) => {
    showToast(`Dialing ${name} at ${phone}...`);
  };

  const handleGetDirections = (name: string, address: string) => {
    showToast(`Opening turn-by-turn navigation to ${name} (${address})`);
  };

  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      showToast('Locating...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation('GPS Auto-detect');
          showToast('Location updated via GPS');

          // Recalculate distances for all chemists
          setChemists((prev) => prev.map(chemist => ({
            ...chemist,
            distanceMiles: Number(getDistanceMiles(latitude, longitude, chemist.lat, chemist.lng).toFixed(1))
          })).sort((a, b) => a.distanceMiles - b.distanceMiles));

          // Also update offers' distanceMiles based on their pharmacy's new distance
          setOffers((prevOffers) => prevOffers.map(offer => {
            const chem = chemists.find(c => c.id === offer.pharmacyId);
            if (chem) {
              const newDist = Number(getDistanceMiles(latitude, longitude, chem.lat, chem.lng).toFixed(1));
              return { ...offer, distanceMiles: newDist };
            }
            return offer;
          }));
        },
        (error) => {
          console.error(error);
          showToast('Failed to get GPS location');
        }
      );
    } else {
      showToast('Geolocation is not supported by your browser');
    }
  };

  // ── Loading & Error States ────────────────────────────────────────────────────
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center shadow-md animate-pulse">
          <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transform -rotate-45">
            <div className="w-full h-0.5 bg-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-800 text-sm">Loading GenericMed…</p>
          <p className="text-xs text-slate-500 mt-0.5">Fetching medicines & pharmacies</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 flex flex-col">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Data error banner */}
      {dataError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 text-center font-medium">
          ⚠️ {dataError}{' '}
          <button onClick={loadCoreData} className="underline font-bold hover:text-amber-900">
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        currentPortal={currentPortal}
        onPortalChange={handlePortalChange}
        currentLocation={selectedLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenSearch={() => {
          setCurrentPortal('customer');
          setActiveTab('explore');
        }}
        onOpenProfile={() => {
          setCurrentPortal('customer');
          setActiveTab('profile');
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onPortalAccessDenied={handlePortalAccessDenied}
      />

      {/* Primary Content Router */}
      <main className="flex-1">
        {currentPortal === 'chemist' ? (
          <ErrorBoundary fallbackTitle="Chemist portal error">
            <ChemistPortal
              offers={offers}
              medicines={medicines}
              reservations={reservations}
              store={chemists.find(c => c.id === chemistId)}
              onUpdateOfferPrice={handleUpdateChemistOffer}
              onUpdateReservationStatus={handleUpdateReservationStatus}
              onBackToCustomer={() => setCurrentPortal('customer')}
            />
          </ErrorBoundary>
        ) : currentPortal === 'admin' ? (
          <ErrorBoundary fallbackTitle="Admin portal error">
            <AdminModerationPortal
              auditLogs={auditLogs}
              chemists={chemists}
              medicines={medicines}
              onBackToCustomer={() => setCurrentPortal('customer')}
              onApproveAuditAction={(id) => showToast(`Audit item ${id} verified.`)}
            />
          </ErrorBoundary>
        ) : (
          <ErrorBoundary fallbackTitle="Customer portal error">
            <>
              {activeTab === 'explore' && (
                <ExploreScreen
                  medicines={medicines}
                  nearbyChemists={chemists}
                  onSelectMedicine={handleSelectMedicine}
                  onOpenScanModal={() => setIsScanModalOpen(true)}
                  onOpenMapView={() => setIsMapModalOpen(true)}
                  onCallPharmacy={handleCallPharmacy}
                  onGetDirections={handleGetDirections}
                />
              )}

              {activeTab === 'compare' && currentMedicine && (
                  <SearchResultsScreen
                    medicine={currentMedicine}
                    offers={currentOffers}
                    insuranceProvider={insuranceProvider}
                    onBack={() => setActiveTab('explore')}
                    onReserveOffer={handleReserveOffer}
                    onOpenSideBySideModal={handleOpenSideBySideModal}
                  />
              )}

              {activeTab === 'saved' && (
                <SavedScreen
                  reservations={reservations}
                  savedMedicines={savedMedicinesList}
                  onSelectMedicine={handleSelectMedicine}
                  onRemoveReservation={handleRemoveReservation}
                  onRemoveSavedMedicine={handleRemoveSavedMedicine}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  currentLocation={selectedLocation}
                  insuranceProvider={insuranceProvider}
                  onOpenLocationModal={() => setIsLocationModalOpen(true)}
                  onChangeInsurance={(provider) => {
                    setInsuranceProvider(provider);
                    showToast(`Insurance updated to ${provider}`);
                  }}
                />
              )}
            </>
          </ErrorBoundary>
        )}
      </main>

      {/* Bottom Navigation (customer only) */}
      {currentPortal === 'customer' && (
        <BottomNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          savedCount={reservations.length}
        />
      )}

      {/* ── Modals ── */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          showToast(`Search district updated to ${loc}`);
        }}
        onUseGPS={handleUseGPS}
      />

      <ScanRxModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onSelectMedicine={handleSelectMedicine}
        medicines={medicines}
      />

      <SideBySideComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        medicine={currentMedicine ?? medicines[0]}
        selectedOffers={offers.filter((o) => comparingOfferIds.includes(o.id))}
        onReserveOffer={handleReserveOffer}
      />

      <ReserveModal
        isOpen={Boolean(reservingOffer)}
        onClose={() => setReservingOffer(null)}
        offer={reservingOffer}
        medicine={currentMedicine ?? medicines[0]}
        onConfirmReservation={handleConfirmReservation}
      />

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        chemists={chemists}
        onSelectChemist={(chem) => {
          showToast(`Filtered offers near ${chem.name}`);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthPromptMessage(undefined);
          // Clear pending portal if user dismissed modal
          if (!isAuthenticated) setPendingPortalChange(null);
        }}
        initialTab={authModalTab}
        promptMessage={authPromptMessage}
      />
    </div>
  );
}

// ─── Root App (wraps with AuthProvider) ──────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppInner />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
