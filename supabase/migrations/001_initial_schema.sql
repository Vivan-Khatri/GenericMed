-- ============================================================
-- GenericMed — Initial Schema Migration
-- Run this in the Supabase SQL Editor (Database > SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: medicines
-- ============================================================
create table if not exists medicines (
  id                  text primary key,
  brand_name          text not null,
  generic_name        text not null,
  active_chemical     text not null,
  dosage              text not null,
  form                text not null,
  default_pack_count  integer not null,
  therapeutic_class   text not null,
  brand_avg_price     numeric(10,2) not null,
  lowest_generic_price numeric(10,2) not null,
  discount_percentage integer not null,
  savings_per_fill    numeric(10,2) not null,
  pharmacy_count      integer not null default 0,
  reference_drug      text,
  reference_manufacturer text,
  created_at          timestamptz default now()
);

-- ============================================================
-- TABLE: chemist_stores
-- ============================================================
create table if not exists chemist_stores (
  id                      text primary key,
  name                    text not null,
  address                 text not null,
  distance_miles          numeric(6,2) not null,
  status                  text not null check (status in ('Open Now','Drive-Thru','Open 24 Hours','Closing Soon')),
  price_freshness_minutes integer not null default 0,
  phone                   text,
  verified                boolean not null default false,
  lat                     numeric(9,6),
  lng                     numeric(9,6),
  created_at              timestamptz default now()
);

-- ============================================================
-- TABLE: chemist_offers
-- ============================================================
create table if not exists chemist_offers (
  id                   text primary key default gen_random_uuid()::text,
  medicine_id          text not null references medicines(id) on delete cascade,
  pharmacy_id          text not null references chemist_stores(id) on delete cascade,
  pharmacy_name        text not null,
  pharmacy_address     text not null,
  distance_miles       numeric(6,2) not null,
  open_hours           text,
  phone                text,
  product_brand_name   text not null,
  manufacturer         text,
  certification        text,
  price                numeric(10,2) not null,
  original_price       numeric(10,2) not null,
  per_tablet_price     numeric(10,4),
  pack_count           integer not null,
  discount_percent     integer,
  rating               numeric(3,1),
  review_count         integer default 0,
  bioequivalence_rating text,
  in_stock             boolean not null default true,
  has_home_delivery    boolean not null default false,
  is_24_hours          boolean not null default false,
  ready_time           text,
  is_best_price        boolean default false,
  offer_number         integer,
  image_url            text,
  updated_at           timestamptz default now()
);

-- Auto-update updated_at on row change
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_chemist_offers_updated_at on chemist_offers;
create trigger set_chemist_offers_updated_at
  before update on chemist_offers
  for each row execute function update_updated_at_column();

-- ============================================================
-- TABLE: user_profiles (extends Supabase auth.users)
-- ============================================================
create table if not exists user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'customer' check (role in ('customer','chemist','admin')),
  chemist_id  text references chemist_stores(id),
  full_name   text,
  created_at  timestamptz default now()
);

-- Auto-create user_profile on new auth.users signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'role', 'customer'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- TABLE: reservations
-- ============================================================
create table if not exists reservations (
  id                uuid primary key default gen_random_uuid(),
  reservation_code  text unique not null,
  user_id           uuid references auth.users(id),
  offer_id          text references chemist_offers(id),
  medicine_name     text not null,
  generic_name      text not null,
  pharmacy_name     text not null,
  pharmacy_address  text not null,
  phone             text,
  price             numeric(10,2) not null,
  original_price    numeric(10,2) not null,
  savings           numeric(10,2),
  pack_count        integer not null,
  status            text not null default 'Active'
                    check (status in ('Active','Ready for Pickup','Completed','Cancelled')),
  created_at        timestamptz default now(),
  expires_at        timestamptz
);

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
create table if not exists audit_logs (
  id              uuid primary key default gen_random_uuid(),
  actor           text not null,
  actor_role      text not null check (actor_role in ('System','Admin','Chemist Partner','Compliance Officer')),
  action          text not null,
  target_object   text,
  change_summary  text,
  severity        text not null default 'info' check (severity in ('info','warning','danger','success')),
  created_at      timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Medicines: public read
alter table medicines enable row level security;
create policy "Public read medicines" on medicines for select using (true);

-- Chemist stores: public read
alter table chemist_stores enable row level security;
create policy "Public read chemist_stores" on chemist_stores for select using (true);

-- Chemist offers: public read; chemist can update own offers
alter table chemist_offers enable row level security;
create policy "Public read chemist_offers" on chemist_offers for select using (true);
create policy "Chemist update own offers" on chemist_offers for update
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'chemist'
      and user_profiles.chemist_id = chemist_offers.pharmacy_id
    )
  );

-- User profiles: users read/update their own profile
alter table user_profiles enable row level security;
create policy "Users read own profile" on user_profiles for select
  using (auth.uid() = id);
create policy "Users update own profile" on user_profiles for update
  using (auth.uid() = id);

-- Reservations: users see own reservations; chemists see reservations for their store
alter table reservations enable row level security;
create policy "Users read own reservations" on reservations for select
  using (auth.uid() = user_id);
create policy "Users insert own reservations" on reservations for insert
  with check (auth.uid() = user_id);
create policy "Users update own reservations" on reservations for update
  using (auth.uid() = user_id);

-- Audit logs: admin read; insert open (service role for server-side writes)
alter table audit_logs enable row level security;
create policy "Admins read audit_logs" on audit_logs for select
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );
create policy "Authenticated insert audit_logs" on audit_logs for insert
  with check (auth.uid() is not null);
