# University Library Management System — Next.js Edition

One codebase, one deployment. This replaces the earlier three-service setup
(HTML frontend + Express backend + separate MySQL/Postgres host) with a
single Next.js app: the UI, the API, and the database access all live here,
and it deploys to Vercel in one shot with no CORS configuration to manage.

**Same interface as before** — navy (`#1b1f45`) + orange (`#e2833f`)
dashboard, the same sidebar/topbar layout, the same line-icon set (no
emoji anywhere), just rebuilt as React components with Tailwind instead of
hand-written HTML/CSS.

## Stack
- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + small hand-built shadcn-style primitives (`components/ui/`)
- **Supabase** — PostgreSQL database + Auth (email/password, roles: Super Admin, Librarian, Student, Lecturer)
- **Prisma** — typed database access, no raw SQL to hand-maintain
- **React Query** — client-side data fetching/caching for the dashboard widgets
- **Chart.js** (via `react-chartjs-2`) — the books-overview line chart and top-books donut
- **OpenAI API** — powers the AI Librarian (optional — see below)
- **Vercel** — one-click deployment, no Docker/Render/Railway

## What's fully built and working
- **Landing page** (`/`) — public marketing page with feature highlights and calls to action to sign up or log in
- **Auth** — Supabase Auth login (`/login`) and self-serve signup (`/signup`, creates a Student-role account), session-protected dashboard routes (`middleware.ts`), role stored on a `profiles` table
- **Dashboard** (`/dashboard`) — live stat cards, books-overview chart (week/month/year), recent activity, recently issued books, top books by category, and a recommendations widget — all reading real data, no mock/sample fallback
- **Books** — list + add (full CRUD API exists at `/api/books`, `/api/books/[id]`)
- **Members** — list + add (full CRUD API at `/api/members`, `/api/members/[id]`)
- **Borrowing** — issue a book and return a book, both as real transactions (checks available copies, decrements/increments stock, logs to `activity_log`)
- **Fines** — list + mark as paid, shown in Ghana Cedis (GH₵)
- **Recommendations** — content-based, same logic as the previous build: a member's top borrowed category → available books there they don't already have; falls back to library-wide popularity for new members. Pure SQL via Prisma, no external AI call needed.
- **AI Librarian** — a chat page (`/ai-librarian`) that does a keyword search over the real catalog first, then (if `GEMINI_API_KEY` is set) hands that as grounding context to Google's Gemini (free tier, via its OpenAI-compatible endpoint) so it answers in natural language without inventing books that aren't actually in the library. **Without an API key it still works** — it just returns the catalog matches directly instead of a generated natural-language reply.
- **Seed data** — `prisma/seed.ts` loads ~103 real books (title/author verified, not placeholder text) across 10 categories, so every dashboard widget has real data immediately after setup.

## What's intentionally not included in this pass
The original spec covers several genuinely separate subsystems that each deserve their own focused build rather than a half-working stub bolted on. Flagging these clearly instead of faking them:
- **Digital library** — PDF upload/in-browser reading/search-inside-PDF (would need Supabase Storage wiring + a PDF viewer + text extraction)
- **Barcode/QR generation & printing**
- **Bulk CSV import/export** for books
- **Report exports** to PDF/Excel/CSV (the data itself is all queryable now — this is a formatting/export layer on top)
- **Email notifications** (overdue reminders, reservation alerts — needs an email provider like Resend configured)
- **Book reservations/waiting list** (the `book_requests` table exists in the schema, ready for this)
- **Audit logs** beyond the basic `activity_log` feed
- **Dark mode toggle**

Each of these is a scoped, addable feature on top of the foundation here — happy to build any of them out next.

## Project structure
```
app/
  page.tsx                — public landing page
  login/                  — Supabase Auth login page
  signup/                 — self-serve account creation (Student role)
  api/auth/signup/        — creates the Supabase Auth user + profile row
  (dashboard)/            — protected route group (redirects to /login if no session)
    dashboard/             — dashboard home (/dashboard)
    books/ members/ issued-books/ fines/ ai-librarian/
  api/                    — route handlers (the "backend")
    dashboard/  books/  members/  issued-books/  fines/  recommendations/  ai-librarian/
components/
  ui/                     — Button, Card, Input, Badge, icons (shadcn-style, hand-built)
  dashboard/              — Sidebar, Topbar, StatCard, charts, widgets
lib/
  prisma.ts               — shared Prisma client
  supabase/                — browser/server/admin Supabase clients
  apiAuth.ts, getProfile.ts — auth helpers
prisma/
  schema.prisma           — the data model
  seed.ts                 — real starter catalog
scripts/
  create-admin.ts         — creates your first Supabase Auth user + profile row
middleware.ts             — session refresh + route protection
```

## Setting it up

### 1. Create a Supabase project
Free tier is fine. From the dashboard, grab:
- Project URL and anon key (**Project Settings → API**)
- Service role key (same page — keep this secret, server-only)
- Database connection strings (**Project Settings → Database** → both the pooled "Transaction" URL and the direct "Session" URL)

### 2. Configure environment variables
```bash
cp .env.example .env
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, DIRECT_URL
# (GEMINI_API_KEY is optional — see the AI Librarian note above)
```

### 3. Install, push the schema, seed
```bash
npm install
npx prisma db push      # creates all tables from prisma/schema.prisma
npm run db:seed          # loads the ~103-book starter catalog
npm run db:create-admin  # creates your first login (admin@library.edu / ChangeMe123!)
```

### 4. Run it
```bash
npm run dev
# open http://localhost:3000 — you'll see the landing page.
# Log in with the seeded admin at /login, or create a Student account at /signup.
```

## Deploying (Vercel)
1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add the same environment variables from `.env.example` in Vercel's project settings.
4. Deploy. Vercel runs `prisma generate && next build` automatically (see the `build` script in `package.json`).
5. Run `npm run db:seed` and `npm run db:create-admin` once locally (pointed at your production `DATABASE_URL`) to populate the live database — Prisma's `db push`/seed don't run automatically on deploy.

No Render, no Railway, no CORS setup — the whole thing is one Vercel project talking to one Supabase project.
# novalms
