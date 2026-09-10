import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Medicine, ChemistStore, ChemistOffer, AuditLog, Reservation } from './models/index.js';
import { MEDICINES, NEARBY_CHEMISTS, CHEMIST_OFFERS, INITIAL_AUDIT_LOGS, INITIAL_RESERVATIONS } from './data/mockData.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/genericmed';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing
    await Medicine.deleteMany({});
    await ChemistStore.deleteMany({});
    await ChemistOffer.deleteMany({});
    await AuditLog.deleteMany({});
    await Reservation.deleteMany({});
    console.log('[Seed] Cleared existing collections.');

    // Seed
    await Medicine.insertMany(MEDICINES);
    await ChemistStore.insertMany(NEARBY_CHEMISTS);
    await ChemistOffer.insertMany(CHEMIST_OFFERS);
    await AuditLog.insertMany(INITIAL_AUDIT_LOGS);
    await Reservation.insertMany(INITIAL_RESERVATIONS);

    console.log('[Seed] Successfully seeded all data.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding data:', err);
    process.exit(1);
  }
}

seed();
