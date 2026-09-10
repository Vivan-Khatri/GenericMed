import { ChemistOffer } from '../types';
import { CHEMIST_OFFERS } from '../data/mockData';

export async function fetchAllOffers(): Promise<ChemistOffer[]> {
  try {
    const res = await fetch('/api/offers');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[offers API] Backend unavailable, using mock data.');
    return CHEMIST_OFFERS;
  }
}

export async function updateOffer(id: string, price: number, inStock: boolean): Promise<void> {
  try {
    const res = await fetch(`/api/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, inStock })
    });
    if (!res.ok) throw new Error('Failed to update offer');
  } catch (err) {
    console.warn('[offers API] Backend unavailable. Offer updated locally only.');
  }
}
