# 📋 GenericMed — Decision Log

> This file documents every significant technical and product decision made throughout the development of GenericMed. It serves as the canonical source of truth for **why** the project is built the way it is. AI assistants and collaborators must read this before proposing architectural changes.

---

## Decision Index

| # | Title | Date | Status |
|---|-------|------|--------|
| D-001 | [Use Vite + React + TypeScript as Core Stack](#d-001-use-vite--react--typescript-as-core-stack) | 2026-09-01 | ✅ Adopted |
| D-002 | [Use TailwindCSS v4 for Styling](#d-002-use-tailwindcss-v4-for-styling) | 2026-09-01 | ✅ Adopted |
| D-003 | [Multi-Portal Architecture (Customer / Chemist / Admin)](#d-003-multi-portal-architecture-customer--chemist--admin) | 2026-09-02 | ✅ Adopted |
| D-004 | [Mock Data Layer Before Backend Integration](#d-004-mock-data-layer-before-backend-integration) | 2026-09-02 | ✅ Adopted |
| D-005 | [Google Gemini AI for Prescription Scan Feature](#d-005-google-gemini-ai-for-prescription-scan-feature) | 2026-09-03 | ✅ Adopted |
| D-006 | [Reservation System with Expiry Codes](#d-006-reservation-system-with-expiry-codes) | 2026-09-04 | ✅ Adopted |
| D-007 | [Lucide-React as Sole Icon Library](#d-007-lucide-react-as-sole-icon-library) | 2026-09-01 | ✅ Adopted |
| D-008 | [Motion (Framer Motion Successor) for Animations](#d-008-motion-framer-motion-successor-for-animations) | 2026-09-04 | ✅ Adopted |
| D-009 | [Flat Component Architecture (No Redux/Context)](#d-009-flat-component-architecture-no-reduxcontext) | 2026-09-02 | ✅ Adopted |
| D-010 | [Express.js Backend via Vite Plugin Proxy](#d-010-expressjs-backend-via-vite-plugin-proxy) | 2026-09-05 | ✅ Adopted |

---

## D-001 — Use Vite + React + TypeScript as Core Stack

- **Date:** 2026-09-01
- **Status:** ✅ Adopted

### Context / Problem
GenericMed is a consumer-facing healthcare web app requiring fast iteration, strong type safety (medicine data is sensitive and complex), and a modern developer experience. A framework decision was needed at project inception.

### Decision Taken
Use **Vite 6** as the build tool, **React 19** as the UI library, and **TypeScript ~5.8** as the language.

### Reasoning
- Vite offers near-instant HMR and cold starts — critical for rapid UI prototyping.
- React 19's concurrent features enable smooth list rendering for large pharmacy result sets.
- TypeScript enforces correctness for medical data models (`Medicine`, `ChemistOffer`, `Reservation`) where a wrong field type could display incorrect pricing information.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| Next.js | SSR/SSG overhead not needed for current SPA scope; adds complexity |
| Create React App | Deprecated; slow build times |
| Plain JavaScript | Medical domain requires strict type safety across interfaces |

### Impact on Project
- All source files in `src/` use `.tsx` / `.ts` extensions.
- `tsconfig.json` enforces strict mode.
- `npm run lint` runs `tsc --noEmit` to catch type errors pre-commit.

---

## D-002 — Use TailwindCSS v4 for Styling

- **Date:** 2026-09-01
- **Status:** ✅ Adopted

### Context / Problem
The app requires a consistent, utility-first design system that is fast to iterate on, with support for responsive layouts and component-level styling without CSS conflicts.

### Decision Taken
Use **TailwindCSS v4** via the `@tailwindcss/vite` plugin (not the legacy PostCSS approach).

### Reasoning
- TailwindCSS v4 uses the new Vite-native plugin, reducing build config complexity.
- Utility classes allow rapid UI iteration without context-switching to `.css` files.
- V4's CSS-first configuration allows future design token changes without touching `tailwind.config.js`.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| Vanilla CSS modules | Slower iteration; verbose for component-dense UI |
| Styled Components | Runtime overhead; poor with Vite tree-shaking |
| TailwindCSS v3 | Legacy PostCSS pipeline; v4 is the current standard |

### Impact on Project
- All Tailwind classes are written inline in JSX.
- No `tailwind.config.js` file exists — configuration is handled via `@tailwindcss/vite`.
- `src/index.css` is minimal (Tailwind directives only).

---

## D-003 — Multi-Portal Architecture (Customer / Chemist / Admin)

- **Date:** 2026-09-02
- **Status:** ✅ Adopted

### Context / Problem
GenericMed serves three distinct user roles with entirely different workflows: Customers, Chemist Partners, and Admins. A monolithic view would create an unwieldy component.

### Decision Taken
Implement a **`PortalRole` switcher** in the `Header` component. `App.tsx` renders a different top-level portal component based on `currentPortal` state: `customer` → tab-based navigation; `chemist` → `ChemistPortal`; `admin` → `AdminModerationPortal`.

### Reasoning
- Clean separation of concerns: each portal is a self-contained component.
- Role switching via a header dropdown avoids full routing complexity for the current scope.
- Each portal consumes only the state it needs, passed as props from `App.tsx`.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| React Router with `/admin`, `/chemist` routes | Overkill for current scope |
| Separate deployed apps per role | Too much infrastructure overhead |
| Single component with conditional sections | Creates a bloated, unmaintainable file |

### Impact on Project
- `App.tsx` acts as the state orchestrator; all shared state lives here.
- `PortalRole` type is defined in `src/types.ts`: `'customer' | 'chemist' | 'admin'`.
- Bottom navigation is only rendered for the `customer` portal.

---

## D-004 — Mock Data Layer Before Backend Integration

- **Date:** 2026-09-02
- **Status:** ✅ Adopted

### Context / Problem
Backend APIs are not yet built. UI development must proceed in parallel without a live data source.

### Decision Taken
All data is sourced from `src/data/mockData.ts`, exporting typed arrays: `MEDICINES`, `CHEMIST_OFFERS`, `NEARBY_CHEMISTS`, `INITIAL_RESERVATIONS`, `INITIAL_AUDIT_LOGS`, and `LOCATIONS`.

### Reasoning
- Allows full UI development without backend dependency.
- Mock data matches exact TypeScript interfaces in `src/types.ts`, so swapping to real API calls is a drop-in replacement.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| JSON Server / MSW | Additional dependency; static exports are sufficient |
| Hardcoded data in components | Violates DRY; harder to refactor into API calls |

### Impact on Project
- `src/data/mockData.ts` is the **single source of data truth** until backend is integrated.
- All components receive data via props — no component fetches its own data.
- When backend is added, only `App.tsx` state initialization needs updating.

---

## D-005 — Google Gemini AI for Prescription Scan Feature

- **Date:** 2026-09-03
- **Status:** ✅ Adopted

### Context / Problem
Customers have paper prescriptions or photos and need to quickly find the generic equivalents of listed branded medicines. Manual search is slow and error-prone.

### Decision Taken
Use the **Google Gemini API** (`@google/genai` package) to parse prescription images or text in `ScanRxModal.tsx`. The AI extracts medicine names and maps them to the app's medicine catalogue.

### Reasoning
- Gemini's multimodal capability handles both text and image inputs.
- `GEMINI_API_KEY` is already provisioned via the project's secrets environment.
- `@google/genai v2.4.0` provides a clean SDK with TypeScript support.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| OpenAI GPT-4o Vision | Requires separate API key; not the primary target |
| Tesseract OCR (client-side) | Lower accuracy for handwritten prescriptions |
| Manual search only | Poor UX for the core prescription-to-generic use case |

### Impact on Project
- `GEMINI_API_KEY` must be set in `.env` (see `.env.example`).
- **Never expose `GEMINI_API_KEY` on the client in production** — route through Express backend.
- AI calls are initiated from `ScanRxModal.tsx` via the `@google/genai` SDK.

---

## D-006 — Reservation System with Expiry Codes

- **Date:** 2026-09-04
- **Status:** ✅ Adopted

### Context / Problem
Customers need a way to "hold" a medicine at a specific pharmacy at the quoted price before physically going to pick it up. Without this, the displayed price may no longer be valid on arrival.

### Decision Taken
Implement a **reservation system** with a unique `reservationCode` (format: `GM-XXXX-NY`), a `status` enum (`Active | Ready for Pickup | Completed | Cancelled`), and a 24-hour `expiresAt` timestamp.

### Reasoning
- Reservation codes give customers a tangible confirmation to show the chemist.
- The 24-hour expiry aligns with typical pharmacy holding policies.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| Wishlist only (no reservation) | Does not solve the price-lock problem |
| Full booking with payment | Out of scope; GenericMed is a price discovery tool |
| QR code generation | Nice-to-have; deferred to future roadmap |

### Impact on Project
- `Reservation` interface defined in `src/types.ts`.
- `ReserveModal.tsx` handles reservation creation flow.
- `SavedScreen.tsx` displays and allows cancellation of reservations.

---

## D-007 — Lucide-React as Sole Icon Library

- **Date:** 2026-09-01
- **Status:** ✅ Adopted

### Context / Problem
The app requires consistent, scalable icons across all portal views, modals, and navigation elements.

### Decision Taken
Use **`lucide-react` v0.546.0** as the only icon library. No other icon sets are permitted.

### Reasoning
- Tree-shakeable — only imported icons are bundled.
- Consistent stroke-based SVG style matches the app's clean medical aesthetic.
- Large catalogue covers all needed symbols (medical, navigation, UI).

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| Heroicons | Smaller catalogue |
| Font Awesome (CSS) | Font-based; not tree-shakeable; larger bundle |
| Custom SVGs | High maintenance |

### Impact on Project
- All icons imported as named exports from `lucide-react`.
- Never import entire icon sets — always use specific named imports.

---

## D-008 — Motion (Framer Motion Successor) for Animations

- **Date:** 2026-09-04
- **Status:** ✅ Adopted

### Context / Problem
The app requires smooth entrance/exit animations for modals, toast notifications, and list items to feel polished and premium.

### Decision Taken
Use the **`motion` package v12.23.24** (the new standalone Framer Motion) for declarative animations.

### Reasoning
- `motion` is the direct evolution of `framer-motion` with the same API and a smaller footprint.
- Declarative `animate`, `initial`, `exit` props integrate cleanly with React component lifecycle.
- `AnimatePresence` handles unmounting animations (modal close, toast dismiss) correctly.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| CSS transitions only | Cannot handle unmount animations |
| GSAP | Imperative API; less idiomatic with React |
| React Spring | Different mental model |

### Impact on Project
- Use `motion` components for animated UI elements.
- `AnimatePresence` must wrap conditionally rendered elements needing exit animations.

---

## D-009 — Flat Component Architecture (No Redux/Context)

- **Date:** 2026-09-02
- **Status:** ✅ Adopted

### Context / Problem
State management strategy needed at project start. The app has moderate complexity with shared state (medicines, offers, reservations) used across multiple portals and modals.

### Decision Taken
Use **React `useState` in `App.tsx`** as the sole state container. All shared state is passed down as props. No Redux, Zustand, or React Context is used.

### Reasoning
- The component tree is shallow enough that prop drilling is manageable.
- Avoiding a state library reduces bundle size and cognitive overhead.
- `App.tsx` as the single orchestrator makes data flow explicit and easy to trace.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| React Context API | Adds boilerplate without benefit at current depth |
| Redux Toolkit | Significant overhead; overkill for this scope |
| Zustand | Reasonable alternative, but introduces unnecessary external dependency |

### Impact on Project
- `App.tsx` is the **single state orchestrator**.
- Components are stateless where possible; local state only for UI-only concerns.
- If state complexity grows significantly, migrate to Zustand first.

---

## D-010 — Express.js Backend via Vite Plugin Proxy

- **Date:** 2026-09-05
- **Status:** ✅ Adopted

### Context / Problem
The Gemini API key cannot be safely used from the client side in production. A thin server layer is needed to proxy AI requests without exposing secrets.

### Decision Taken
Use **Express.js** (`express` v4.21.2) as a lightweight API server. In development, Vite proxies `/api` requests to Express. `dotenv` loads secrets from `.env`.

### Reasoning
- Express is minimal and well-understood; no heavy framework needed for a proxy layer.
- `server.js` (compiled via `tsx`) runs alongside Vite in development.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| Serverless functions (Vercel/Netlify) | Deployment platform not yet decided |
| Next.js API routes | Would require migrating the entire frontend |
| Cloudflare Workers | Additional learning curve |

### Impact on Project
- `.env` must define `GEMINI_API_KEY` and `APP_URL` (see `.env.example`).
- API routes are prefixed with `/api/`.
- Never commit `.env` to version control — `.gitignore` already excludes it.

---

*Last updated: 2026-09-09 | Maintained by: Development Team*
