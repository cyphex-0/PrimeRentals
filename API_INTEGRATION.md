# RentNest API Integration

This document maps all the **frontend components and pages** to their respective **backend API routes**, as implemented in the RentNest Frontend.

## Admin Credentials
To access the admin dashboard, please use the following credentials:
- **Email:** admin@rentnest.com
- **Password:** RentNestAdmin2026

---

## Component to API Mapping

| Frontend Page / Component | Backend Endpoint | Method | Role |
|---------------------------|------------------|--------|------|
| **Public & Auth** | | | |
| src/app/auth/register/page.tsx | /api/auth/register | POST | — |
| src/app/auth/login/page.tsx | /api/auth/login | POST | — |
| src/lib/providers/auth-provider.tsx | /api/auth/me | GET | Any |
| src/app/(dashboard)/dashboard/profile/page.tsx | /api/auth/me | PUT | Any |
| src/lib/api/client.ts (Interceptor) | /api/auth/refresh-token | POST | — |
| src/app/(public)/properties/page.tsx | /api/properties | GET | — |
| src/app/(public)/properties/[id]/page.tsx | /api/properties/:id | GET | — |
| src/components/home/categories-section.tsx | /api/categories | GET | — |
| **Tenant Dashboard** | | | |
| src/components/rentals/rental-request-modal.tsx | /api/rentals | POST | TENANT |
| src/app/(dashboard)/dashboard/tenant/rentals/page.tsx | /api/rentals | GET | TENANT |
| src/app/(dashboard)/dashboard/tenant/payments/page.tsx | /api/payments/create | POST | TENANT |
| src/components/payments/checkout-form.tsx | /api/payments/confirm | POST | TENANT |
| src/app/(public)/payment/success/page.tsx | /api/payments/:id | GET | TENANT |
| src/app/(dashboard)/dashboard/tenant/page.tsx | /api/payments | GET | TENANT |
| src/components/reviews/leave-review-modal.tsx | /api/reviews | POST | TENANT |
| **Landlord Dashboard** | | | |
| src/app/(dashboard)/dashboard/landlord/properties/page.tsx | /api/landlord/properties | GET | LANDLORD |
| src/app/(dashboard)/dashboard/landlord/properties/new/page.tsx | /api/landlord/properties | POST | LANDLORD |
| src/app/(dashboard)/dashboard/landlord/properties/[id]/edit/page.tsx| /api/landlord/properties/:id | PUT | LANDLORD |
| src/components/properties/property-list.tsx (Delete)| /api/landlord/properties/:id | DELETE | LANDLORD |
| src/app/(dashboard)/dashboard/landlord/requests/page.tsx | /api/landlord/requests | GET | LANDLORD |
| src/app/(dashboard)/dashboard/landlord/requests/page.tsx (Actions) | /api/landlord/requests/:id | PATCH | LANDLORD |
| src/app/(dashboard)/dashboard/landlord/requests/page.tsx (Actions) | /api/landlord/requests/:id/complete | PATCH | LANDLORD |
| **Admin Dashboard** | | | |
| src/app/(dashboard)/dashboard/admin/users/page.tsx | /api/admin/users | GET | ADMIN |
| src/app/(dashboard)/dashboard/admin/users/page.tsx (Actions) | /api/admin/users/:id | PATCH | ADMIN |
| src/app/(dashboard)/dashboard/admin/properties/page.tsx | /api/admin/properties | GET | ADMIN |
| src/app/(dashboard)/dashboard/admin/properties/page.tsx (Actions) | /api/admin/properties/:id | PUT/DELETE | ADMIN |
| src/app/(dashboard)/dashboard/admin/rentals/page.tsx | /api/admin/rentals | GET | ADMIN |
| src/app/(dashboard)/dashboard/admin/categories/page.tsx | /api/admin/categories | POST | ADMIN |
| src/app/(dashboard)/dashboard/admin/categories/page.tsx (Actions)| /api/admin/categories/:id | PUT/DELETE | ADMIN |

## 3rd Party API Integrations

| Feature | API Provider | Endpoint | Method |
|---------|--------------|----------|--------|
| Profile Image Upload | ImgBB | `https://api.imgbb.com/1/upload` | POST |
