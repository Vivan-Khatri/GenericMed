import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ChemistOffer } from '../types';
import { CHEMIST_OFFERS } from '../data/mockData';

function rowToChemistOffer(row: Record<string, unknown>): ChemistOffer {
  const updatedAt = new Date(row.updated_at as string);
  const now = new Date();
  const updatedMinutesAgo = Math.floor((now.getTime() - updatedAt.getTime()) / 60000);

  return {
    id:                  row.id as string,
    medicineId:          row.medicine_id as string,
    pharmacyId:          row.pharmacy_id as string,
    pharmacyName:        row.pharmacy_name as string,
    pharmacyAddress:     row.pharmacy_address as string,
    distanceMiles:       Number(row.distance_miles),
    openHours:           row.open_hours as string,
    phone:               row.phone as string,
    productBrandName:    row.product_brand_name as string,
    manufacturer:        row.manufacturer as string,
    certification:       row.certification as string,
    price:               Number(row.price),
    originalPrice:       Number(row.original_price),
    perTabletPrice:      Number(row.per_tablet_price),
    packCount:           row.pack_count as number,
    discountPercent:     row.discount_percent as number,
    rating:              Number(row.rating),
    reviewCount:         row.review_count as number,
    bioequivalenceRating: row.bioequivalence_rating as string,
    inStock:             row.in_stock as boolean,
    hasHomeDelivery:     row.has_home_delivery as boolean,
    is24Hours:           row.is_24_hours as boolean,
    readyTime:           row.ready_time as string,
    updatedMinutesAgo,
    isBestPrice:         row.is_best_price as boolean | undefined,
    offerNumber:         row.offer_number as number | undefined,
    imageUrl:            row.image_url as string,
  };
}

export async function fetchOffersByMedicine(medicineId: string): Promise<ChemistOffer[]> {
  if (!isSupabaseConfigured()) {
    return CHEMIST_OFFERS.filter((o) => o.medicineId === medicineId);
  }

  const { data, error } = await supabase
    .from('chemist_offers')
    .select('*')
    .eq('medicine_id', medicineId)
    .order('price', { ascending: true });

  if (error) {
    console.error('[offers] fetchOffersByMedicine error:', error.message);
    return CHEMIST_OFFERS.filter((o) => o.medicineId === medicineId);
  }

  return (data ?? []).map(rowToChemistOffer);
}

export async function fetchAllOffers(): Promise<ChemistOffer[]> {
  if (!isSupabaseConfigured()) return CHEMIST_OFFERS;

  const { data, error } = await supabase
    .from('chemist_offers')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    console.error('[offers] fetchAllOffers error:', error.message);
    return CHEMIST_OFFERS;
  }

  return (data ?? []).map(rowToChemistOffer);
}

export async function updateOffer(
  offerId: string,
  newPrice: number,
  inStock: boolean
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  // Fetch current offer to compute derived fields
  const { data: current, error: fetchErr } = await supabase
    .from('chemist_offers')
    .select('original_price, pack_count')
    .eq('id', offerId)
    .single();

  if (fetchErr || !current) {
    console.error('[offers] updateOffer fetch error:', fetchErr?.message);
    return;
  }

  const discountPercent = Math.round(
    ((current.original_price - newPrice) / current.original_price) * 100
  );
  const perTabletPrice = Number((newPrice / current.pack_count).toFixed(4));

  const { error } = await supabase
    .from('chemist_offers')
    .update({
      price: newPrice,
      in_stock: inStock,
      discount_percent: discountPercent,
      per_tablet_price: perTabletPrice,
      updated_at: new Date().toISOString(),
    })
    .eq('id', offerId);

  if (error) {
    console.error('[offers] updateOffer error:', error.message);
  }
}
