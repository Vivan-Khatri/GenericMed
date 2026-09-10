import { Medicine } from '../types';
import { MEDICINES } from '../data/mockData';

export async function fetchMedicines(): Promise<Medicine[]> {
  try {
    const res = await fetch('/api/medicines');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[medicines API] Backend unavailable, using mock data.');
    return MEDICINES;
  }
}

export async function fetchMedicineById(id: string): Promise<Medicine | null> {
  try {
    const res = await fetch(`/api/medicines/${id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[medicines API] Backend unavailable, using mock data.');
    return MEDICINES.find((m) => m.id === id) ?? null;
  }
}
