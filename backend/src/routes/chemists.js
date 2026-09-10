import express from 'express';
import { ChemistStore } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await ChemistStore.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chemists' });
  }
});

export default router;
