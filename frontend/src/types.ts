export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  activeChemical: string;
  dosage: string;
  form: string;
  defaultPackCount: number;
  therapeuticClass: string;
  brandAvgPrice: number;
  lowestGenericPrice: number;
  discountPercentage: number;
  savingsPerFill: number;
  pharmacyCount: number;
  referenceDrug: string;
  referenceManufacturer: string;
  priceHistory?: { date: string; price: number }[];
}

export interface ChemistOffer {
  id: string;
  medicineId: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  distanceMiles: number;
  openHours: string;
  phone: string;
  productBrandName: string;
  manufacturer: string;
  certification: string;
  price: number;
  originalPrice: number;
  perTabletPrice: number;
  packCount: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  bioequivalenceRating: string; // e.g. "Generic AB Rated"
  inStock: boolean;
  hasHomeDelivery: boolean;
  is24Hours: boolean;
  readyTime: string; // e.g. "Ready in 30m"
  updatedMinutesAgo: number;
  isBestPrice?: boolean;
  imageUrl: string;
  offerNumber?: number;
}

export interface ChemistStore {
  id: string;
  name: string;
  address: string;
  distanceMiles: number;
  status: 'Open Now' | 'Drive-Thru' | 'Open 24 Hours' | 'Closing Soon';
  priceFreshnessMinutes: number;
  phone: string;
  verified: boolean;
  lat: number;
  lng: number;
  onboardingStatus?: 'pending' | 'approved' | 'suspended';
  licenseNumber?: string;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  userId?: string;         // MongoDB backend: link to user
  offerId?: string;        // MongoDB backend: link to chemist offer
  medicineName: string;
  genericName: string;
  pharmacyName: string;
  pharmacyAddress: string;
  phone: string;
  price: number;
  originalPrice: number;
  savings: number;
  packCount: number;
  timestamp: string;
  expiresAt: string;
  status: 'Active' | 'Ready for Pickup' | 'Completed' | 'Cancelled' | 'Out for Delivery' | 'Delivered';
  deliveryType?: 'pickup' | 'delivery';
  deliveryAddress?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'System' | 'Admin' | 'Chemist Partner' | 'Compliance Officer';
  action: string;
  targetObject: string;
  changeSummary: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export type ActiveTab = 'explore' | 'compare' | 'saved' | 'profile';
export type AppPortal = 'customer' | 'chemist' | 'admin';
export type PortalRole = AppPortal;
export type ChemistOnboardingStatus = 'pending' | 'approved' | 'suspended';

export interface NotificationEvent {
  id: string;
  chemistId: string;
  type: 'new_reservation' | 'reservation_cancelled' | 'price_audit';
  title: string;
  message: string;
  reservationCode?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DailyReservationStat {
  date: string;      // e.g. 'Mon', 'Tue'
  fullDate: string;  // e.g. '2026-09-09'
  count: number;
  revenue: number;
}

export interface ReservationAnalytics {
  totalToday: number;
  totalThisWeek: number;
  totalThisMonth: number;
  completedCount: number;
  activeCount: number;
  cancelledCount: number;
  conversionRate: number;  // completed / (completed + cancelled) * 100
  topMedicines: { name: string; count: number }[];
  totalRevenueSaved: number;
  dailyStats: DailyReservationStat[];
  avgPrice: number;
}

export interface ChemistOnboardingRequest {
  id: string;
  storeName: string;
  address: string;
  phone: string;
  licenseNumber: string;
  deaNumber?: string;
  ownerName: string;
  email: string;
  status: ChemistOnboardingStatus;
  submittedAt: string;
}

export interface Prescription {
  id: string;
  userId: string;
  imageUrl: string;
  uploadedAt: string;
  status: 'pending_review' | 'verified' | 'rejected';
  notes?: string;
}

