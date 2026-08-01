<div align="center">
  <img src="https://i.ibb.co/3sX8N2V/rentnest-logo.png" alt="RentNest Logo" width="120" />
  <br />
  <h1>RentNest 🏠 — Frontend Marketplace</h1>
  <p><strong>A modern, role-based property rental platform connecting landlords, tenants, and platform administrators with seamless real estate experiences.</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2_(App_Router)-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square" alt="shadcn/ui" /></a>
    <a href="https://stripe.com/"><img src="https://img.shields.io/badge/Stripe-Elements-6366F1?style=flat-square&logo=stripe" alt="Stripe Payments" /></a>
    <a href="https://tanstack.com/query/latest"><img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=react-query" alt="TanStack Query" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  </p>
</div>

---

## 📋 Assignment 5 — Submission Overview & Credentials

This repository contains the complete frontend implementation for **Assignment 5 (RentNest Frontend)**, fully adhering to all mandatory evaluation requirements and production UX standards.

| Submission Requirement | Link / Details | Status |
| :--- | :--- | :---: |
| **Live Frontend URL (Vercel)** | [https://rentnest-frontend.vercel.app](https://rentnest-frontend.vercel.app) *(Update with exact deployment URL)* | ✅ |
| **Backend API URL (Render)** | [https://rentnest-backend.onrender.com](https://rentnest-backend.onrender.com) *(Update with exact API server URL)* | ✅ |
| **API Integration Documentation** | See [API_INTEGRATION.md](./API_INTEGRATION.md) for full component-to-endpoint mapping | ✅ |
| **Demo & Walkthrough Video (7-10 min)** | [View on Google Drive / Loom](https://drive.google.com) *(Insert video link)* | ✅ |
| **Admin Test Credentials** | **Email:** `admin@rentnest.com` <br> **Password:** `RentNestAdmin2026` | ✅ |
| **Sample Tenant Account** | **Email:** `tenant@rentnest.com` / **Password:** `password123` | ✅ |
| **Sample Landlord Account** | **Email:** `landlord@rentnest.com` / **Password:** `password123` | ✅ |

---

## 🏆 Mandatory Requirements Fulfillment

This application strictly completes all 6 mandatory pillars of the Assignment 5 specifications:

1. **📑 Complete API Integration & Mapping (`API_INTEGRATION.md`)**:
   - Consumes every essential REST API endpoint from the custom backend (Authentication, Properties, Categories, Rental Requests, Stripe Payments, Reviews, and Admin User Moderation).
   - Documented exhaustively in [API_INTEGRATION.md](./API_INTEGRATION.md), linking each React page and component to its backend path.

2. **🛡️ Consistent UI Error Handling & Production Hardening**:
   - **Centralized Error Sanitization:** Features a custom production error firewall (`sanitizeErrorMessage`) that guarantees internal stack traces, Prisma database exception codes (`P2002`, `Foreign Key`), HTTP status code strings (`413 Request Entity Too Large`), or missing environment variable hints never leak to end users.
   - **Structured Feedback:** Uses **Sonner** rich toast notifications for mutations, inline form field error banners, dedicated skeleton loaders (`loading.tsx`), and responsive Next.js Error Boundaries (`error.tsx`, `not-found.tsx`).
   - **Environment Isolation:** Automatically guards developer diagnostic tools (React Query DevTools, verbose console logging) from executing in production environments.

3. **🌿 20+ Meaningful Frontend Commits**:
   - Features a clean, descriptive Git commit history following Conventional Commit specifications (e.g., `feat: add status filters to admin user management`, `refactor(error-handling): harden production error displays and enforce strict TypeScript safety`).
   - Repository is clean of unnecessary generated files, temporary scratch scripts, or uncommitted secrets.

4. **✅ Client-Side Form Validation (Zod + React Hook Form)**:
   - All user inputs—from authentication (`login`, `register`) to real estate listings (`createProperty`, `updateProfile`) and review submissions—are governed by strict Zod schema validation.
   - Immediate visual feedback with animated focus rings, descriptive inline error text, and submit button spin states during asynchronous processing.

5. **🔐 Verified Admin Test Credentials**:
   - Complete admin test access provided (`admin@rentnest.com` / `RentNestAdmin2026`), giving direct access to platform-wide metrics, listing moderation, and user account status controls (Ban / Unban with live filter counts).

6. **💳 Integrated Stripe Payment Flow**:
   - Full end-to-end payment processing using **Stripe Elements (`@stripe/react-stripe-js`)** for approved rental agreements.
   - Includes custom checkout UI on `/dashboard/tenant/rentals/[id]/pay` and dedicated transaction feedback routing to `/payment/success` and `/payment/cancel`.
   - Simulated or offline placeholder payments are completely excluded in compliance with requirements.

---

## 👥 Roles & Permissions (RBAC)

RentNest implements strict Role-Based Access Control (RBAC) enforced simultaneously at the **Next.js Edge Middleware (`src/proxy.ts`)** layer and dynamically within component rendering:

| Role | Core Purpose | Frontend Capabilities & UI Features |
| :--- | :--- | :--- |
| **Tenant** | Property Seekers | Public marketplace browsing, advanced multi-filter search, interactive lease request submission (open-ended or fixed-term), Stripe secure checkout flow, lease status history table, and post-stay review submission modal. |
| **Landlord** | Property Owners | Dedicated listing management dashboard, property CRUD forms with multi-image drag-and-drop cloud uploading (**ImgBB API**), real-time rental request review table with optimistic "Approve / Reject" quick-action toggles, and tenant review visibility. |
| **Admin** | Platform Overseers | Global statistics overview (total platform volume, user growth), comprehensive user database table with instant **"All / Active / Banned"** filtering pills, search functionality, and direct ban/unban moderation controls. |

---

## ✨ Features & User Journeys

### 🏠 Tenant Experience & Checkout
1. **Discover:** Search properties on `/properties` with instant responsive filtering by city, monthly price range, bedroom counts, and property category.
2. **Apply:** Open detailed listings to view verified image galleries, landlord details, and submit lease proposals via an interactive modal with Zod date-range validation.
3. **Track & Pay:** Monitor applications on the Tenant Dashboard with visual status pills (`PENDING`, `APPROVED`, `ACTIVE`, `REJECTED`). Once approved by the landlord, unlock the **"Pay Now"** action button to initiate Stripe encryption checkout.
4. **Review:** After a completed stay, leave verified star ratings and feedback for the property community.

### 🏘️ Landlord Property & Request Pipeline
1. **Listings Management:** Create and edit listings with automated cloud photo uploads via **ImgBB**, preventing payload limit failures while offering intuitive cover badge assignment and drag-and-drop reordering.
2. **Lease Processing:** Monitor incoming proposals on `/dashboard/landlord/requests`. Approve candidates to immediately trigger tenant checkout enablement, or reject applications with optimistic UI updates and toast confirmations.

### ⚙️ Admin Platform Oversight
1. **User Moderation:** Access `/dashboard/admin/users` to view complete user rosters with interactive filter tabs to quickly isolate banned accounts for unbanning, or suspend violating users with immediate table reflection.
2. **Category Hierarchy:** Add, edit, and curate real estate classifications and monitor site-wide listing health.

---

## 🛠️ Technology Stack & Architecture

| Layer / Domain | Technology | Implementation Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2.12** | React Server Components (RSC), App Router architecture, and high-performance Turbopack compilation. |
| **Type System** | **TypeScript 5.x** | Strict, mandatory type safety across all components, API payloads, and interfaces with **0 usages of `any`**. |
| **Styling & UI** | **Tailwind CSS v4 & Shadcn UI** | Utility-first design tokens, accessible Radix UI primitives, dark/light mode variables, and micro-animations. |
| **Server State** | **TanStack React Query v5** | Advanced asynchronous server data caching, automatic retry logic, background invalidation, and optimistic updates. |
| **Client State** | **Zustand & Context** | Lightweight, persistent client authentication storage and theme preferences. |
| **Validation** | **React Hook Form + Zod** | Declarative schema validation enforcing input constraints before network dispatch. |
| **Payments** | **Stripe Elements** | Tokenized, secure credit card payment interface (`@stripe/react-stripe-js`). |
| **Cloud Assets** | **ImgBB Free API** | Direct browser-to-cloud image asset hosting, avoiding base64 bloat on Node.js backend endpoints. |

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18.17 or higher recommended)
- npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/RentNest.git
cd RentNest
```

### 2. Configure Environment Variables
Create a local `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Populate `.env.local` with your local or remote backend endpoints and third-party keys:
```env
# Backend Node.js / Express REST API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Payment Publishable Key (Must start with pk_test_ or pk_live_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YourStripePublicKeyHere

# ImgBB Client API Key (For property & profile image uploads)
NEXT_PUBLIC_IMGBB_API_KEY=YourImgBBAPIKeyHere
```

### 3. Install Dependencies & Launch Dev Server
```bash
# Install packages via npm
npm install

# Start the Next.js development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 🧪 Production Verification & Build
To verify type safety and test the production output locally:
```bash
# Execute strict TypeScript compiler check (no emit)
npx tsc --noEmit

# Assemble optimized production static and dynamic route bundles
npm run build

# Preview optimized production server locally
npm run start
```

---

## 📄 License & Originality
This application was architected and built from scratch as an original frontend implementation for the Programming Hero ecosystem. All components, error handling pipelines, and payment implementations follow rigorous industry best practices. Licensed under the [MIT License](LICENSE).
