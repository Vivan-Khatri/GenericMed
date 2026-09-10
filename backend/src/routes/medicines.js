import express from 'express';
import { Medicine } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await Medicine.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

export default router;
