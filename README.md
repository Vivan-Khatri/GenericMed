# GenericMed

> Save up to 85% on generic medicines. A full-stack price comparison and pharmacy discovery platform.

## Project Structure

```
GenericMed/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── api/       # fetch() wrappers for backend REST API
│   │   ├── components/
│   │   ├── context/   # Auth, Theme, Language providers
│   │   ├── data/      # Mock data fallback
│   │   ├── locales/   # i18n (en, es)
│   │   └── types.ts
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/           # Node.js + Express + MongoDB (Mongoose)
│   ├── src/
│   │   ├── models/    # Mongoose schemas
│   │   ├── routes/    # Express REST API routes
│   │   ├── data/      # mockData (used for seeding)
│   │   ├── server.js  # Express entry point
│   │   └── seed.ts    # Database seed script
│   ├── nodemon.json
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Prerequisites

- **Node.js** v20+ (v22 recommended)
- **MongoDB** running locally on port `27017`, OR a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

---

## 1. Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## 2. Configure Environment Variables

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env — no required changes for local dev
```

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGODB_URI and JWT_SECRET
```

**`backend/.env` example:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/genericmed
JWT_SECRET=change_me_to_a_strong_random_string
PORT=5000
```

---

## 3. Seed the Database (first time only)

```bash
cd backend
npm run seed
```

This populates MongoDB with all medicines, pharmacies, and sample offers.

---

## 4. Start the Applications

### Start Backend
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
# App opens on http://localhost:3000
```

### Run Both Together (from root, using concurrently)
```bash
# Install concurrently at root level (one-time)
npm install -g concurrently

# Then run both
concurrently "cd frontend && npm run dev" "cd backend && npm run dev"
```

---

## 5. API Communication

The frontend communicates with the backend through a Vite proxy:
- All `/api/*` requests from the frontend are automatically forwarded to `http://localhost:5000`
- This means the frontend calls `fetch('/api/medicines')` and Vite proxies it to `http://localhost:5000/api/medicines`
- **No CORS issues** in development

---

## 6. Available Scripts

| Location | Command | Description |
|---|---|---|
| `frontend/` | `npm run dev` | Start Vite dev server (port 3000) |
| `frontend/` | `npm run build` | Build for production |
| `frontend/` | `npm run lint` | TypeScript type check |
| `backend/` | `npm run dev` | Start Express with nodemon |
| `backend/` | `npm start` | Start Express (production) |
| `backend/` | `npm run seed` | Seed MongoDB with mock data |

---

## 7. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, TailwindCSS v4 |
| State/Auth | Custom JWT Context (localStorage) |
| i18n | Custom LanguageContext (English + Spanish) |
| Backend | Node.js, Express 4, Mongoose 9 |
| Database | MongoDB |
| Authentication | JWT + bcryptjs |
