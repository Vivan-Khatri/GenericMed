import express from 'express';
import { Reservation } from '../models/index.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    const data = await Reservation.find({ userId: req.params.userId }).sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user reservations' });
  }
});

router.get('/chemist/:chemistId', async (req, res) => {
  try {
    const data = await Reservation.find({ pharmacyId: req.params.chemistId }).sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chemist reservations' });
  }
});

router.post('/', async (req, res) => {
  try {
    const reservationCode = `GM-${Math.floor(1000 + Math.random() * 9000)}-NY`;
    const newReservation = new Reservation({
      ...req.body,
      id: `res-${Date.now()}`,
      reservationCode,
      status: 'Active',
      timestamp: 'Just now',
      expiresAt: 'Tomorrow, same time'
    });
    await newReservation.save();
    res.json(newReservation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findOne({ id: req.params.id });
    if (!reservation) return res.status(404).json({ error: 'Not found' });
    
    reservation.status = status;
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ id: req.params.id });
    if (!reservation) return res.status(404).json({ error: 'Not found' });
    
    reservation.status = 'Cancelled';
    await reservation.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

export default router;
