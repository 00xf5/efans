# eFans (Project FNS) — Sovereign Creator Ecosystem

A high-fidelity, multi-tenant digital sanctuary for independent creators. eFans combines cinematic aesthetics with a robust economic engine, built for extreme data density and mobile-first discovery.

---

## 🏗️ Core Architecture & Technical Stack

*   **Framework**: [React Router v7](https://reactrouter.com/) (Framework Mode)
*   **Infrastructure**: [Vercel](https://vercel.com/) (Production Hosting) & [Cloudflare Pages](https://pages.cloudflare.com/) (Edge SSR)
*   **Edge Compute**: Cloudflare Workers (High-performance API layer)
*   **Database**: Supabase (PostgreSQL with Row Level Security)
*   **Storage**: Cloudflare R2 (S3-compatible visual asset vault)
*   **Design Engine**: Tailwind CSS v4 (Custom dark-mode design tokens)
*   **Security Protocol**: Aegis Guard (Advanced chargeback protection & fraud mitigation)

---

## 🏦 Economic Engine (Backend Logic Specs)

To facilitate a robust backend implementation, the following economic models and logic flows must be adhered to:

### 1. The 80/20 Commission Model
*   **Creator Share**: 80% of all gross revenue (Subscriptions, Vision Unlocks, Tips).
*   **Platform Take**: 20% flat commission for infrastructure, security, and hosting.
*   **Settlement**: Real-time balance updates in the "Experience Hub" (Dashboard).

### 2. Referral Engine (Growth Logic)
*   **The 10% Protocol**: Referrers earn **10% of the platform's cut** (2% of the total transaction) for every creator they bring to the hub.
*   **Duration**: Lifetime resonance (continuous payouts for the life of the referred account).

### 3. Calibration Tiers (Pricing)
*   **The Daily Boost**: A $3 USD/day (or equivalent in Naira) promotion system that injects the creator into the "Global Altar" (High-priority discovery position).
*   **Subscription Slider**: Creators set their own "Monthly Fuel" prices from ₦5,000 to ₦50,000.

### 4. Privacy & Content Visibility (Sovereign Mode)
*   **The Flow (Public)**: Open-access content for engagement.
*   **Visions (Locked)**: Paywalled high-fidelity content requiring individual unlock or subscription.
*   **Whisper Room (Encrypted Chat)**: Direct messaging with tip-to-unlock and pay-per-view vision support.

---

## 💎 The "Divine" Experience (4-Column HUD)

Designed for massive displays (up to 2200px), the interface optimizes real estate across four specialized pillars:

1.  **Management HUD**: Financial metrics, Whisper/Echo counters, and Identity Calibration.
2.  **The Independent Center Feed**: Multi-file distribution toolkit ("Studio Composer") and Moment Cards.
3.  **Active Desires (Recon)**: Real-time community activity and interaction feed.
4.  **The Apex Discovery Gallery**: 480px wide pillar for global discovery with live thermal heat gauges.

---

## 🗺️ Implementation Roadmap

### PHASE 1: Visual Sanctuary (Complete)
*   [x] Cinematic Hero Engine & Creator Carousel
*   [x] Discovery Garden (`/creators`) global search & listing
*   [x] Premium Authentication (Sign-in/Sign-out/Forgot Password)
*   [x] Global Layout (Navbar, MobileHUD, Multi-tenant Footer)

### PHASE 2: Economic Core (Active/WIP)
*   [x] **Experience Hub (Dashboard)**: Revenue tracking & bank linking UI.
*   [x] **Identity Sanctuary**: Profile customization (Avatar, Banner, Bio).
*   [x] **Notification Engine (Echoes)**: Real-time UI for platform interactions.
*   [ ] **Payment Rails**: Integration with Paystack/Flutterwave for local settlement.
*   [ ] **R2 Implementation**: Dynamic asset uploading & Resizing (4K optimization).

### PHASE 3: Social & Sovereignty
*   [x] **Encrypted Whispers (Messages)**: Contextual messaging interface.
*   [ ] **Chargeback Shield**: Aegis Guard logic for fraud protection.
*   [ ] **Live Analytics**: Heat-map visualization for creator growth.

---

## 🛠️ Developer Protocols

### Local Development
```bash
npm run dev
```

### Type Checking
```bash
npm run typecheck
```

### Security Compliance
All API endpoints must utilize **Supabase RLS** and **Aegis Guard** profiles to prevent unauthorized state mutation. Identity is sacred.

---
*Built for the digital elite. Precision. Aesthetics. Power.*
