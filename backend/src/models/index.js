import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'chemist', 'admin'], default: 'customer' },
  chemistId: { type: String } // if role is chemist
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);

const MedicineSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  brandName: String,
  genericName: String,
  activeChemical: String,
  dosage: String,
  form: String,
  defaultPackCount: Number,
  therapeuticClass: String,
  brandAvgPrice: Number,
  lowestGenericPrice: Number,
  discountPercentage: Number,
  savingsPerFill: Number,
  pharmacyCount: Number,
  referenceDrug: String,
  referenceManufacturer: String,
  priceHistory: [{ date: String, price: Number }]
});

export const Medicine = mongoose.model('Medicine', MedicineSchema);

const ChemistStoreSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  address: String,
  distanceMiles: Number,
  status: String,
  priceFreshnessMinutes: Number,
  phone: String,
  verified: Boolean,
  lat: Number,
  lng: Number
});

export const ChemistStore = mongoose.model('ChemistStore', ChemistStoreSchema);

const ChemistOfferSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  medicineId: String,
  pharmacyId: String,
  pharmacyName: String,
  pharmacyAddress: String,
  distanceMiles: Number,
  openHours: String,
  phone: String,
  productBrandName: String,
  manufacturer: String,
  certification: String,
  price: Number,
  originalPrice: Number,
  perTabletPrice: Number,
  packCount: Number,
  discountPercent: Number,
  rating: Number,
  reviewCount: Number,
  bioequivalenceRating: String,
  inStock: Boolean,
  hasHomeDelivery: Boolean,
  is24Hours: Boolean,
  readyTime: String,
  updatedMinutesAgo: Number,
  isBestPrice: Boolean,
  offerNumber: Number,
  imageUrl: String
});

export const ChemistOffer = mongoose.model('ChemistOffer', ChemistOfferSchema);

const ReservationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  reservationCode: String,
  userId: String,
  offerId: String,
  medicineName: String,
  genericName: String,
  pharmacyName: String,
  pharmacyAddress: String,
  phone: String,
  price: Number,
  originalPrice: Number,
  savings: Number,
  packCount: Number,
  timestamp: String,
  expiresAt: String,
  status: String, // 'Active', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled', 'Delivered'
  deliveryType: String, // 'pickup' or 'delivery'
  deliveryAddress: String
});

export const Reservation = mongoose.model('Reservation', ReservationSchema);

const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: String,
  actor: String,
  actorRole: String,
  action: String,
  targetObject: String,
  changeSummary: String,
  severity: String
});

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
