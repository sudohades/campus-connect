# CampusConnect Demo Guide

A step-by-step walkthrough for presenting CampusConnect to an audience.

---

## Before You Start

1. Run `npm run dev` and open `http://localhost:3000`
2. If you need to reset the application state at any point, go to `/dev` and click "Reset Entire Application"

---

## Demo Flow

### 1. Landing Page (`/`)

Open the homepage. Point out:
- Brand colors (deep red `#8B1E1E`, black, white)
- Hero section with the value proposition
- Three feature cards: Verified Students, Fast Delivery, Chat Before You Buy
- "Recently listed" and "Popular services" grids showing sample data

### 2. Browse Marketplace (`/marketplace`)

Click "Browse Marketplace" or the nav link. Show:
- Search bar with live filtering (type "laptop" or "textbook")
- Category dropdown filter (Electronics, Books, Furniture, etc.)
- Listing cards with price, location, and time-ago timestamps
- Click any listing to see the detail page

### 3. Listing Detail & Purchase Flow (`/listings/[id]`)

Pick any listing (e.g., "Scientific Calculator"). Show:
- Listing image placeholder, price, condition, seller info
- "Message Seller" button
- **"Buy for KES X" button** — click it to trigger the M-Pesa simulation:
  - "Processing M-Pesa payment..." (2.2s)
  - "Confirming transaction..." (1s)
  - "Assigning delivery rider..." (1.5s)
  - Rider name and delivery location appear
- After purchase, the button changes to "Purchased — Delivery in Progress"

### 4. Browse Services (`/services`)

Navigate to Services. Show:
- Service cards with title, price, and duration
- Category filters (Tutoring, Design, Printing, etc.)
- Click a service to see the detail page

### 5. Service Booking Flow (`/services/[id]`)

Pick any service (e.g., "Math Tutoring for First-Years"). Show:
- Provider info, rating, price, available slots
- **"Book for KES X" button** — click it:
  - "Checking availability..." (800ms)
  - "Processing payment..." (1.2s)
  - "Booking confirmed" (600ms)

### 6. Login as Buyer (`/login`)

Log in with:
- **Email:** aisha.njeri@students.university.ac.ke
- **Password:** buyer123

Show:
- Header updates with avatar initials and notification/messages icons
- Unread notification badge on the bell icon

### 7. Buyer Dashboard (`/dashboard`)

Navigate to Dashboard. Show:
- Welcome message with role badge
- Stat cards: Total Orders, In Progress, Reviews Left

### 8. Notifications (`/notifications`)

Click the bell icon. Show:
- Notification list with read/unread states
- Click a notification — it marks as read and navigates to the relevant page

### 9. My Orders (`/dashboard/orders`)

Show the buyer's order list with status badges and dates.

### 10. Switch to Seller (via Dev Console)

Go to `/dev`. Show the Developer Console:
- **Current Session** display with role badge
- **Switch User** section — click "Brian Otieno" (Seller)
- **Quick Navigation** links
- **Application Statistics** grid
- **Reset Controls**

### 11. Seller Dashboard (`/dashboard`)

Show seller-specific stats:
- Active Listings, Total Listings, Orders Received

### 12. Manage Listings (`/dashboard/listings`)

Show:
- Table of seller's listings with status badges
- **"New Listing" button** — click to open the create form:
  - Fill in title, description, price, location, category, condition
  - Submit — shows step-by-step: "Uploading images..." → "Publishing listing..." → "Listing published successfully"
- New listing appears in the table

### 13. Orders Received (`/dashboard/orders`)

Switch view to seller orders. Show seller actions:
- Accept order → Mark dispatched → Mark delivered → Mark completed
- Each action updates the status badge in real-time

### 14. Switch to Service Provider

Go to `/dev`, switch to "Faith Wanjiru" (Provider).

### 15. Provider Pages

Show:
- `/dashboard` — Active Services, Total Bookings stats
- `/dashboard/services` — Pause/Reactivate services
- `/dashboard/bookings` — Confirm booking → Mark completed

### 16. Switch to Admin

Go to `/dev`, switch to "Dennis Kiprono" (Admin).

### 17. Admin Pages

Show each admin section:
- **Verifications** (`/admin/verifications`) — Approve/Reject pending students
- **Listings** (`/admin/listings`) — Approve/Remove listings, full listings table
- **Reports** (`/admin/reports`) — Review/Dismiss/Resolve reports
- **Disputes** (`/admin/disputes`) — Investigate/Resolve/Dismiss disputes
- **Analytics** (`/admin/analytics`) — Platform KPIs (users, listings, transactions, revenue)

### 18. Registration Demo (`/register`)

Show the registration flow:
- Role selection (I want to buy / I want to sell / I offer services)
- Student ID and email validation (must be `@anu.ac.ke`)
- Step-by-step feedback: "Creating account..." → "Verifying student ID..." → "Registration successful"

### 19. Mobile Responsiveness

Resize the browser to 390px width (or use device toolbar). Show:
- Hamburger menu in header for unauthenticated users
- Horizontal scroll nav in dashboard (replaces sidebar)
- Chat page toggles between conversation list and message view
- Tables scroll horizontally
- Cards stack vertically

---

## Quick Reset

At any point during the demo, go to `/dev` and:
- **Reset Entire Application** — restores all data to initial state
- **Reset [Slice]** — reset just listings, messages, notifications, reviews, or transactions

---

## Tips

- The Dev Console (`/dev`) is your control panel — use it freely during the demo
- All payments are simulated (no real M-Pesa integration)
- Registration requires `@anu.ac.ke` emails — mention this is the ANU-only restriction
- The demo feels more alive with the loading animations — let them play out
- If state gets messy, just reset via `/dev`
