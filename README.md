# CampusConnect

A student marketplace prototype built for Africa Nazarene University (ANU). Students can buy and sell items, book services, chat with each other, and manage orders — all within a verified campus community.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State:** In-memory (no database — prototype only)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Aisha Njeri | aisha.njeri@students.university.ac.ke | buyer123 | Buyer |
| Brian Otieno | brian.otieno@students.university.ac.ke | seller123 | Seller |
| Faith Wanjiru | faith.wanjiru@students.university.ac.ke | provider123 | Service Provider |
| Dennis Kiprono | dennis.kiprono@university.ac.ke | admin123 | Admin |

New registrations must use an `@anu.ac.ke` email address.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with featured listings and services |
| `/login` | Login form |
| `/register` | Registration with role selection (buyer/seller/provider) |
| `/marketplace` | Browse listings with search and category filters |
| `/listings/[id]` | Listing detail with M-Pesa purchase flow |
| `/services` | Browse services with search and category filters |
| `/services/[id]` | Service detail with booking flow |
| `/chats` | messaging interface (mobile-responsive sidebar toggle) |
| `/notifications` | Notification inbox with mark-as-read |
| `/dashboard` | Role-based dashboard overview with stats |
| `/dashboard/orders` | View and manage orders (seller actions: accept/dispatch/deliver/complete) |
| `/dashboard/listings` | Seller listing management with create form |
| `/dashboard/services` | Provider service management (pause/reactivate) |
| `/dashboard/bookings` | Provider booking management (confirm/complete) |
| `/dashboard/reviews` | Buyer review history |
| `/dev` | Developer Console — session control, role switching, state reset, app stats |
| `/admin/verifications` | Approve or reject student verification requests |
| `/admin/listings` | Approve/remove listings |
| `/admin/reports` | Review and resolve admin reports |
| `/admin/disputes` | Investigate and resolve transaction disputes |
| `/admin/analytics` | Platform-wide KPIs and statistics |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (SessionProvider, header, footer)
│   ├── page.tsx            # Home page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── marketplace/        # Listing browse
│   ├── listings/[id]/      # Listing detail
│   ├── services/           # Service browse
│   ├── services/[id]/      # Service detail
│   ├── chats/              # Messaging
│   ├── notifications/      # Notification inbox
│   ├── dashboard/          # Dashboard pages (overview, orders, listings, services, bookings, reviews)
│   ├── admin/              # Admin pages (verifications, listings, reports, disputes, analytics)
│   └── dev/                # Developer Console
├── components/
│   ├── layout/             # SiteHeader, SiteFooter, DashboardShell
│   ├── shared/             # Reusable UI components (cards, badges, search, etc.)
│   └── dev/                # DevConsole component
├── data/                   # Mock data (users, listings, services, chats, reviews, notifications, admin)
├── lib/                    # Utilities, API, auth, session, state, constants
└── types/                  # TypeScript interfaces
public/
├── avatars/                # User avatar SVGs
├── listings/               # Listing placeholder images
└── services/               # Service category images
```

## How It Works

- **All state is in-memory** — resets when the page reloads. Use the Dev Console (`/dev`) to reset state mid-session.
- **Simulated payments** — M-Pesa flows show realistic step-by-step progress (processing, confirming, assigning rider).
- **Simulated delivery** — Rider assignment and delivery tracking are faked with delays.
- **Four user roles** — Buyer, Seller, Service Provider, Admin. Each has a tailored dashboard and sidebar navigation.
- **Registration** — Restricted to `@anu.ac.ke` email addresses. New accounts get a random role.

## Build

```bash
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # Lint check
```

## License

Prototype — not for production use.
