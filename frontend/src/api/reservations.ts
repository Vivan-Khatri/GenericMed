import { Reservation } from '../types';
import { INITIAL_RESERVATIONS } from '../data/mockData';

export async function fetchUserReservations(userId: string): Promise<Reservation[]> {
  try {
    const res = await fetch(`/api/reservations/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[reservations API] Backend unavailable, using mock data.');
    return INITIAL_RESERVATIONS.filter((r) => r.userId === userId);
  }
}

export async function fetchChemistReservations(chemistId: string): Promise<Reservation[]> {
  try {
    const res = await fetch(`/api/reservations/chemist/${chemistId}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[reservations API] Backend unavailable, using mock data.');
    return INITIAL_RESERVATIONS.filter((r) => r.offerId === chemistId);
  }
}

export async function updateReservationStatus(id: string, status: string): Promise<void> {
  try {
    const res = await fetch(`/api/reservations/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update reservation');
  } catch (err) {
    console.warn('[reservations API] Backend unavailable. Status updated locally only.');
  }
}

export async function createReservation(payload: Partial<Reservation>): Promise<Reservation | null> {
  try {
    const res = await fetch(`/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create reservation');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[reservations API] Backend unavailable. Using local reservation creation.');
    return null;
  }
}

export async function cancelReservation(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to cancel reservation');
  } catch (err) {
    console.warn('[reservations API] Backend unavailable. Reservation cancelled locally only.');
  }
}
