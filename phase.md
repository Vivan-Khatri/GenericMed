# 🗺️ GenericMed — Development Phases

> This document outlines the structured development lifecycle of GenericMed. Each phase represents a self-contained milestone with clear goals, deliverables, and a definition of done. Use this file alongside [`memory.md`](./memory.md) and [`changelog.md`](./changelog.md) to track overall project progress.

---

## Phase Index

| Phase | Title | Status | Version |
|-------|-------|--------|---------|
| [Phase 0](#phase-0--foundation--prototype) | Foundation & Prototype | ✅ Complete | `0.1.0 – 0.5.0` |
| [Phase 1](#phase-1--auth--real-data) | Auth & Real Data | 🔄 In Progress | `0.6.0` |
| [Phase 2](#phase-2--chemist-partner-dashboard) | Chemist Partner Dashboard | 🔲 Planned | `0.7.0` |
| [Phase 3](#phase-3--consumer-growth-features) | Consumer Growth Features | 🔲 Planned | `0.8.0` |
| [Phase 4](#phase-4--platform-expansion) | Platform Expansion | 🔲 Planned | `1.0.0` |

---

## Phase 0 — Foundation & Prototype

> **Goal:** Stand up the full GenericMed UI prototype with all three portals working against mock data, establishing the architecture and design system before any backend work begins.

- **Status:** ✅ Complete
- **Versions Covered:** `0.1.0` → `0.5.0`
- **Dates:** 2026-09-01 → 2026-09-08

### Deliverables

#### 🏗️ Infrastructure & Architecture
- [x] Project initialized — Vite 6 + React 19 + TypeScript ~5.8
- [x] TailwindCSS v4 via `@tailwindcss/vite` plugin
- [x] `lucide-react` v0.546.0 as the sole icon library
- [x] `motion` v12.23.24 (Framer Motion successor) for animations
- [x] Fully typed data models in `src/types.ts`
- [x] Mock data layer in `src/data/mockData.ts`
- [x] Express.js backend scaffold (Gemini API proxy only)
- [x] `.env.example` with all required variable names
- [x] Multi-portal role switching via `Header` component

#### 👤 Customer Portal
- [x] **Explore Screen** — Hero banner, category filters, medicine card grid with savings callouts
- [x] **Medicine Detail / Compare Screen** — Full medicine info, chemist offer cards (pricing, distance, stock, delivery)
- [x] **Side-by-Side Comparison Modal** — Select up to 2 offers and compare in a table
- [x] **Reserve Modal** — Generates `GM-XXXX-NY` reservation code with 24hr expiry
- [x] **Saved Screen** — Active reservations and saved medicines list
- [x] **Profile Screen** — Location settings, notification preferences, app settings
- [x] **Location Modal** — Switch search district (5 NYC area locations)
- [x] **Map Modal** — View nearby chemists on a simulated map
- [x] **Scan Rx Modal** — Gemini AI parses prescription images/text to medicine names
- [x] **Toast Notifications** — 3.5s ephemeral confirmation toasts for all key actions
- [x] **Bottom Navigation** — 4-tab nav: Explore, Compare, Saved, Profile

#### 🧪 Chemist Portal
- [x] **Offer Management** — View all listings; update price and stock status inline
- [x] **Reservation Management** — View incoming reservations with status and customer info
- [x] **Audit Trail** — Every price change appended to the audit log

#### 🛡️ Admin Portal
- [x] **Audit Log Viewer** — Chronological log with severity badges
- [x] **Chemist Management** — View all partner chemists with verification status
- [x] **Medicine Registry View** — Browse the full medicine catalogue

### Definition of Done
All three portals are fully navigable in the browser against mock data. No real authentication or database is required.

---

## Phase 1 — Auth & Real Data

> **Goal:** Replace the mock data layer with a real backend API and database, and introduce authentication so that portal access is properly gated per user role.

- **Status:** 🔄 In Progress
- **Target Version:** `0.6.0`

### Deliverables

#### 🔐 User Authentication
- [ ] JWT-based login/signup for customers and chemist partners
- [ ] React Context for `AuthState` (current user, role, token)
- [ ] Protected routes — Chemist and Admin portals gated by role
- [ ] Auth persistence via `localStorage` / `sessionStorage`

#### 🗄️ Database (PostgreSQL / Supabase)
- [ ] Provision PostgreSQL instance (or Supabase project)
- [ ] Run migrations for all tables: `medicines`, `chemist_stores`, `chemist_offers`, `reservations`, `audit_logs`, `users`
- [ ] Seed database with current mock data

#### 🌐 Real REST API (Express.js)
- [ ] `GET /api/medicines` — Fetch all medicines (paginated)
- [ ] `GET /api/medicines/:id` — Fetch single medicine
- [ ] `GET /api/offers?medicineId=` — Fetch offers for a medicine
- [ ] `GET /api/chemists` — Fetch nearby chemists
- [ ] `POST /api/reservations` — Create a new reservation
- [ ] `GET /api/reservations/:code` — Get reservation by code
- [ ] `PATCH /api/reservations/:id/cancel` — Cancel a reservation
- [ ] `POST /api/auth/login` — Customer/chemist login
- [ ] `POST /api/auth/signup` — Customer registration
- [ ] `GET /api/admin/audit-logs` — Fetch audit log (admin only)
- [ ] `PATCH /api/chemist/offers/:id` — Update offer price and stock

#### 🔧 Frontend Integration
- [ ] Replace `src/data/mockData.ts` initializations in `App.tsx` with API fetch calls
- [ ] Add loading and error states to all data-fetching screens
- [ ] Add error boundaries around portal components (fixes KI-007)

#### 🎯 Enhancements
- [ ] **QR Code on Reservation** — Generate a scannable QR code on the reservation confirmation screen
- [ ] **Real-time Price Freshness** — WebSocket or polling to show when prices were last updated (fixes KI-002)

### Definition of Done
Any user can sign up, log in, and access only their respective portal. All data is persisted in a real database and served via Express REST APIs. Mock data layer is removed.

---

## Phase 2 — Chemist Partner Dashboard

> **Goal:** Upgrade the Chemist portal from a basic management view into a full self-service partner platform with onboarding, bulk operations, and revenue analytics.

- **Status:** 🔲 Planned
- **Target Version:** `0.7.0`

### Deliverables

#### 🏪 Chemist Onboarding Flow
- [ ] Self-service partner registration screen
- [ ] License number input and verification step
- [ ] Admin approval workflow before activation

#### 📦 Inventory Management
- [ ] Bulk inventory update via CSV upload
- [ ] Per-medicine stock level management
- [ ] Low-stock alert configuration

#### 🔔 Reservation Inbox & Notifications
- [ ] Real-time reservation inbox (WebSocket or polling)
- [ ] Push notifications — alert chemist when a reservation is made
- [ ] Ability to mark reservation as "Ready for Pickup" from the portal

#### 📊 Revenue Analytics
- [ ] Total reservations dashboard (daily / weekly / monthly)
- [ ] Conversion rate: reservations → completed pickups
- [ ] Top medicines by reservation volume
- [ ] Price competitiveness indicator vs. nearby pharmacies

### Definition of Done
A new chemist partner can self-register, upload inventory, receive real-time reservation alerts, and view basic revenue metrics — all without admin manual intervention.

---

## Phase 3 — Consumer Growth Features

> **Goal:** Improve the customer discovery and engagement experience with smarter search, price history, delivery, and prescription management features.

- **Status:** 🔲 Planned
- **Target Version:** `0.8.0`

### Deliverables

#### 🔍 Smart Search
- [ ] **Medicine Search Autocomplete** — Typeahead with fuzzy matching on generic/brand name
- [ ] **Filter & Sort in Search Results** — Filter by distance, price, delivery, rating; sort ascending/descending
- [ ] **GPS-based Distance** — Calculate real `distanceMiles` from user's GPS location (fixes KI-006)

#### 📈 Price History
- [ ] Price history chart per medicine (line graph across time)
- [ ] Price trend badge (↑ rising / ↓ falling / → stable)

#### 🏠 Home Delivery
- [ ] End-to-end delivery booking flow for chemists that support it
- [ ] Delivery address input and estimated delivery time display
- [ ] Delivery status tracking screen

#### 📋 Prescription Management
- [ ] Prescription upload history saved to user profile
- [ ] Past Rx scans viewable in the Profile screen
- [ ] Re-trigger search from a saved Rx scan

#### 🏥 Insurance Coverage Checker
- [ ] Input insurance provider / plan
- [ ] Display whether the generic alternative is covered and at what co-pay

### Definition of Done
Customers can find medicines faster via autocomplete and filters, see price trends over time, book home delivery, and manage their prescription history from their profile.

---

## Phase 4 — Platform Expansion

> **Goal:** Scale GenericMed beyond NYC, build the mobile app, open a third-party integration API, and add moderation tooling for Admins.

- **Status:** 🔲 Planned
- **Target Version:** `1.0.0`

### Deliverables

#### 🛡️ Admin Analytics & Moderation
- [ ] **Admin Analytics Dashboard** — Price trend graphs, partner activity summaries, city-level heatmaps
- [ ] **Suspicious Pricing Detection** — Automated flagging for price spikes above threshold
- [ ] **Chemist Suspension Flow** — Admin can suspend/unsuspend a partner account

#### 🌎 Multi-City Expansion
- [ ] Expand location database beyond NYC metro area
- [ ] City selector on the Explore screen
- [ ] Geo-routed API queries (lat/lng-based chemist fetching) for any US city

#### 📱 Mobile App (React Native)
- [ ] iOS and Android native shell using the same core business logic
- [ ] Shared TypeScript types and API client between web and mobile
- [ ] Push notifications via FCM / APNs
- [ ] Native camera integration for Scan Rx (replaces file upload)

#### 🔌 Third-Party Integration API
- [ ] Public REST API for pharmacy chain integrations
- [ ] API key management for third-party partners
- [ ] Webhook support for real-time inventory updates from partner systems

#### 💬 Pharmacist Chat
- [ ] In-app messaging thread between customer and chemist partner
- [ ] Message notifications in chemist reservation inbox
- [ ] Chat history stored per reservation

#### 🌐 Localization
- [ ] Spanish (`es`) localization for NYC demographic
- [ ] `i18n` integration (e.g., `react-i18next`)
- [ ] Language toggle in the Profile screen

### Definition of Done
GenericMed is live in at least 3 US cities, has a published iOS/Android app, offers a documented public API for pharmacy chains, and supports English + Spanish.

---

## Known Issues Tracker

> Open issues relevant across phases. See [`memory.md §8`](./memory.md) for full details.

| ID | Issue | Phase to Fix | Severity |
|----|-------|-------------|----------|
| KI-001 | Portal switching is unrestricted (no auth gating) | Phase 1 | 🔴 High |
| KI-002 | `updatedMinutesAgo` is a static field — not real-time | Phase 1 | 🟡 Medium |
| KI-003 | Map modal shows a static placeholder — no real map library | Phase 3 | 🟡 Medium |
| KI-004 | `ScanRxModal` fails silently if `GEMINI_API_KEY` is not set | Phase 1 | 🔴 High |
| KI-005 | Reservation expiry countdown is display-only — no enforcement | Phase 1 | 🟡 Medium |
| KI-006 | `distanceMiles` is hardcoded — not from real GPS | Phase 3 | 🟢 Low |
| KI-007 | No error boundary wrapping portal components | Phase 1 | 🟡 Medium |
| KI-008 | `handleCallPharmacy` / `handleGetDirections` are stub toasts only | Phase 3 | 🟢 Low |

---

*Last updated: 2026-09-09 | Update this file whenever a phase is started, a deliverable is completed, or the roadmap changes.*
