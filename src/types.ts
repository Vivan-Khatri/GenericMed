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
}

export interface Reservation {
  id: string;
  reservationCode: string;
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
  status: 'Active' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
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
