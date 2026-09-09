import { supabase } from '../lib/supabase';
import { Medicine } from '../types';
import { MEDICINES } from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabase';

/** Map Supabase snake_case row → Medicine camelCase interface */
function rowToMedicine(row: Record<string, unknown>): Medicine {
  return {
    id:                   row.id as string,
    brandName:            row.brand_name as string,
    genericName:          row.generic_name as string,
    activeChemical:       row.active_chemical as string,
    dosage:               row.dosage as string,
    form:                 row.form as string,
    defaultPackCount:     row.default_pack_count as number,
    therapeuticClass:     row.therapeutic_class as string,
    brandAvgPrice:        Number(row.brand_avg_price),
    lowestGenericPrice:   Number(row.lowest_generic_price),
    discountPercentage:   row.discount_percentage as number,
    savingsPerFill:       Number(row.savings_per_fill),
    pharmacyCount:        row.pharmacy_count as number,
    referenceDrug:        row.reference_drug as string,
    referenceManufacturer: row.reference_manufacturer as string,
  };
}

export async function fetchMedicines(): Promise<Medicine[]> {
  if (!isSupabaseConfigured()) return MEDICINES;

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .order('generic_name', { ascending: true });

  if (error) {
    console.error('[medicines] fetchMedicines error:', error.message);
    return MEDICINES;
  }

  return (data ?? []).map(rowToMedicine);
}

export async function fetchMedicineById(id: string): Promise<Medicine | null> {
  if (!isSupabaseConfigured()) {
    return MEDICINES.find((m) => m.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[medicines] fetchMedicineById error:', error.message);
    return MEDICINES.find((m) => m.id === id) ?? null;
  }

  return data ? rowToMedicine(data) : null;
}
