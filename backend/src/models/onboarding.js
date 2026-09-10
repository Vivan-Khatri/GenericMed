import mongoose from 'mongoose';

const OnboardingRequestSchema = new mongoose.Schema({
  userId: String,
  storeName: String,
  address: String,
  phone: String,
  licenseNumber: String,
  deaNumber: String,
  ownerName: String,
  email: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: String,
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
});

export const OnboardingRequest = mongoose.model('OnboardingRequest', OnboardingRequestSchema);
