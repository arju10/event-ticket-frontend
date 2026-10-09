# EventHub — Frontend

The Next.js 16 frontend for the **Event Ticket Booking & Management Platform** backend. Discover events, book tickets with guaranteed no-overselling checkout, join waitlists, and manage the full event lifecycle — all with real, role-aware UI for three distinct roles.

- **Backend repo:** [Event-Ticket-Booking-Management-Platform-Backend](https://github.com/arju10/Event-Ticket-Booking-Management-Platform-Backend)
- **Backend live API:** https://event-ticket-booking-management-pla.vercel.app/api/v1
- **Frontend live:** _(coming soon)_

---

## Tech Stack

| Layer               | Choice                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Framework           | **Next.js 16** (App Router, Turbopack default, React Server Components by default)                         |
| Language            | **TypeScript** (strict, no `any`)                                                                          |
| Styling             | **Tailwind CSS v4** (CSS-first config)                                                                     |
| Components          | **shadcn/ui** (Radix-based) + **Lucide React**                                                             |
| Data fetching       | **TanStack Query v5**                                                                                      |
| Global client state | **Zustand** (with `persist`)                                                                               |
| Forms               | **React Hook Form** + **Zod**                                                                              |
| HTTP                | **Axios** with request/response interceptors (auto-refresh on 401)                                         |
| Charts              | **Recharts**                                                                                               |
| Toasts              | **Sonner**                                                                                                 |
| Auth                | JWT (access + refresh) stored in localStorage, mirrored into a cookie for `middleware.ts` route protection |
| Payments            | Stripe Checkout (test mode) — success / cancel redirects with polling                                      |
| Media               | `next/image` with Cloudinary allow-list                                                                    |
| Formatting          | Prettier + `prettier-plugin-tailwindcss`                                                                   |
| Linting             | ESLint 9 flat config                                                                                       |

---

## Getting Started
### Clone the project:
```bash
git clone https://github.com/arju10/event-ticket-management.git
cd event-ticket-management
```
### Install all dependencies & Run :
```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open http://localhost:3000.

### Environment variables

```bash
NEXT_PUBLIC_API_URL=https://event-ticket-booking-management-pla.vercel.app/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable              | Required | Notes                                                              |
| --------------------- | -------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Yes      | Base URL of the backend API (must end with `/api/v1`)              |
| `NEXT_PUBLIC_APP_URL` | Yes      | Used for metadata, canonical URLs, Stripe success/cancel redirects |

### Scripts

| Command                | What it does             |
| ---------------------- | ------------------------ |
| `npm run dev`          | Start with Turbopack HMR |
| `npm run build`        | Production build         |
| `npm start`            | Run the production build |
| `npm run lint`         | ESLint (flat config)     |
| `npm run typecheck`    | `tsc --noEmit`           |
| `npm run format`       | Prettier write           |
| `npm run format:check` | Prettier check (CI-safe) |

---

## Demo Logins

The login page (`/login`) features **one-click demo login buttons** for all three roles. The accounts are seeded by the backend's `prisma/seed.ts`:

| Role      | Email                   | Password       |
| --------- | ----------------------- | -------------- |
| Admin     | `admin@example.com`     | `Password123!` |
| Organizer | `organizer@example.com` | `Password123!` |
| Attendee  | `attendee@example.com`  | `Password123!` |

---

## Roles & Route Protection

| Backend Role | Frontend Route Prefix | Home Page    |
| ------------ | --------------------- | ------------ |
| `ATTENDEE`   | `/dashboard`          | `/dashboard` |
| `ORGANIZER`  | `/organizer`          | `/organizer` |
| `ADMIN`      | `/admin`              | `/admin`     |

Route protection is enforced at three layers:

1. **`middleware.ts`** — reads the mirrored auth cookie at the edge, redirects unauthenticated users to `/login?redirect=…`, and bounces authed users who hit the wrong role's prefix.
2. **`RoleGuard`** (client) — defense-in-depth, re-checks the hydrated Zustand state on every dashboard render.
3. **Backend authorization** — every API call is scoped to the caller's role and ownership. The frontend is a UX convenience; the backend is the source of truth.

---

## Pages

### Public

- `/` — Landing (hero, live featured events, features, how-it-works, CTA)
- `/events` — Browse events with **URL-synced** filters (search, category, city, sort, pagination)
- `/events/[id]` — Event detail: tiers, description, reviews with rating distribution, join-waitlist dialog
- `/about`, `/contact`, `/pricing`

### Auth

- `/login` — Manual form + **3 one-click demo login buttons**
- `/register` — Role selector (Attendee / Organizer)
- `/forgot-password`

### Attendee (`/dashboard`)

- `/dashboard` — Overview (stat cards + recent bookings)
- `/dashboard/bookings` — My bookings (status tabs, URL-synced)
- `/dashboard/bookings/[id]` — Booking detail (booking number, cancel, review)
- `/dashboard/waitlist` — My waitlist entries across events
- `/dashboard/notifications` — List, mark-as-read, mark-all
- `/dashboard/profile` — Profile + avatar upload + change password

### Organizer (`/organizer`)

- `/organizer` — Overview (stats + recent events)
- `/organizer/events` — My events (status tabs)
- `/organizer/events/new` — **Multi-step wizard**: Basics → Location & Dates → Tiers → Settings & Review
- `/organizer/events/[id]` — Manage: publish/cancel, tier CRUD, quick links
- `/organizer/events/[id]/waitlist` — Event-wide waitlist table
- `/organizer/events/[id]/check-in` — Booking-number scanner
- `/organizer/earnings` — Revenue trend, top events, status pie (Recharts)
- `/organizer/profile`, `/organizer/notifications`

### Admin (`/admin`)

- `/admin` — Platform overview (users, events, bookings, revenue, health, category pie)
- `/admin/users` — User management (search, role change, suspend/reinstate)
- `/admin/coupons` — Create coupons
- `/admin/audit-logs` — Filterable, paginated audit trail
- `/admin/profile`, `/admin/notifications`

### Utility & Payment

- `/payment/success` — Polls booking status until `CONFIRMED`
- `/payment/cancel` — Retry option
- `not-found.tsx`, `error.tsx`, `global-error.tsx`

---

## Key Flows

### Booking → Payment

1. Attendee selects a tier and quantity on `/events/[id]`.
2. `POST /events/:id/book` runs the atomic checkout transaction (no overselling guaranteed server-side) and returns `{ booking, payment.paymentUrl }` in a single round-trip.
3. The frontend redirects to Stripe Checkout.
4. On success, Stripe redirects to `/payment/success?bookingId=…` and the backend webhook flips the booking to `CONFIRMED`. The success page **polls** `GET /bookings/:id` every 2s until the status changes (or 2min timeout).
5. On cancel, the user lands on `/payment/cancel` with a "try again" link back to the event.

In local dev without a Stripe key, the backend returns a `/payments/mock-confirm/:bookingId` URL — visiting it auto-confirms the booking, then you can navigate to `/payment/success` manually.

### Waitlist

The public event page shows a "Join waitlist" button when a tier is sold out. The backend holds inventory and notifies the oldest waiting user when a spot frees up. `/dashboard/waitlist` shows position, status, and offer-expiry for each entry.

### Cancellation

Refund windows are fixed platform-wide (100% / 50% / 0%). The cancel dialog shows the policy; the backend computes the exact refund and returns `refundPolicy` + `refundAmount`, which we surface in the toast.

---

## Project Structure

```
src/
├── app/                       # App Router
│   ├── (public)/              # Marketing + event browsing
│   ├── (auth)/                # Login, register, forgot-password
│   ├── dashboard/             # Attendee
│   ├── organizer/             # Organizer
│   ├── admin/                 # Admin
│   ├── payment/               # Success + cancel
│   ├── layout.tsx             # Root: providers, font, metadata
│   ├── error.tsx              # Root error boundary
│   ├── global-error.tsx       # Root layout crash fallback
│   ├── not-found.tsx          # 404
│   └── loading.tsx            # Root loading skeleton
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── layout/                # Navbar, footer, sidebar, topbar, role guard
│   ├── shared/                # DataTable, EmptyState, StatusBadge, skeletons, etc.
│   ├── events/                # EventCard, TierCard, filters, wizard steps
│   ├── bookings/              # Booking cards, cancel dialog, review dialog
│   ├── dashboard/             # StatCard, charts, role dashboards
│   ├── auth/                  # Demo login, login form, register form
│   ├── payment/               # Success / cancel clients
│   └── providers/             # Theme + Query + Toaster
├── hooks/                     # All custom hooks (data + UI)
├── lib/
│   ├── api/                   # Axios client + typed endpoint wrappers
│   ├── constants/             # Routes, categories, colors, demo accounts
│   ├── validations/           # Zod schemas mirroring backend rules
│   └── utils.ts               # cn()
├── stores/                    # Zustand stores (auth)
├── types/                     # API + model types
└── middleware.ts              # Edge route protection
```

---

<!-- ## Conventions

- **Server Components by default.** Add `"use client"` only where interactivity requires it (event handlers, hooks, context). Dashboard layouts are client components because they pass Lucide icon references to the sidebar — icon functions can't cross the server→client boundary.
- **URL is the source of truth** for every list view: filters, search, sorting, and pagination live in `searchParams` and are read via `useSearchParams` / `useUrlFilters`.
- **TanStack Query owns server state.** Every mutation invalidates the relevant query keys. Zustand is used only for auth (and would be used for multi-step wizard drafts).
- **Zod schemas mirror the backend.** Every form validates against the exact same rules the backend enforces, so users see errors before a round-trip.
- **No placeholders.** Every data-fetching page has a skeleton loader, an empty state, and an error state. Toast notifications cover all mutation outcomes. -->

<!-- ---

## Known Limitations

- The backend exposes no `GET /admin/coupons` — the admin coupon page only lists coupons created **during the current session**. A backend endpoint is planned post-project.
- The backend exposes no aggregate-analytics endpoint — organizer earnings derives estimates from `GET /events/:id` (which returns `statistics.totalBookings` and per-tier prices). A proper `/organizer/analytics` endpoint is planned post-project.
- The check-in scanner accepts the **booking ID** in the input field. The backend's check-in service looks bookings up by ID and verifies `bookingNumber === qrCode`. A lookup-by-number endpoint is planned post-project. -->

---

## Deployment

Deploy on Vercel:

1. Push this repo to GitHub.
2. Import the repo on Vercel.
3. Add environment variables: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`.
4. Deploy — no other configuration needed.

---
