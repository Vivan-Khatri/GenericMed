import React, { useState } from 'react';
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
import { 
  MEDICINES, 
  CHEMIST_OFFERS, 
  NEARBY_CHEMISTS, 
  INITIAL_RESERVATIONS, 
  INITIAL_AUDIT_LOGS,
  LOCATIONS 
} from './data/mockData';
import { PortalRole, ActiveTab, Medicine, ChemistOffer, Reservation, AuditLogEntry, ChemistStore } from './types';

export default function App() {
  // Navigation & Role State
  const [currentPortal, setCurrentPortal] = useState<PortalRole>('customer');
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].name);

  // Data State
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINES);
  const [offers, setOffers] = useState<ChemistOffer[]>(CHEMIST_OFFERS);
  const [chemists, setChemists] = useState<ChemistStore[]>(NEARBY_CHEMISTS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [savedMedicineIds, setSavedMedicineIds] = useState<string[]>(['atorvastatin-20', 'metformin-1000']);

  // Selection & Modal States
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('atorvastatin-20');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [comparingOfferIds, setComparingOfferIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [reservingOffer, setReservingOffer] = useState<ChemistOffer | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected Medicine & Offers lookup
  const currentMedicine = medicines.find((m) => m.id === selectedMedicineId) || medicines[0];
  const currentOffers = offers.filter((o) => o.medicineId === currentMedicine.id);

  // Handlers
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
    setReservingOffer(offer);
  };

  const handleConfirmReservation = (newReservation: Reservation) => {
    setReservations((prev) => [newReservation, ...prev]);
    showToast(`Reservation ${newReservation.reservationCode} created for ${newReservation.medicineName}`);
  };

  const handleRemoveReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    showToast('Reservation cancelled');
  };

  const handleRemoveSavedMedicine = (id: string) => {
    setSavedMedicineIds((prev) => prev.filter((mId) => mId !== id));
  };

  const handleUpdateChemistOffer = (offerId: string, newPrice: number, inStock: boolean) => {
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
            updatedMinutesAgo: 1,
          };
        }
        return o;
      })
    );

    // Also append to audit logs
    const newLog: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Chemist (Apollo Metro)',
      actorRole: 'Chemist Partner',
      action: 'UPDATE_LISTING_PRICE',
      targetObject: `Offer ${offerId}`,
      changeSummary: `Price adjusted to ₹${newPrice.toFixed(2)} (Stock: ${inStock ? 'In Stock' : 'Out'})`,
      severity: 'info',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleCallPharmacy = (phone: string, name: string) => {
    showToast(`Dialing ${name} at ${phone}...`);
  };

  const handleGetDirections = (name: string, address: string) => {
    showToast(`Opening turn-by-turn navigation to ${name} (${address})`);
  };

  const savedMedicinesList = medicines.filter((m) => savedMedicineIds.includes(m.id));

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 flex flex-col">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentPortal={currentPortal}
        onPortalChange={setCurrentPortal}
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
      />

      {/* Primary Content Router based on Portal & Tabs */}
      <main className="flex-1">
        {currentPortal === 'chemist' ? (
          <ChemistPortal
            offers={offers}
            medicines={medicines}
            reservations={reservations}
            onUpdateOfferPrice={handleUpdateChemistOffer}
            onBackToCustomer={() => setCurrentPortal('customer')}
          />
        ) : currentPortal === 'admin' ? (
          <AdminModerationPortal
            auditLogs={auditLogs}
            chemists={chemists}
            medicines={medicines}
            onBackToCustomer={() => setCurrentPortal('customer')}
            onApproveAuditAction={(id) => showToast(`Audit item ${id} verified.`)}
          />
        ) : (
          /* Customer Portal Views */
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

            {activeTab === 'compare' && (
              <SearchResultsScreen
                medicine={currentMedicine}
                offers={currentOffers}
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
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation for Customer Portal */}
      {currentPortal === 'customer' && (
        <BottomNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          savedCount={reservations.length}
        />
      )}

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc.name);
          showToast(`Search district updated to ${loc.name}`);
        }}
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
        medicine={currentMedicine}
        selectedOffers={offers.filter((o) => comparingOfferIds.includes(o.id))}
        onReserveOffer={handleReserveOffer}
      />

      <ReserveModal
        isOpen={Boolean(reservingOffer)}
        onClose={() => setReservingOffer(null)}
        offer={reservingOffer}
        medicine={currentMedicine}
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
    </div>
  );
}
