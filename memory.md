# 🧠 GenericMed — Project Memory

> This is the long-term memory document for GenericMed. It provides a complete snapshot of the project's current state. AI assistants must read this file at the start of any session to understand where the project stands before suggesting changes or generating code.

---

## 1. Project Overview

**GenericMed** is a consumer-facing web application that helps patients in the USA find affordable generic equivalents of expensive branded medicines at nearby pharmacies. The core value proposition is **price transparency**: users can compare generic medicine prices across multiple chemist/pharmacy partners in their area, then reserve the best price before physically picking up the medicine.

The app serves three user roles:
| Role | Description |
|------|-------------|
| **Customer** | Searches, compares, saves, and reserves generic medicines |
| **Chemist Partner** | Updates inventory, pricing, and manages reservations |
| **Admin** | Moderates partner activity, reviews compliance audit logs |

**Primary market:** USA (prices in USD `$`, pharmacy locations in NYC metro area in mock data).

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Build Tool | Vite | 6.x |
| Frontend Framework | React | 19.x |
| Language | TypeScript | ~5.8 |
| Styling | TailwindCSS | v4.x (via `@tailwindcss/vite`) |
| Icons | lucide-react | 0.546.0 |
| Animations | motion (Framer Motion) | 12.x |
| AI / ML | Google Gemini API (`@google/genai`) | 2.4.0 |
| Backend | Express.js | 4.21.x |
| Environment | dotenv | 17.x |
| Runtime (Server) | Node.js + tsx | — |
| Dev Server Port | 3000 | — |

**No database is currently used.** All data is mock/in-memory.

---

## 3. Features Completed

### Customer Portal
- [x] **Explore Screen** — Hero banner, category filters (All, Cardiovascular, Diabetes, Chronic Care), medicine card grid with savings callouts
- [x] **Medicine Detail / Compare Screen** — Full medicine info, chemist offer cards with pricing, per-tablet price, ratings, distance, stock status, home delivery badge
- [x] **Side-by-Side Comparison Modal** — Select up to 2 offers and compare them in a modal table
- [x] **Reserve Modal** — Confirm reservation with a generated `GM-XXXX-NY` reservation code, 24hr expiry
- [x] **Saved Screen** — View active reservations (with status, expiry, pharmacy info) and saved medicines list
- [x] **Profile Screen** — Location settings, notification preferences, app settings
- [x] **Location Modal** — Switch search district (5 NYC area locations)
- [x] **Map Modal** — View nearby chemists on a simulated map with distance and status badges
- [x] **Scan Rx Modal** — Upload/photograph prescription; Gemini AI parses medicine names and links to generic search
- [x] **Toast Notifications** — Ephemeral 3.5s confirmation toasts for all key actions
- [x] **Bottom Navigation** — 4-tab navigation: Explore, Compare, Saved, Profile

### Chemist Portal
- [x] **Offer Management** — View all listings, update price and stock status inline
- [x] **Reservation Management** — View incoming reservations with status and customer info
- [x] **Audit trail** — All price changes are appended to the audit log visible to Admin

### Admin Portal
- [x] **Audit Log Viewer** — Chronological log with severity badges, actor roles, and action descriptions
- [x] **Chemist Management** — View all partner chemists with verification status
- [x] **Medicine Registry View** — Browse the full medicine catalogue

### Infrastructure
- [x] Multi-portal role switching via `Header` component
- [x] Fully typed data models in `src/types.ts`
- [x] Mock data layer in `src/data/mockData.ts`
- [x] Express.js backend scaffold (for Gemini API proxy)
- [x] `.env.example` with all required variable names

---

## 4. Pending Features

### High Priority
- [ ] **User Authentication** — Login/signup for customers and chemist partners (JWT or session-based)
- [ ] **Real Backend API** — Replace mock data with actual REST API endpoints; Express server currently only proxies Gemini
- [ ] **Real Database** — PostgreSQL or Supabase for medicines, offers, users, reservations
- [ ] **QR Code on Reservation** — Generate a scannable QR code on the reservation confirmation screen
- [ ] **Price History Chart** — Show how a medicine's price has changed over time across partners

### Medium Priority
- [ ] **Push Notifications** — Notify customer when reservation is "Ready for Pickup"
- [ ] **Chemist Onboarding Flow** — Self-service partner registration with license verification step
- [ ] **Medicine Search Autocomplete** — Typeahead search with fuzzy matching
- [ ] **Filter & Sort in Search Results** — Filter by distance, price, delivery, rating; sort by price asc/desc
- [ ] **Prescription Upload History** — Save past Rx scans in user profile
- [ ] **Home Delivery Flow** — End-to-end delivery booking for chemists that support it

### Low Priority / Future
- [ ] **Admin Analytics Dashboard** — Price trend graphs, partner activity summaries
- [ ] **Multi-language Support** — Spanish localization for NYC demographic
- [ ] **Pharmacist Chat** — In-app messaging between customer and chemist
- [ ] **Insurance Integration** — Check if insurance covers the generic alternative
- [ ] **Mobile App (React Native)** — iOS/Android native shell using the same business logic

---

## 5. API Endpoints

> **Current status:** Only the Gemini proxy endpoint exists. All other endpoints are planned for the real backend phase.

### Implemented

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/scan-prescription` | Sends prescription text/image to Gemini API; returns parsed medicine names | No (dev) |

### Planned

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/medicines` | Fetch all medicines (paginated) |
| `GET` | `/api/medicines/:id` | Fetch a single medicine by ID |
| `GET` | `/api/offers?medicineId=` | Fetch all chemist offers for a medicine |
| `GET` | `/api/chemists` | Fetch nearby chemists (with lat/lng query params) |
| `POST` | `/api/reservations` | Create a new reservation |
| `GET` | `/api/reservations/:code` | Get reservation by code |
| `PATCH` | `/api/reservations/:id/cancel` | Cancel a reservation |
| `POST` | `/api/auth/login` | Customer/chemist login |
| `POST` | `/api/auth/signup` | Customer registration |
| `GET` | `/api/admin/audit-logs` | Fetch audit log entries (admin only) |
| `PATCH` | `/api/chemist/offers/:id` | Update offer price and stock |

---

## 6. Database Schema Summary

> **Current status:** No database exists yet. The following schema is the intended design for the PostgreSQL migration.

### `medicines`
```sql
id              TEXT PRIMARY KEY          -- e.g. 'atorvastatin-20'
brand_name      TEXT NOT NULL             -- 'Lipitor'
generic_name    TEXT NOT NULL             -- 'Atorvastatin'
active_chemical TEXT NOT NULL
dosage          TEXT NOT NULL             -- '20mg'
form            TEXT NOT NULL             -- 'Tablet'
pack_count      INTEGER NOT NULL
therapeutic_class TEXT NOT NULL
brand_avg_price NUMERIC(10,2)
reference_drug  TEXT
reference_mfr   TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### `chemist_stores`
```sql
id              TEXT PRIMARY KEY          -- e.g. 'apollo-metro'
name            TEXT NOT NULL
address         TEXT NOT NULL
phone           TEXT
lat             NUMERIC(9,6)
lng             NUMERIC(9,6)
is_verified     BOOLEAN DEFAULT FALSE
license_number  TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### `chemist_offers`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
medicine_id     TEXT REFERENCES medicines(id)
chemist_id      TEXT REFERENCES chemist_stores(id)
product_brand   TEXT NOT NULL             -- Generic brand name (e.g. 'Atorlip 20')
manufacturer    TEXT
certification   TEXT
price           NUMERIC(10,2) NOT NULL
original_price  NUMERIC(10,2)
pack_count      INTEGER
in_stock        BOOLEAN DEFAULT TRUE
has_delivery    BOOLEAN DEFAULT FALSE
is_24h          BOOLEAN DEFAULT FALSE
ready_time_mins INTEGER
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### `reservations`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
reservation_code TEXT UNIQUE NOT NULL     -- 'GM-4821-NY'
user_id         UUID REFERENCES users(id)
offer_id        UUID REFERENCES chemist_offers(id)
medicine_name   TEXT NOT NULL
pharmacy_name   TEXT NOT NULL
price           NUMERIC(10,2) NOT NULL
savings         NUMERIC(10,2)
pack_count      INTEGER
status          TEXT DEFAULT 'Active'     -- Active|Ready for Pickup|Completed|Cancelled
created_at      TIMESTAMPTZ DEFAULT NOW()
expires_at      TIMESTAMPTZ               -- created_at + 24 hours
```

### `audit_logs`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
actor           TEXT NOT NULL
actor_role      TEXT NOT NULL             -- System|Admin|Chemist Partner|Compliance Officer
action          TEXT NOT NULL             -- e.g. PRICE_AUDIT_VERIFIED
target_object   TEXT
change_summary  TEXT
severity        TEXT DEFAULT 'info'       -- info|warning|danger|success
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### `users`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
email           TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL
role            TEXT DEFAULT 'customer'   -- customer|chemist|admin
chemist_id      TEXT REFERENCES chemist_stores(id)  -- null if customer
created_at      TIMESTAMPTZ DEFAULT NOW()
```

---

## 7. Important Business Logic

### Price Discovery
- Prices displayed are **chemist-reported prices**, not negotiated rates.
- The **"Best Price" badge** (`isBestPrice: true`) is awarded to the single lowest-priced in-stock offer for a given medicine.
- `discountPercent` is calculated as: `Math.round(((originalPrice - price) / originalPrice) * 100)`.
- `perTabletPrice` is calculated as: `price / packCount`, rounded to 2 decimal places.
- `savingsPerFill` = `brandAvgPrice - lowestGenericPrice`.

### Reservation Logic
- Reservation codes are generated in the format `GM-{4-digit-random}-NY`.
- Reservations expire **24 hours** after creation.
- When a chemist marks an offer as out-of-stock, any active reservations for that offer should be notified (future: push notification).
- Cancellation is immediate; no refund mechanism exists (no payment taken).

### Audit Log
- Every chemist price update triggers a new `AuditLogEntry` with `action: 'UPDATE_LISTING_PRICE'`.
- System-generated events (price spike detection) use `actorRole: 'System'`.
- Audit logs are append-only — entries must never be deleted or modified.
- Severity levels: `info` (routine), `warning` (anomaly detected), `danger` (critical violation), `success` (verified/approved).

### Portal Access
- **Customer portal** is the default and public-facing.
- **Chemist portal** should be gated by chemist authentication (not yet implemented).
- **Admin portal** should be gated by admin role (not yet implemented).
- Currently, portal switching is unrestricted (demo/prototype mode).

---

## 8. Known Issues

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| KI-001 | Portal switching is unrestricted — any user can access Chemist/Admin portals | High | Open (auth pending) |
| KI-002 | `updatedMinutesAgo` is a static field in mock data — does not update in real time | Medium | By Design (mock phase) |
| KI-003 | Map modal shows static placeholder map — no real map library integrated | Medium | Open |
| KI-004 | `ScanRxModal` Gemini integration may fail silently if `GEMINI_API_KEY` is not set | High | Open |
| KI-005 | Reservation expiry countdown is display-only — no actual expiry enforcement logic | Medium | Open |
| KI-006 | `distanceMiles` values are hardcoded — not calculated from user's real GPS location | Low | By Design (mock phase) |
| KI-007 | No error boundary wrapping portal components — an error in one portal crashes the app | Medium | Open |
| KI-008 | `handleCallPharmacy` and `handleGetDirections` are toast-only stubs — no real action | Low | Open |

---

## 9. Future Roadmap

### Phase 1 — Auth & Real Data (Next Sprint)
- Implement user authentication (JWT, React context for auth state)
- Replace mock data with Express + PostgreSQL API
- Add real-time price freshness indicator (WebSocket or polling)
- Implement QR code on reservation confirmation

### Phase 2 — Chemist Partner Dashboard
- Self-service chemist onboarding with license verification
- Inventory bulk update (CSV upload)
- Reservation inbox with push notifications
- Revenue analytics (total reservations, conversion rate)

### Phase 3 — Consumer Growth Features
- Medicine search autocomplete with fuzzy match
- Prescription history in profile
- Price history chart per medicine
- Home delivery booking flow
- Insurance coverage checker

### Phase 4 — Platform Expansion
- Admin analytics and moderation tools
- Multi-city expansion (beyond NYC)
- Mobile app (React Native, shared business logic)
- API for third-party pharmacy integrations
- Pharmacist chat feature

---

*Last updated: 2026-09-09 | Update this file whenever a feature is completed, a new issue is found, or the roadmap changes.*
