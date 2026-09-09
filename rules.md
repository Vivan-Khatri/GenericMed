# 📐 GenericMed — Project Rules

> This file defines the mandatory rules that **all contributors and AI assistants must follow** throughout the development of GenericMed. These rules are non-negotiable unless a formal decision (recorded in `decisions.md`) overrides them.

---

## Table of Contents

1. [Coding Standards](#1-coding-standards)
2. [Folder Structure Rules](#2-folder-structure-rules)
3. [Naming Conventions](#3-naming-conventions)
4. [UI/UX Consistency Rules](#4-uiux-consistency-rules)
5. [Git Commit Rules](#5-git-commit-rules)
6. [Security & Environment Variable Rules](#6-security--environment-variable-rules)
7. [Stability Rules](#7-stability-rules)

---

## 1. Coding Standards

### TypeScript
- **Strict mode is mandatory.** `tsconfig.json` has `"strict": true`. Never disable it.
- **No `any` types.** Always use specific types or generics. If the type is truly unknown, use `unknown` and narrow it explicitly.
- **All interfaces live in `src/types.ts`.** Do not define types inline inside component files unless they are prop-only types for that specific component.
- **Use named exports** for all components, hooks, and utilities. Default exports are only used in `App.tsx` (Vite convention).
- **No implicit returns** from functions that should return a value.
- **Always type function parameters and return values** for public-facing functions and handlers.

```typescript
// ✅ Correct
const handleSelectMedicine = (medId: string): void => { ... };

// ❌ Wrong
const handleSelectMedicine = (medId) => { ... };
```

### React
- **Functional components only.** No class components.
- **Never mutate state directly.** Always use the setter from `useState`.
- **No inline arrow functions in JSX for expensive operations.** Extract handlers to named functions in the component body.
- **Keys in lists must be stable and unique IDs**, never array indices.

```tsx
// ✅ Correct
{medicines.map((med) => <MedicineCard key={med.id} ... />)}

// ❌ Wrong
{medicines.map((med, i) => <MedicineCard key={i} ... />)}
```

- **Keep components focused.** A component should do one thing. If a component exceeds ~200 lines, consider breaking it up.

### Imports
- **Group imports** in this order, separated by a blank line:
  1. React and React-related (`react`, `react-dom`)
  2. Third-party libraries (`lucide-react`, `motion`, etc.)
  3. Local components (`./components/...`)
  4. Local types (`./types`, `../types`)
  5. Local data (`./data/...`)
- **No default wildcard imports** (`import * as X from ...`).

---

## 2. Folder Structure Rules

```
GenericMed/
├── src/
│   ├── components/        # All React UI components (one file per component)
│   ├── data/              # Static mock data (mockData.ts only)
│   ├── hooks/             # Custom React hooks (if/when added)
│   ├── utils/             # Pure utility functions (no React, no side effects)
│   ├── types.ts           # ALL shared TypeScript interfaces and types
│   ├── App.tsx            # Root component and state orchestrator
│   ├── main.tsx           # Vite entry point — do not modify
│   └── index.css          # Global styles and Tailwind directives
├── public/                # Static assets (favicons, images, robots.txt)
├── .env                   # Local secrets — NEVER commit
├── .env.example           # Template for .env — ALWAYS keep updated
├── .gitignore             # Must include .env, node_modules, dist
├── decisions.md           # Technical decision log
├── rules.md               # This file
├── memory.md              # Project long-term memory
├── changelog.md           # Version history
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Rules
- **One component per file.** `Header.tsx` contains only the `Header` component.
- **No `pages/` or `views/` directory** — screens are components in `src/components/`.
- **New shared types go in `src/types.ts`**, not in component files.
- **Utility functions go in `src/utils/`** (create if needed). They must be pure functions with no React dependencies.
- **Do not create nested folders inside `src/components/`** unless there are 5+ related sub-components that form a logical grouping.

---

## 3. Naming Conventions

### Files and Directories
| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase `.tsx` | `SearchResultsScreen.tsx` |
| Utility files | camelCase `.ts` | `formatCurrency.ts` |
| Data files | camelCase `.ts` | `mockData.ts` |
| Hooks | camelCase starting with `use` | `useReservations.ts` |
| Directories | camelCase | `components/`, `data/` |

### Variables and Functions
| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `ChemistPortal` |
| Regular functions/handlers | camelCase with verb prefix | `handleConfirmReservation`, `formatPrice` |
| Boolean variables | Prefix with `is`, `has`, `can`, `should` | `isOpen`, `hasHomeDelivery`, `canReserve` |
| Constants (module-level) | SCREAMING_SNAKE_CASE | `MEDICINES`, `INITIAL_AUDIT_LOGS` |
| State variables | camelCase noun | `selectedMedicineId`, `toastMessage` |
| State setters | camelCase with `set` prefix | `setSelectedMedicineId` |
| Type aliases | PascalCase | `PortalRole`, `ActiveTab` |
| Interfaces | PascalCase (no `I` prefix) | `Medicine`, `ChemistOffer` |

### IDs and Keys
- **Data IDs** use kebab-case with a descriptive prefix: `atorvastatin-20`, `offer-1`, `aud-1094`.
- **Reservation codes** follow the format `GM-XXXX-NY` (app prefix, 4-digit code, state/region).
- **HTML element IDs** (if used) use kebab-case: `reserve-modal-confirm-btn`.

---

## 4. UI/UX Consistency Rules

### Design System
- **Color palette:** Use Tailwind's `slate`, `emerald`, and `blue` families as the primary palette. Avoid raw colors like `red-500` for branding elements — use semantic names.
  - Primary action: `emerald-500` / `emerald-600`
  - Destructive action: `red-500` / `red-600`
  - Neutral backgrounds: `slate-50`, `slate-100`, `slate-900`
  - Text: `slate-900` (primary), `slate-500` (secondary), `slate-400` (muted)
- **Typography:** Use `font-sans` (system font stack via Tailwind). Never hardcode `font-family` in components.
- **Spacing:** Use Tailwind spacing scale only. No arbitrary values like `p-[13px]` unless absolutely necessary.

### Components
- **Modals** must:
  - Render with a darkened backdrop (`bg-black/50` or similar).
  - Be closable via an `×` button and backdrop click.
  - Use `AnimatePresence` + `motion` for enter/exit animations.
  - Trap focus while open (future: add `aria-modal` and focus management).
- **Buttons** must have:
  - Visible hover state (`hover:bg-*`).
  - Disabled state when applicable (`disabled:opacity-50 disabled:cursor-not-allowed`).
  - Accessible labels (`aria-label` if icon-only).
- **Toast notifications** must auto-dismiss after 3500ms (enforced in `showToast` in `App.tsx`).
- **Loading states** must show a spinner or skeleton, never a blank area.

### Responsive Design
- Design mobile-first. Use `sm:`, `md:`, `lg:` breakpoint prefixes to enhance for larger screens.
- The app's primary target is mobile web (375px–430px width). Desktop should be usable but is not the primary breakpoint.

### Accessibility (a11y)
- All interactive elements must be keyboard-focusable.
- Use semantic HTML: `<button>` for actions, `<a>` for navigation, `<header>`, `<main>`, `<nav>`, `<section>` for structure.
- Images must have descriptive `alt` attributes.
- Avoid `div` and `span` as interactive elements — use `button` instead.

---

## 5. Git Commit Rules

### Commit Message Format
Use the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types
| Type | When to Use |
|------|-------------|
| `feat` | A new feature or user-facing capability |
| `fix` | A bug fix |
| `refactor` | Code restructuring with no behavior change |
| `style` | Formatting, whitespace, CSS-only changes |
| `docs` | Changes to markdown files, comments, or documentation |
| `chore` | Build scripts, dependency updates, config changes |
| `test` | Adding or updating tests |
| `perf` | Performance improvements |

### Examples
```
feat(reservation): add 24-hour expiry countdown to reservation card
fix(chemist-portal): correct price calculation on offer update
refactor(app): extract toast logic into useToast hook
docs(memory): update API endpoints section with new /api/scan route
chore(deps): upgrade lucide-react to v0.560.0
```

### Rules
- **Commits must be atomic** — one logical change per commit.
- **Never commit directly to `main`** — use feature branches and pull requests.
- **Branch naming:** `feature/<description>`, `fix/<description>`, `chore/<description>`.
  - Example: `feature/qr-code-reservation`, `fix/modal-backdrop-click`
- **No WIP commits** on `main`. Squash or amend before merging.
- **Never commit secrets** — `.env` is in `.gitignore`. Verify with `git status` before committing.

---

## 6. Security & Environment Variable Rules

### Critical Rules
> [!CAUTION]
> Violating these rules can expose API keys, compromise user data, or break production deployments.

- **`.env` must NEVER be committed to version control.** It is listed in `.gitignore`. Verify before every push.
- **`GEMINI_API_KEY` must NEVER be used directly in frontend (client-side) code in production.** All Gemini API calls must be routed through the Express backend (`/api/...`).
- **`APP_URL` must be injected at runtime**, not hardcoded in any source file.
- **`.env.example` must always be kept up to date** with all required variable names (values should be placeholder strings like `"YOUR_KEY_HERE"`).

### Environment Variable Naming
- All env variables must be `SCREAMING_SNAKE_CASE`.
- Variables consumed by Vite on the client must be prefixed with `VITE_` (e.g., `VITE_APP_NAME`).
- Variables consumed only by the server (Express) must NOT be prefixed with `VITE_`.
- Never log environment variable values in production code.

### Dependency Security
- Audit new dependencies before adding: check download counts, maintenance status, and known CVEs.
- Run `npm audit` after adding new packages.
- Avoid packages with fewer than 100k weekly downloads unless there is a strong justification.
- Pin major versions in `package.json`; allow patch/minor updates.

---

## 7. Stability Rules

> [!IMPORTANT]
> These rules protect existing functionality from unintended breakage.

- **Never break existing functionality unless explicitly requested.** If a change has potential side effects on existing features, note this in the PR description.
- **Before modifying `App.tsx`**, fully understand the existing state shape and all handlers. `App.tsx` is the central nervous system — a bad change here affects every portal.
- **Before modifying `src/types.ts`**, check every file that imports the changed type. Type changes are propagating changes.
- **Before modifying `src/data/mockData.ts`**, check that all referencing `medicineId` values remain consistent across `MEDICINES` and `CHEMIST_OFFERS`.
- **Modal open/close state is managed in `App.tsx`.** Never add new modal state inside a child component — keep it in the root orchestrator.
- **Do not remove any exported function or type** without checking all import sites first.
- **UI regressions must be tested** visually across the three portals (customer, chemist, admin) before marking a task complete.

---

*Last updated: 2026-09-09 | These rules apply to all contributors and AI assistants working on GenericMed.*
