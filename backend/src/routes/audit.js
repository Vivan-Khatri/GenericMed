import express from 'express';
import { AuditLog } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await AuditLog.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newLog = new AuditLog({
      ...req.body,
      id: `aud-${Date.now()}`,
      timestamp: 'Just now'
    });
    await newLog.save();
    res.json(newLog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to append audit log' });
  }
});

export default router;
