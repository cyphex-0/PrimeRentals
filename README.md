<div align="center">
  <img src="https://i.ibb.co/3sX8N2V/rentnest-logo.png" alt="RentNest Logo" width="120" />
  <br />
  <h1>RentNest 🏠</h1>
  <p><strong>A Next-Generation, Role-Based Real Estate & Rental Management Platform</strong></p>

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

## 📖 Executive Summary

**RentNest** is an enterprise-grade real estate rental application built on the modern **Next.js App Router** framework. Designed with multi-role orchestration at its core, RentNest bridges the gap between property owners, prospective tenants, and platform moderators with a secure, real-time, and friction-free user experience.

The frontend engine combines **React Server Components (RSC)** with advanced asynchronous caching via **TanStack React Query v5**, strictly enforced edge-level routing authentication, end-to-end **Stripe** checkout encryption, and robust client-side schema validation using **Zod**.

---

## ✨ Core Architecture & Key Features

### 🛡️ Enterprise Security & Role-Based Access Control (RBAC)
- **Edge Middleware Shield:** Utilizes lightweight Next.js runtime middleware (`src/proxy.ts`) to intercept navigation requests before execution, automatically routing users based on JWT claims (`TENANT`, `LANDLORD`, or `ADMIN`).
- **Strict Type Safety Guarantee:** Engineered entirely in strict **TypeScript 5.x** with **zero occurrences of `any`** across state handlers, mutations, API request payloads, and schema validations.

### 🏠 Seamless Property & Lease Marketplace
- **Real-Time Dynamic Filtering:** Discover listings with instant client responsiveness across location boundaries, monthly price thresholds, bedroom distributions, and category classifications.
- **Cloud Media Pipeline:** Integrated directly with the **ImgBB Web API** for rapid browser-to-cloud photo ingestion during property creation, preventing backend base64 memory exhaustion while supporting drag-and-drop sequencing.
- **Lease Status Lifecycle:** Automated visual UI states tracking applications from proposal to residency (`PENDING` → `APPROVED` → `ACTIVE` → `COMPLETED` or `REJECTED`).

### 💳 Encrypted Financial Checkout (Stripe Elements)
- **Frictionless Payment Flow:** Once a landlord approves a rental agreement, tenants gain instantaneous access to an embedded **Stripe Elements (`@stripe/react-stripe-js`)** credit card modal on `/dashboard/tenant/rentals/[id]/pay`.
- **Transaction Resolution Routing:** Features resilient event listeners that seamlessly route users to dedicated transaction validation screens (`/payment/success` and `/payment/cancel`) upon gateway confirmation.

### 🎨 Production-Grade UX & Resilience Design
- **Centralized Error Firewall:** Internal stack traces, raw JSON payloads, database constraint errors, and HTTP status code strings are strictly intercepted by a dedicated error sanitizer (`sanitizeErrorMessage`) and translated into human-readable, actionable guidance.
- **Responsive Visual Feedback:** All background data synchronization and mutation cycles communicate clearly via **Sonner** rich toast notifications, animated field error highlights, and high-performance skeleton loader fallbacks (`loading.tsx`).
- **Environment Isolation:** Internal diagnostic dashboards and verbose logging utilities are automatically stripped from production builds.

---

## 🛠️ Technology Stack

| Component / Layer | Technology | Purpose in System Architecture |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.2.12** | React Server Components, App Router routing architectures, and accelerated Turbopack bundling. |
| **Type Verification** | **TypeScript 5.x** | Static typing and domain modeling ensuring predictable runtime behavior without type bypasses. |
| **Styling & Design System** | **Tailwind CSS v4 & Shadcn UI** | Utility-first responsive design system, customizable Radix primitives, and fluid micro-animations. |
| **Server State Caching** | **TanStack React Query v5** | Advanced asynchronous query hydration, polling intervals, background invalidations, and optimistic UI table updates. |
| **Client State Management** | **Zustand & Context API** | Low-overhead local authentication storage and persistent client interface preferences. |
| **Form Engineering** | **React Hook Form + Zod** | Declarative state binding matched with runtime validation schema parsing and immediate visual feedback. |
| **Payment Encryption** | **Stripe JS & Elements** | PCI-compliant credit card input processing and tokenizer interface. |
| **Cloud Storage Gateway** | **ImgBB REST API** | High-speed cloud content delivery network for hosting listing cover art and tenant profile avatars. |

---

## 🚀 Local Development Setup

Follow these instructions to spin up the full frontend architecture on your local workspace.

### Prerequisites
- Node.js (v18.17 or higher recommended)
- npm, yarn, pnpm, or bun

### 1. Clone & Navigate
```bash
git clone https://github.com/cyphex-0/RentNest.git
cd RentNest
```

### 2. Environment Configuration
Create a `.env.local` configuration file in the repository root:
```bash
cp .env.example .env.local
```
Assign your targeted backend infrastructure URLs and third-party provider keys:
```env
# Target Backend REST API Gateway URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Public Encryption Key (Must begin with pk_test_ for sandbox testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YourStripePublishableKey

# ImgBB Cloud Client API Key (Required for listing and profile photo uploads)
NEXT_PUBLIC_IMGBB_API_KEY=YourImgBBAPIKey
```

### 3. Install Packages & Start Server
```bash
# Install required package dependencies
npm install

# Launch development environment with Turbopack acceleration
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) inside your web browser to explore the running application.

---

## 🧪 Production Assurance & Build Verification
To execute automated strict type-checks and verify the production bundle integrity before deploying to environments like Vercel or Render:
```bash
# Perform rigorous type analysis across all TypeScript codebases (no emit)
npx tsc --noEmit

# Compile and package optimized production route bundles
npm run build

# Preview optimized production server locally
npm run start
```

---

## 📄 License
This application is distributed under the [MIT License](LICENSE). Build with passion and robust software engineering standards.
