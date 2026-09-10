import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import medicineRoutes from './routes/medicines.js';
import chemistRoutes from './routes/chemists.js';
import offerRoutes from './routes/offers.js';
import reservationRoutes from './routes/reservations.js';
import auditRoutes from './routes/audit.js';
import onboardingRoutes from './routes/onboarding.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/genericmed';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log(`[GenericMed Backend] Connected to MongoDB at ${MONGODB_URI}`))
  .catch(err => console.error('[GenericMed Backend] MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/chemists', chemistRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/onboarding', onboardingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(PORT, () => {
  console.log(`[GenericMed Backend] Server listening on port ${PORT}`);
});
