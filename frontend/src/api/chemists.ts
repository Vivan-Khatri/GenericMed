import { ChemistStore } from '../types';
import { NEARBY_CHEMISTS } from '../data/mockData';

export async function fetchChemists(): Promise<ChemistStore[]> {
  try {
    const res = await fetch('/api/chemists');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[chemists API] Backend unavailable, using mock data.');
    return NEARBY_CHEMISTS;
  }
}
