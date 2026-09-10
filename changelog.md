# 📦 GenericMed — Changelog

## [1.0.0] — 2026-11-01

### Added
- **Multi-City Expansion** — Added support for multiple cities including Chicago, Los Angeles, and Austin in the Location district selector.
- **Admin Analytics & Moderation** — Built out the Platform Analytics view with traffic charts and conversion metrics. Added "Suspend Partner" functionality for immediate action against bad actors.
- **Pharmacist Chat** — Introduced a real-time messaging interface between customers and pharmacists, accessible from both the Customer Saved Screen and Chemist Reservation Inbox.
- **Localization (i18n)** — Added full Spanish (`es`) translation support and a language toggle in the Profile Preferences.
- **Third-Party API Management** — Added a "Public API Keys" section to the Admin portal for generating and revoking access keys for pharmacy chain integrations.
- **Insurance Coverage Checker** — Added an Insurance Provider selector to user profiles, dynamically rendering 'Covered' badges and ₹0.00 estimated co-pays on search results.

## [0.8.0] — 2026-10-15

### Added
- **Smart Search & GPS** — Added multi-term fuzzy matching for medicine search. Integrated browser Geolocation API (`navigator.geolocation`) to auto-detect user location and precisely calculate distance to pharmacies using the Haversine formula.
- **Price History & Trends** — Added 4-month historical price data to medicines. Implemented a pure SVG/CSS sparkline chart in `SearchResultsScreen` to visualize trends with rising/falling/stable indicator badges.
- **Home Delivery Options** — Enhanced `ReserveModal` to allow users to choose between 'Store Pickup' and 'Home Delivery' (including estimated 45-60 min ETA and address capture). Updated Chemist `ReservationInbox` with "Mark Out for Delivery" and "Mark Delivered" actions.
- **Prescription Management** — Added a new "My Prescriptions" section to the user `ProfileScreen`, featuring simulated Rx image uploads and status tracking (Pending Review, Verified, Rejected).
- **UI Enhancements** — Added advanced sorting (by price, distance, freshness, and pharmacy rating) and directional (asc/desc) toggles to `SearchResultsScreen`. Updated `SavedScreen` to clearly differentiate delivery tracking from pickup tokens.

---

> All notable changes to GenericMed are documented in this file.
> Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
> Versioning follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

---

## [Unreleased]

> Changes staged for the next release.

### Planned
- Phase 2: Chemist onboarding, bulk inventory CSV upload, push notifications, revenue analytics

---

## [0.6.0] — 2026-09-09

### Added
- **`AuthContext` (`src/context/AuthContext.tsx`)** — React Context providing `user`, `userRole`, `chemistId`, `isAuthenticated` state; `login`, `signup`, `logout` actions backed by Supabase Auth; session persists across reloads via localStorage
- **`AuthModal` (`src/components/AuthModal.tsx`)** — Full-screen overlay auth modal with:
  - Login / Sign Up tabs
  - Role selector (`Customer` / `Chemist Partner`) on Sign Up
  - One-click demo account login cards for all three roles
  - Password visibility toggle, error & success states, loading spinner
- **`ErrorBoundary` (`src/components/ErrorBoundary.tsx`)** — React class component wrapping all three portals; catches render errors and shows a friendly recovery card (fixes KI-007)
- **Supabase integration** — `@supabase/supabase-js` added; `src/lib/supabase.ts` singleton with graceful fallback when env vars are absent
- **5 API modules** replacing mock data initializations:
  - `src/api/medicines.ts` — `fetchMedicines()`, `fetchMedicineById()`
  - `src/api/offers.ts` — `fetchAllOffers()`, `fetchOffersByMedicine()`, `updateOffer()`
  - `src/api/chemists.ts` — `fetchChemists()`
  - `src/api/reservations.ts` — `fetchUserReservations()`, `createReservation()`, `cancelReservation()`
  - `src/api/auditLogs.ts` — `fetchAuditLogs()`, `appendAuditLog()`
- **QR Code on Reservation** — `qrcode.react` (`<QRCodeSVG>`) renders a real scannable QR code after reservation confirmation, replacing the decorative barcode placeholder (fixes previous KI)
- **Real-time Price Freshness** — `App.tsx` polls `fetchAllOffers()` every 60 seconds; `updatedMinutesAgo` computed from real DB `updated_at` timestamps (fixes KI-002)
- **Database SQL scripts** in `supabase/`:
  - `migrations/001_initial_schema.sql` — Full schema with RLS policies for all tables
  - `seeds/seed.sql` — Converts all mock data to INSERT statements for initial DB population
- **Auth-aware `Header`** — Shows user initials + role badge when logged in, "Sign In" button when not; portal switcher shows lock icon for restricted portals and prompts login when role is insufficient
- **Global loading state** — Full-screen loading spinner while core data fetches on first mount
- **Error recovery banner** — Amber banner shown if data fetch fails, with one-click Retry
- **`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`** added to `.env.example` with setup instructions

### Changed
- `App.tsx` — Rewrapped in `<AuthProvider>`; data layer replaced with async API calls; `handleReserveOffer` gated behind authentication check; portal switching enforces role access
- `Header.tsx` — Auth-aware with user dropdown (email, role badge, Sign Out); portal switcher loop-rendered from array; lock icon on restricted portals
- `ReserveModal.tsx` — Real `<QRCodeSVG>` replacing decorative barcode bars
- `tsconfig.json` — Added `"types": ["vite/client"]` for `import.meta.env` TypeScript support
- All three portals (`ChemistPortal`, `AdminModerationPortal`, customer tabs) wrapped in `<ErrorBoundary>`

### Fixed
- **KI-002** — `updatedMinutesAgo` now computed from real DB timestamps, not static mock values
- **KI-007** — Error boundaries wrap all portal components preventing full-app crashes


## [0.5.0] — 2026-09-08

### Added
- **`AdminModerationPortal`** — Full admin portal with:
  - Audit log viewer with severity-coded badges (`info`, `warning`, `danger`, `success`)
  - Chemist partner registry with verification status
  - Medicine catalogue browser for admins
- **`ChemistPortal`** — Chemist partner portal with:
  - Offer listing management (view all offers by medicine)
  - Inline price and stock update form
  - Reservation inbox view
  - Audit trail: every price update appends a new entry to `INITIAL_AUDIT_LOGS`
- **`AuditLogEntry` type** in `src/types.ts` with fields: `id`, `timestamp`, `actor`, `actorRole`, `action`, `targetObject`, `changeSummary`, `severity`
- **`handleUpdateChemistOffer`** handler in `App.tsx` — updates offer price/stock and appends audit log entry
- **Portal switcher** in `Header` component — dropdown to switch between Customer, Chemist, and Admin portals

### Changed
- `App.tsx` now manages `auditLogs` and `chemists` state in addition to existing state
- `Header` component expanded with portal role switcher UI

---

## [0.4.0] — 2026-09-07

### Added
- **`MapModal`** — Nearby chemist map view with:
  - Simulated map grid (placeholder for real map library)
  - Chemist cards with distance, status badge (`Open Now`, `Drive-Thru`, `Open 24 Hours`, `Closing Soon`), and price freshness indicator
  - "Select" action to filter offers by chosen chemist
- **`NEARBY_CHEMISTS` mock data** in `mockData.ts` with `ChemistStore` entries for 4 NYC pharmacies including lat/lng coordinates
- **`ChemistStore` type** in `src/types.ts`
- **`onOpenMapView` prop** wired from `ExploreScreen` → `App.tsx` → `MapModal`

### Fixed
- `isMapModalOpen` state correctly initialized to `false` in `App.tsx`
- Location display in `ExploreScreen` now reflects `selectedLocation` from app state

---

## [0.3.0] — 2026-09-06

### Added
- **`ScanRxModal`** — AI-powered prescription scanner with:
  - File upload input (image or PDF) and text input fallback
  - Google Gemini API integration via `@google/genai` SDK
  - Parsed medicine name list linked to search results
  - Loading spinner and error state handling
- **`@google/genai` v2.4.0** added to dependencies
- **`GEMINI_API_KEY`** environment variable documented in `.env.example`
- **`SideBySideComparisonModal`** — Compare 2 chemist offers in a side-by-side table:
  - Price, per-tablet price, manufacturer, certification, bioequivalence rating
  - Rating and review count
  - Distance and home delivery availability
  - Reserve button per offer
- **Checkbox selection** on `SearchResultsScreen` offer cards to select offers for comparison
- **`comparingOfferIds` state** and **`isComparisonModalOpen` state** in `App.tsx`

### Changed
- `SearchResultsScreen` now accepts `onOpenSideBySideModal` prop
- Offer cards show a comparison checkbox when 1+ offer is selected

---

## [0.2.0] — 2026-09-05

### Added
- **`ReserveModal`** — Reservation confirmation flow with:
  - Medicine summary, pharmacy details, price and savings breakdown
  - Auto-generated `GM-XXXX-NY` reservation code
  - 24-hour expiry timestamp
  - Confirm and Cancel actions
- **`Reservation` type** in `src/types.ts`
- **`INITIAL_RESERVATIONS` mock data** with one pre-existing reservation (`GM-4821-NY`)
- **`SavedScreen`** — Two-tab screen (Reservations / Saved Medicines) with:
  - Reservation cards showing code, status badge, pharmacy, expiry, price, and cancel action
  - Saved medicine cards with "View Offers" link back to compare screen
- **`handleConfirmReservation`** and **`handleRemoveReservation`** handlers in `App.tsx`
- **`handleRemoveSavedMedicine`** handler in `App.tsx`
- **Toast notification system** — `showToast(msg)` in `App.tsx` with 3.5s auto-dismiss
- **Express.js backend** scaffold (`express`, `dotenv` dependencies added)
- **`.env.example`** created with `GEMINI_API_KEY` and `APP_URL` placeholders

### Changed
- `BottomNavigation` `savedCount` badge now shows `reservations.length` from app state
- `App.tsx` now manages `savedMedicineIds` as separate state

### Fixed
- `selectedMedicineId` initialized to `'atorvastatin-20'` to ensure `SearchResultsScreen` has a valid medicine on first render

---

## [0.1.0] — 2026-09-03

### Added
- **Project initialized** with Vite 6 + React 19 + TypeScript ~5.8
- **TailwindCSS v4** via `@tailwindcss/vite` plugin
- **`lucide-react` v0.546.0** as the icon library
- **`motion` v12.23.24** (Framer Motion standalone) for animations
- **`src/types.ts`** with initial type definitions:
  - `Medicine` — full branded/generic medicine data model
  - `ChemistOffer` — pharmacy offer with pricing, stock, and logistics data
  - `ActiveTab` — `'explore' | 'compare' | 'saved' | 'profile'`
  - `PortalRole` / `AppPortal` — `'customer' | 'chemist' | 'admin'`
- **`src/data/mockData.ts`** with:
  - `MEDICINES` — 5 medicines (Atorvastatin, Metformin, Azithromycin, Escitalopram, Amlodipine)
  - `CHEMIST_OFFERS` — 4 offers for Atorvastatin-20 across 4 pharmacies
  - `LOCATIONS` / `AVAILABLE_LOCATIONS` — 5 NYC metro area district options
- **`App.tsx`** — Root component with multi-portal state orchestration
- **`Header`** — App header with GenericMed branding and location display
- **`ExploreScreen`** — Landing screen with:
  - Hero section with savings callout
  - Therapeutic category filter tabs
  - Medicine card grid (brand vs. generic price comparison)
  - Nearby chemist strip with call and directions actions
  - Scan Rx floating action button
- **`SearchResultsScreen`** — Offer comparison screen with:
  - Medicine detail header (generic name, dosage, therapeutic class)
  - Chemist offer cards (price, per-tablet, distance, stock, delivery, rating, ready time)
  - "Best Price" badge on lowest-priced offer
- **`BottomNavigation`** — 4-tab bottom nav for Customer portal
- **`LocationModal`** — Location district selection modal
- **`ProfileScreen`** — Basic user profile and settings screen
- **`.gitignore`** configured to exclude `node_modules/`, `dist/`, `.env`
- **`vite.config.ts`** with `@tailwindcss/vite` and `@vitejs/plugin-react` plugins

---

## Versioning Guide

| Version Bump | When to Use |
|---|---|
| `PATCH` (0.1.**x**) | Bug fixes, typo corrections, minor style adjustments |
| `MINOR` (0.**x**.0) | New features, new components, new pages — backwards compatible |
| `MAJOR` (**x**.0.0) | Breaking changes, major architectural shifts, database migrations |

---

*Last updated: 2026-09-09 | Update this file with every merge to `main`.*
