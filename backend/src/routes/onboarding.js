import express from 'express';
import { OnboardingRequest } from '../models/onboarding.js';

const router = express.Router();

// Submit a new onboarding request
router.post('/', async (req, res) => {
  try {
    const request = new OnboardingRequest(req.body);
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit onboarding request' });
  }
});

// Get status for a specific user
router.get('/status/:userId', async (req, res) => {
  try {
    const request = await OnboardingRequest.findOne({ userId: req.params.userId }).sort({ submittedAt: -1 });
    if (!request) return res.json({ status: null });
    res.json({ status: request.status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch onboarding status' });
  }
});

// Get all pending requests (admin)
router.get('/pending', async (req, res) => {
  try {
    const requests = await OnboardingRequest.find({ status: 'pending' }).sort({ submittedAt: -1 });
    res.json(requests.map(r => ({
      id: r._id,
      storeName: r.storeName,
      address: r.address,
      phone: r.phone,
      licenseNumber: r.licenseNumber,
      deaNumber: r.deaNumber,
      ownerName: r.ownerName,
      email: r.email,
      status: r.status,
      submittedAt: r.submittedAt,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
});

// Approve a request
router.put('/:id/approve', async (req, res) => {
  try {
    const request = await OnboardingRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', reviewedAt: new Date() },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// Reject a request
router.put('/:id/reject', async (req, res) => {
  try {
    const { notes } = req.body;
    const request = await OnboardingRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', adminNotes: notes ?? null, reviewedAt: new Date() },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

export default router;
