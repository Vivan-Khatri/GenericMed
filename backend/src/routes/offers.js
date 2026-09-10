import express from 'express';
import { ChemistOffer } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await ChemistOffer.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { price, inStock } = req.body;
    
    const offer = await ChemistOffer.findOne({ id });
    if (!offer) return res.status(404).json({ error: 'Not found' });
    
    offer.price = price;
    offer.inStock = inStock;
    offer.discountPercent = Math.round(((offer.originalPrice - price) / offer.originalPrice) * 100);
    offer.perTabletPrice = Number((price / offer.packCount).toFixed(2));
    offer.updatedMinutesAgo = 0;
    
    await offer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
});

export default router;
