-- ============================================================
-- GenericMed — Seed Data
-- Run AFTER 001_initial_schema.sql in the Supabase SQL Editor
-- ============================================================

-- Medicines
insert into medicines (id, brand_name, generic_name, active_chemical, dosage, form, default_pack_count, therapeutic_class, brand_avg_price, lowest_generic_price, discount_percentage, savings_per_fill, pharmacy_count, reference_drug, reference_manufacturer) values
('atorvastatin-20',  'Lipitor',     'Atorvastatin',          'Atorvastatin Calcium Trihydrate', '20mg',   'Tablet', 90, 'Cardiovascular', 485.00, 42.00, 89, 443.00, 14, 'Lipitor® (Pfizer Original)',           'Pfizer Inc.'),
('metformin-1000',   'Glucophage',  'Metformin Hydrochloride','Metformin Hydrochloride',          '1000mg', 'Tablet', 60, 'Diabetes',       350.00, 65.00, 81, 285.00,  9, 'Glucophage® (Bristol-Myers Squibb)', 'Bristol-Myers Squibb'),
('azithromycin-500', 'Zithromax',   'Azithromycin',           'Azithromycin Dihydrate',           '500mg',  'Tablet',  6, 'Chronic Care',   478.00,158.00, 67, 320.00, 18, 'Zithromax® (Pfizer Original)',        'Pfizer Inc.'),
('escitalopram-10',  'Lexapro',     'Escitalopram',           'Escitalopram Oxalate',             '10mg',   'Tablet', 30, 'Chronic Care',   420.00, 51.00, 88, 369.00, 12, 'Lexapro® (Allergan/Forest)',          'Allergan Inc.'),
('amlodipine-5',     'Norvasc',     'Amlodipine',             'Amlodipine Besylate',              '5mg',    'Tablet', 30, 'Cardiovascular', 380.00, 41.00, 89, 339.00, 15, 'Norvasc® (Pfizer)',                   'Pfizer Inc.')
on conflict (id) do nothing;

-- Chemist Stores
insert into chemist_stores (id, name, address, distance_miles, status, price_freshness_minutes, phone, verified, lat, lng) values
('apollo-metro',        'Apollo Pharmacy Metro Hub',     '142 Court St • 0.4 mi away',   0.4, 'Open Now',      15, '+1 (718) 555-0142', true, 40.6908, -73.9922),
('citysquare-247',      'CitySquare 24/7 Dispensary',    '410 Fulton St • 1.2 mi away',  1.2, 'Open 24 Hours', 25, '+1 (718) 555-0410', true, 40.6914, -73.9840),
('medlife-chemists',    'MedLife Chemists',              '284 Atlantic Ave • 1.8 mi away',1.8, 'Open Now',      42, '+1 (718) 555-0284', true, 40.6891, -73.9875),
('brooklyn-heights',    'Brooklyn Care Pharmacy',        '55 Clark St • 0.6 mi away',    0.6, 'Open Now',       8, '+1 (718) 555-0055', true, 40.6970, -73.9935)
on conflict (id) do nothing;

-- Chemist Offers (Atorvastatin 20mg)
insert into chemist_offers (id, medicine_id, pharmacy_id, pharmacy_name, pharmacy_address, distance_miles, open_hours, phone, product_brand_name, manufacturer, certification, price, original_price, per_tablet_price, pack_count, discount_percent, rating, review_count, bioequivalence_rating, in_stock, has_home_delivery, is_24_hours, ready_time, is_best_price, offer_number, image_url) values
('offer-1', 'atorvastatin-20', 'apollo-metro',     'Apollo Pharmacy Metro Hub',   '142 Court St • 0.4 mi away',   0.4, 'Open till 10 PM', '+1 (718) 555-0142', 'Atorlip 20',         'Cipla Ltd',          'WHO-GMP Certified',         42.00, 485.00, 0.47, 90, 89, 4.9, 328, 'Generic AB Rated', true,  false, false, 'Ready in 30m', true,  1, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'),
('offer-2', 'atorvastatin-20', 'citysquare-247',   'CitySquare 24/7 Dispensary',  '410 Fulton St • 1.2 mi away',  1.2, 'Open 24 Hours',   '+1 (718) 555-0410', 'Storvas 20',         'Sun Pharma',         'US-FDA Compliant',          51.00, 485.00, 0.57, 90, 88, 4.8, 194, 'Generic AB Rated', true,  true,  true,  'Ready in 45m', false, 2, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&auto=format&fit=crop&q=80'),
('offer-3', 'atorvastatin-20', 'medlife-chemists', 'MedLife Chemists',            '284 Atlantic Ave • 1.8 mi away',1.8, 'Open till 9 PM',  '+1 (718) 555-0284', 'Atorvastatin Teva',  'Teva Pharm',         'FDA Audited Bioequivalent', 65.00, 485.00, 0.72, 90, 86, 4.7, 142, 'Generic AB Rated', true,  true,  false, 'Ready in 15m', false, 3, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'),
('offer-4', 'atorvastatin-20', 'brooklyn-heights', 'Brooklyn Care Pharmacy',      '55 Clark St • 0.6 mi away',    0.6, 'Open till 8 PM',  '+1 (718) 555-0055', 'Torvast 20',         'Viatris Laboratories','cGMP Verified',             54.00, 485.00, 0.60, 90, 89, 4.9,  88, 'Generic AB Rated', true,  false, false, 'Ready in 20m', false, 4, 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?w=300&auto=format&fit=crop&q=80')
on conflict (id) do nothing;

-- Audit Logs (initial seed)
insert into audit_logs (id, actor, actor_role, action, target_object, change_summary, severity, created_at) values
(gen_random_uuid(), 'Compliance Officer (auditor_44)', 'Compliance Officer', 'PRICE_AUDIT_VERIFIED',      'Apollo Pharmacy Metro Hub (Listing #3901)',    'Atorlip 20 price $42.00/90 tabs confirmed against wholesaler invoice #CI-9921', 'success', now() - interval '12 hours'),
(gen_random_uuid(), 'Apollo Pharmacy Metro Hub (partner_14)', 'Chemist Partner', 'INVENTORY_STOCK_REFRESH', 'Atorlip 20mg (Tablet, 90s)',                  'Stock count updated: 42 units in stock; dispensing queue active',               'info',    now() - interval '13 hours'),
(gen_random_uuid(), 'System Algorithmic Monitor',       'System',             'PRICE_SPIKE_FLAGGED',        'Listing #2208 (Metformin 500mg)',             'Triggered warning: +34% price divergence from district mean. Escalated to queue.','warning', now() - interval '15 hours'),
(gen_random_uuid(), 'Admin Moderator (lead_admin)',     'Admin',              'PARTNER_ONBOARDING_APPROVED','CitySquare 24/7 Dispensary (Partner #8812)', 'Verified state pharmacy license #NY-PH-88910 and DEA certification.',           'success', now() - interval '17 hours')
on conflict do nothing;
