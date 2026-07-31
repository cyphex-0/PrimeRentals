<div align="center">
  <img src="https://i.ibb.co/3sX8N2V/rentnest-logo.png" alt="RentNest Logo" width="120" />
  <br />
  <h1>RentNest</h1>
  <p><strong>A modern, role-based property rental platform connecting landlords and tenants.</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square" alt="shadcn/ui" /></a>
    <a href="https://stripe.com/"><img src="https://img.shields.io/badge/Stripe-integrated-6366F1?style=flat-square&logo=stripe" alt="Stripe Payments" /></a>
    <a href="https://tanstack.com/query/latest"><img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=react-query" alt="TanStack Query" /></a>
  </p>
</div>

<hr />

## 📖 Overview

RentNest is a comprehensive real estate rental application built with Next.js App Router. It serves three distinct user roles—**Tenants**, **Landlords**, and **Admins**—providing a seamless experience for listing properties, requesting rentals, processing secure payments via Stripe, and managing platform operations.

The frontend is highly optimized for performance and security, utilizing Edge-level middleware for strict Role-Based Access Control (RBAC) and modern React Server Components.

---

## ✨ Key Features

- 🔐 **Strict Role-Based Access Control (RBAC)**: Secure routing via Edge middleware protecting Tenant, Landlord, and Admin dashboards.
- 🏢 **Property Management**: Landlords can list, edit, and manage properties with rich details, images, and amenities.
- 🔍 **Advanced Search & Filtering**: Tenants can dynamically filter properties by price, location, bedrooms, and categories.
- 💳 **Stripe Payment Integration**: Secure end-to-end rental payment flow with dynamic success/failure feedback handling.
- 📊 **Dynamic Dashboards**: Dedicated UI views for managing rental requests, payment histories, and overall platform statistics.
- 🎨 **Modern Aesthetics**: Built with Tailwind CSS and Shadcn UI, featuring responsive layouts, micro-animations, and light/dark modes.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2.12 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Shadcn UI, Framer Motion
- **State Management & Data Fetching:** Zustand, TanStack React Query v5
- **Forms & Validation:** React Hook Form, Zod
- **Payments:** Stripe Elements (`@stripe/react-stripe-js`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or newer)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/RentNest.git
cd RentNest
```

### 2. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Populate `.env.local` with your required keys:
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The base URL for your backend Node.js API (e.g., `http://localhost:5000/api`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (`pk_test_...`) |

### 3. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
