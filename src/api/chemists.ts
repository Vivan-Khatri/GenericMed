import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ChemistStore } from '../types';
import { NEARBY_CHEMISTS } from '../data/mockData';

function rowToChemistStore(row: Record<string, unknown>): ChemistStore {
  return {
    id:                   row.id as string,
    name:                 row.name as string,
    address:              row.address as string,
    distanceMiles:        Number(row.distance_miles),
    status:               row.status as ChemistStore['status'],
    priceFreshnessMinutes: row.price_freshness_minutes as number,
    phone:                row.phone as string,
    verified:             row.verified as boolean,
    lat:                  Number(row.lat),
    lng:                  Number(row.lng),
  };
}

export async function fetchChemists(): Promise<ChemistStore[]> {
  if (!isSupabaseConfigured()) return NEARBY_CHEMISTS;

  const { data, error } = await supabase
    .from('chemist_stores')
    .select('*')
    .order('distance_miles', { ascending: true });

  if (error) {
    console.error('[chemists] fetchChemists error:', error.message);
    return NEARBY_CHEMISTS;
  }

  return (data ?? []).map(rowToChemistStore);
}
