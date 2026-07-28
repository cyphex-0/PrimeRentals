# RentNest Frontend — Phase-by-Phase Prompts

> **How to use**: Copy each prompt below and paste it into your AI coding agent as a `/goal` command. Run them **in order** — each phase depends on the previous one. Wait for one phase to fully complete before starting the next.

---

## Prompt 1 — Phase 0 + Phase 1.0 (Project Setup + Design System)

```
/goal
Implement Phase 0: Project Initialization & Configuration AND Phase 1.0: Generate Design System with UI/UX Pro Max Skill from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY — do not skip steps or improvise.
2. You MUST use the ui-ux-pro-max skill (.agents/skills/ui-ux-pro-max/) to generate the design system BEFORE writing any CSS, Tailwind config colors, or font selections. Read the SKILL.md first to understand how the skill works.
3. Run the --design-system --persist command as described in Phase 1.0 Step 1, then use its output to finalize the Tailwind config (Phase 0.5) and Google Fonts (Phase 0.6).
4. Do NOT hardcode arbitrary colors or fonts — everything must come from the skill's design system output.
5. After Phase 0.5 Tailwind config is finalized with the design system colors, commit the complete config — not a placeholder.
6. Save design-system/MASTER.md — this is the design source of truth for all future phases.
7. Verify: run `npm run dev` and confirm the app loads at localhost:3000 with no errors.
```

---

## Prompt 2 — Phase 1 (Design System & Layout Foundation)

```
/goal
Implement Phase 1 (Sections 1.1 through 1.7): Design System & Layout Foundation from @implementation.md.

CRITICAL RULES:
1. Read design-system/MASTER.md FIRST — use its color palette, fonts, spacing, and effects for ALL styling decisions. Do NOT invent new colors or fonts.
2. Build ALL 15 UI components listed in Section 1.3 (button, input, textarea, select, badge, card, skeleton, dialog, avatar, dropdown-menu, data-table, pagination, empty-state, star-rating, status-badge). Do not skip any.
3. The StatusBadge component (Section 1.3.1) must map backend enum values to specific visual styles exactly as documented.
4. Build ALL 4 layout components in Section 1.4 (navbar, footer, sidebar, dashboard-header).
5. The Sidebar must be role-aware with different navigation items for TENANT, LANDLORD, and ADMIN as specified in Section 1.4.1.
6. Create all 4 app layouts in Section 1.5 (root, public, auth, dashboard).
7. Set up sonner toast notifications in root layout as described in Section 1.6.
8. Use lucide-react for all icons — do NOT use emojis as icons.
9. Every component must look premium and polished — use the design system's shadows, border-radius, and animations. Add smooth hover transitions on interactive elements.
10. Verify: the app renders with Navbar + Footer on the home page route, all components compile without errors.
```

---

## Prompt 3 — Phase 2 (API Layer & Type System)

```
/goal
Implement Phase 2: API Layer & Type System from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for all type definitions, API functions, and validation schemas.
2. Create ALL type files (Sections 2.1.1–2.1.7): api.ts, user.ts, property.ts, rental.ts, payment.ts, review.ts, and index.ts barrel export.
3. The `rent` and `amount` fields are Decimal types serialized as STRINGS by Prisma — the types must use `string` (not `number`) and you must parseFloat() for display.
4. Create the API client (Section 2.2) with: auto-attach Authorization header, Content-Type: application/json, credentials: "include" for cookie handling, 401 → refresh → retry pattern.
5. Create ALL domain API files (Sections 2.3.1–2.3.8): auth.ts, properties.ts, categories.ts, rentals.ts, payments.ts, reviews.ts, landlord.ts, admin.ts. Every function listed in those tables must exist.
6. Create ALL Zod validation schemas (Sections 2.4.1–2.4.5): auth.ts, property.ts, rental.ts, review.ts, category.ts. These must mirror backend validation rules.
7. Create format utility functions (Section 2.5.1): formatPrice, formatDate, formatRelativeTime, capitalize, truncate.
8. Set up TanStack Query provider (Section 2.6.1) and create ALL custom hooks listed in Section 2.6.2 (use-auth, use-properties, use-categories, use-rentals, use-payments, use-reviews, use-landlord, use-admin).
9. Every mutation hook must invalidate relevant queries on success and show toast notifications.
10. Verify: all files compile with no TypeScript errors.
```

---

## Prompt 4 — Phase 3 (Authentication System)

```
/goal
Implement Phase 3: Authentication System from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for auth store, provider, pages, and middleware.
2. Create the Zustand auth store (Section 3.1) — access token stored IN MEMORY (not localStorage).
3. Create the Auth Provider (Section 3.2) — on mount, call POST /api/auth/refresh-token with credentials: "include". If successful, call GET /api/auth/me to get user info and update the store. Wrap children with a loading state until auth resolves.
4. Login page (Section 3.3.2): React Hook Form + Zod (loginSchema), redirect based on role on success (TENANT→/dashboard/tenant, LANDLORD→/dashboard/landlord, ADMIN→/dashboard/admin).
5. Register page (Section 3.3.3): role selector with two styled cards "I'm a Tenant" and "I'm a Landlord" (NOT a plain dropdown). React Hook Form + Zod (registerSchema).
6. Auth layout (Section 3.3.1): centered layout with gradient background, split design (branding on one side, form on the other for desktop). Must look premium.
7. Next.js Middleware (Section 3.4): check refreshToken cookie — protect /dashboard routes, redirect authenticated users away from /auth pages. COPY the middleware code from implementation.md exactly.
8. Logout function (Section 3.5): clear Zustand store, clear refreshToken cookie via document.cookie, redirect to /auth/login.
9. Read design-system/MASTER.md for all color and styling decisions.
10. Verify: register → auto-login → correct dashboard redirect. Login works. /dashboard without auth → redirects to login. Page refresh → session restored via refresh token. Logout works.
```

---

## Prompt 5 — Phase 4 (Public Pages)

```
/goal
Implement Phase 4: Public Pages from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for all sections (4.1–4.5).
2. Read design-system/MASTER.md for all visual styling. Check design-system/pages/landing.md if it exists for homepage overrides.
3. HOME PAGE (Section 4.1) — This is the FIRST thing users see. It must be VISUALLY STUNNING:
   - Hero section with large heading, search bar, gradient background, and CTA buttons
   - Categories section: fetch from GET /api/categories, display as cards with mapped icons
   - Featured Properties: fetch GET /api/properties?limit=6&sortBy=createdAt&sortOrder=desc, display as responsive grid (3 cols desktop, 2 tablet, 1 mobile)
   - "How It Works" three-step section with icons
   - CTA section at bottom
   - Add smooth scroll animations (fade-in, slide-up) as sections enter viewport
4. PROPERTY LISTING PAGE (Section 4.2): filters sidebar (search, location, price range, bedrooms, category dropdown from API, sort), property cards grid, pagination. Use URL searchParams for filter state. Create loading.tsx with skeleton cards.
5. PROPERTY DETAIL PAGE (Section 4.3): image gallery, property info with formatted rent, description, amenities as chips, landlord info card, reviews section, "Request to Rent" CTA (role-aware: only show for logged-in tenants on available properties). Rental request modal with date pickers and Zod validation.
6. Create custom 404 page (Section 4.4) and error boundary (Section 4.5).
7. Use next/image for ALL property images with proper alt text.
8. Property cards must have hover effects (shadow increase, slight scale) and look premium.
9. Verify: home page loads with real API data (categories + properties), filters work on listing page, property detail shows reviews, rental request form submits successfully.
```

---

## Prompt 6 — Phase 5 (Tenant Dashboard)

```
/goal
Implement Phase 5: Tenant Dashboard from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for all sections (5.1–5.7).
2. Read design-system/MASTER.md for styling. Check design-system/pages/dashboard.md if it exists for dashboard overrides.
3. Tenant layout role guard (Section 5.1): redirect non-TENANT users.
4. Dashboard Overview (Section 5.2): welcome message, stat cards (total requests, active rentals, pending requests, total payments), recent rental requests.
5. My Rentals page (Section 5.3): table/card list with status badges (use the StatusBadge component from Phase 1). Status-based actions:
   - APPROVED → "Pay Now" button (prominent, links to payment flow)
   - ACTIVE/COMPLETED → "Leave Review" button (only if not already reviewed)
   - Filter/tabs by status
6. Leave Review modal (Section 5.4): interactive star rating (1-5), comment textarea, Zod validation. POST /api/reviews. Handle 409 (already reviewed) and 403 errors gracefully with toast.
7. Payment History page (Section 5.5): table with Transaction ID, property, amount (formatted), status badge, date, provider.
8. Profile page (Section 5.6): SHARED by all roles at /dashboard/profile. Display avatar, name, email, role badge. Editable fields: name, phone, address, profileImage URL. Zod validation. PUT /api/auth/me.
9. Use the dashboard layout with sidebar from Phase 1. All data tables must be responsive (horizontal scroll on mobile or card view).
10. Verify: tenant can see rental requests with correct status badges, "Pay Now" appears on APPROVED rentals, review form works, profile update works.
```

---

## Prompt 7 — Phase 6 (Stripe Payment Integration)

```
/goal
Implement Phase 6: Stripe Payment Integration from @implementation.md.

CRITICAL — THIS PHASE IS MANDATORY. FAILURE = 0 MARKS.

RULES:
1. Follow implementation.md EXACTLY for all sections (6.1–6.6).
2. Create src/lib/stripe.ts with loadStripe() using NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
3. Payment Page at /dashboard/tenant/rentals/[id]/pay (Section 6.3):
   - Step 1: Fetch rental request, verify status is APPROVED, call POST /api/payments/create { rentalRequestId }
   - Step 2: Render Stripe Elements with the returned clientSecret
   - Step 3: CheckoutForm component using useStripe() and useElements() hooks, render <PaymentElement />, call stripe.confirmPayment() with return_url
4. Payment Success Page at /payment/success (Section 6.4): read payment_intent from URL params, find the matching payment via GET /api/payments, call POST /api/payments/confirm { paymentId }, show success animation and details.
5. Payment Cancel Page at /payment/cancel (Section 6.5): show cancellation message with "Try Again" and "Go to Dashboard" buttons.
6. Read Section 6.6 Implementation Notes carefully — especially note #3 about finding the paymentId after Stripe redirect.
7. The payment page must show a clear summary of what the tenant is paying for (property name, rent amount) before the Stripe form.
8. Add proper loading states while the PaymentIntent is being created and while payment is processing.
9. Verify: tenant can initiate payment on APPROVED rental → Stripe form renders → test card (4242 4242 4242 4242) → redirect to success page → payment status COMPLETED → rental status ACTIVE.
```

---

## Prompt 8 — Phase 7 (Landlord Dashboard)

```
/goal
Implement Phase 7: Landlord Dashboard from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for all sections (7.1–7.7).
2. Read design-system/MASTER.md for styling. Check design-system/pages/dashboard.md if it exists.
3. Landlord layout role guard (Section 7.1): redirect non-LANDLORD users.
4. Dashboard Overview (Section 7.2): welcome message, stat cards (total properties, available properties, pending requests, active rentals), recent requests, quick action links.
5. My Properties page (Section 7.3): grid of property cards with image, title, location, rent, status badge, request/review counts. "Add New Property" button. Delete with confirmation dialog + error handling (400 if active rentals).
6. Create Property page (Section 7.4): full form with ALL fields listed in the table (title, description, location, address, rent, bedrooms, bathrooms, area, category dropdown from API, amenities multi-select/tag input with common options, image URLs with preview). React Hook Form + Zod (createPropertySchema).
7. Edit Property page (Section 7.5): pre-populate form with existing data from GET /api/properties/:id.
8. Manage Requests page (Section 7.6): table of incoming requests with tenant info, property, dates, status, message. Status-based actions:
   - PENDING → "Approve" (green) and "Reject" (red) buttons
   - ACTIVE → "Mark Complete" button
   - Use confirmation dialogs before all actions
   - Use optimistic UI updates (update status locally before server response)
   - Show toast notifications on success
9. All action handlers: Approve (PATCH /api/landlord/requests/:id → { status: "APPROVED" }), Reject (PATCH → { status: "REJECTED" }), Complete (PATCH /api/landlord/requests/:id/complete).
10. Verify: create property works, edit pre-populates, delete works, approve/reject/complete work with toasts.
```

---

## Prompt 9 — Phase 8 (Admin Dashboard)

```
/goal
Implement Phase 8: Admin Dashboard from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for all sections (8.1–8.7).
2. Read design-system/MASTER.md for styling. Check design-system/pages/dashboard.md if it exists.
3. Admin layout role guard (Section 8.1): redirect non-ADMIN users.
4. Admin Dashboard Overview (Section 8.2): platform-wide stats cards (total users with role breakdown, total properties with status breakdown, total rentals with status breakdown, active rentals count). Recent activity section.
5. User Management (Section 8.3): data table with name, email, role badge, status (Active/Banned), joined date. Client-side search + pagination. Ban/Unban buttons with confirmation dialog. CANNOT ban self or other admins. PATCH /api/admin/users/:id → { isBanned: true/false }.
6. Property Management (Section 8.4): data table of ALL properties. Client-side search + filtering + pagination. Edit modal and delete with confirmation. PUT /api/admin/properties/:id and DELETE.
7. Category Management (Section 8.5): table/cards of categories. Add/Edit via modal (single name input, Zod validation). Create POST /api/admin/categories, Update PUT /api/admin/categories/:id, Delete DELETE /api/admin/categories/:id. Handle 400 error on delete (properties attached).
8. All Rentals Overview (Section 8.6): read-only data table of ALL rental requests. Client-side filtering by status + search. Admin cannot modify rental statuses.
9. All tables must use the DataTable component from Phase 1 with proper pagination and search.
10. Verify: admin dashboard shows stats, ban/unban works (cannot ban self), property edit/delete works, category CRUD works, rentals overview displays all data.
```

---

## Prompt 10 — Phase 9 (Error Handling, Loading States & Polish)

```
/goal
Implement Phase 9: Error Handling, Loading States & Polish from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for all sections (9.1–9.8).
2. Read design-system/MASTER.md for all visual consistency.
3. Global error handling (Section 9.1): ensure error.tsx catches unhandled errors with friendly UI, API errors are transformed to consistent ApiError shape, all forms display inline errors below fields (red text, red border).
4. Loading states (Section 9.2): create loading.tsx skeleton files for ALL routes listed in Section 9.2.1 (properties listing, property detail, tenant rentals, landlord properties, admin users). All TanStack Query hooks must show skeleton while loading, EmptyState when empty, error message when failed. All submit buttons must show spinner + disabled state during submission.
5. Responsive design (Section 9.3): test ALL pages on mobile (320px), tablet (768px), desktop (1024px+). Navbar → hamburger on mobile. Sidebar → overlay on mobile. Property grid → 1/2/3 columns. Data tables → horizontal scroll or card view on mobile.
6. Micro-animations (Section 9.4): add fade-in on page load, card hover scale+shadow, button hover transitions, modal scale-in, skeleton shimmer/pulse. Use CSS transitions and the animation keyframes from the design system.
7. SEO (Section 9.6): add metadata to all public pages. Dynamic generateMetadata for property detail page.
8. Image optimization (Section 9.7): ensure all property images use next/image with proper width, height, alt text.
9. Review EVERY page and component built so far — fix any visual inconsistencies, broken responsive layouts, missing loading states, or ugly edges. The UI must look PREMIUM.
10. Verify: test on mobile viewport, check all loading skeletons render, verify error boundaries work, check all forms show validation errors properly.
```

---

## Prompt 11 — Phase 10 (Final QA, Documentation & Deployment)

```
/goal
Implement Phase 10: Final QA, Documentation & Deployment from @implementation.md.

CRITICAL RULES:
1. Follow implementation.md EXACTLY for all sections (10.1–10.5).
2. Create API_INTEGRATION.md in the project root (Section 10.3) — this is MANDATORY per assignment requirements. Copy the complete mapping table from implementation.md. Include admin credentials: admin@rentnest.com / RentNestAdmin2026.
3. Run through the full flow tests (Section 10.1):
   - Tenant Journey: register → browse → view detail → submit request → (wait for approval) → pay → success → review
   - Landlord Journey: register → create property → view properties → edit → view requests → approve → (wait for payment) → complete
   - Admin Journey: login as admin → view stats → ban user → edit property → delete property → create/edit/delete category → view rentals
4. Fix ANY bugs found during testing.
5. Go through the Final Checklist (Section 10.5) and ensure ALL 10 items are checked:
   - API_INTEGRATION.md exists
   - Toast notifications + inline form errors on all forms
   - Zod + React Hook Form on all forms
   - Admin credentials provided
   - Stripe payment works end-to-end
   - Responsive on mobile/tablet/desktop
   - Loading skeletons on all data-fetching pages
   - Route protection via middleware
   - Three distinct dashboards (Tenant, Landlord, Admin)
6. Create .env.example with all required environment variables (no actual secrets).
7. Verify: the entire app works end-to-end with no console errors, no broken pages, no unstyled elements.
```

---

## ⚡ Quick Reference — Execution Order

| Step | Prompt # | Phases | What It Does |
|------|----------|--------|-------------|
| 1 | Prompt 1 | Phase 0 + 1.0 | Create Next.js project + generate design system |
| 2 | Prompt 2 | Phase 1.1–1.7 | UI components + layouts |
| 3 | Prompt 3 | Phase 2 | Types + API client + hooks |
| 4 | Prompt 4 | Phase 3 | Auth (login, register, middleware) |
| 5 | Prompt 5 | Phase 4 | Home, listings, property detail |
| 6 | Prompt 6 | Phase 5 | Tenant dashboard |
| 7 | Prompt 7 | Phase 6 | Stripe payment |
| 8 | Prompt 8 | Phase 7 | Landlord dashboard |
| 9 | Prompt 9 | Phase 8 | Admin dashboard |
| 10 | Prompt 10 | Phase 9 | Polish, responsive, animations |
| 11 | Prompt 11 | Phase 10 | QA, documentation, final fixes |

> **Tips**:
> - Always wait for one prompt to fully complete before starting the next.
> - If any prompt fails mid-way, re-run it — the agent will pick up where it left off.
> - After Prompt 5 (public pages), you can test the app visually before continuing.
> - After Prompt 7 (Stripe), verify payment works with test card `4242 4242 4242 4242` before proceeding.
