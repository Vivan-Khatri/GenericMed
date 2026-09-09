import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Reservation } from '../types';
import { INITIAL_RESERVATIONS } from '../data/mockData';

function rowToReservation(row: Record<string, unknown>): Reservation {
  const createdAt = new Date(row.created_at as string);
  const expiresAt = row.expires_at ? new Date(row.expires_at as string) : null;

  const formatDate = (d: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
    if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${time}`;
  };

  return {
    id:               row.id as string,
    reservationCode:  row.reservation_code as string,
    medicineName:     row.medicine_name as string,
    genericName:      row.generic_name as string,
    pharmacyName:     row.pharmacy_name as string,
    pharmacyAddress:  row.pharmacy_address as string,
    phone:            (row.phone as string) || '',
    price:            Number(row.price),
    originalPrice:    Number(row.original_price),
    savings:          Number(row.savings),
    packCount:        row.pack_count as number,
    timestamp:        formatDate(createdAt),
    expiresAt:        expiresAt ? formatDate(expiresAt) : 'N/A',
    status:           row.status as Reservation['status'],
  };
}

export async function fetchUserReservations(userId: string): Promise<Reservation[]> {
  if (!isSupabaseConfigured()) return INITIAL_RESERVATIONS;

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[reservations] fetchUserReservations error:', error.message);
    return INITIAL_RESERVATIONS;
  }

  return (data ?? []).map(rowToReservation);
}

export async function createReservation(params: {
  userId: string;
  offerId: string;
  medicineName: string;
  genericName: string;
  pharmacyName: string;
  pharmacyAddress: string;
  phone: string;
  price: number;
  originalPrice: number;
  savings: number;
  packCount: number;
}): Promise<Reservation | null> {
  const reservationCode = `GM-${Math.floor(1000 + Math.random() * 9000)}-NY`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  if (!isSupabaseConfigured()) {
    // Mock mode — create locally
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const tomorrowTime = tomorrow.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return {
      id: `res-${Date.now()}`,
      reservationCode,
      medicineName:    params.medicineName,
      genericName:     params.genericName,
      pharmacyName:    params.pharmacyName,
      pharmacyAddress: params.pharmacyAddress,
      phone:           params.phone,
      price:           params.price,
      originalPrice:   params.originalPrice,
      savings:         params.savings,
      packCount:       params.packCount,
      timestamp:       `Today, ${time}`,
      expiresAt:       `Tomorrow, ${tomorrowTime}`,
      status:          'Active',
    };
  }

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      reservation_code: reservationCode,
      user_id:         params.userId,
      offer_id:        params.offerId,
      medicine_name:   params.medicineName,
      generic_name:    params.genericName,
      pharmacy_name:   params.pharmacyName,
      pharmacy_address: params.pharmacyAddress,
      phone:           params.phone,
      price:           params.price,
      original_price:  params.originalPrice,
      savings:         params.savings,
      pack_count:      params.packCount,
      status:          'Active',
      expires_at:      expiresAt,
    })
    .select()
    .single();

  if (error) {
    console.error('[reservations] createReservation error:', error.message);
    return null;
  }

  return data ? rowToReservation(data) : null;
}

export async function cancelReservation(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase
    .from('reservations')
    .update({ status: 'Cancelled' })
    .eq('id', id);

  if (error) {
    console.error('[reservations] cancelReservation error:', error.message);
  }
}
