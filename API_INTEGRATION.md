# RentNest API Integration

This document maps all the frontend components to their respective backend API routes, as implemented in the RentNest Frontend.

## Admin Credentials
To access the admin dashboard, please use the following credentials:
- **Email:** admin@rentnest.com
- **Password:** RentNestAdmin2026

---

## Backend API Mapping

| Endpoint | Method | Auth | Role | Purpose |
|----------|--------|------|------|---------|
| `/auth/register` | POST | ✗ | — | Register |
| `/auth/login` | POST | ✗ | — | Login |
| `/auth/me` | GET | ✓ | Any | Get profile |
| `/auth/me` | PUT | ✓ | Any | Update profile |
| `/auth/refresh-token` | POST | Cookie | — | Refresh access token |
| `/properties` | GET | ✗ | — | List properties (paginated, filtered) |
| `/properties/:id` | GET | ✗ | — | Property detail (with reviews) |
| `/categories` | GET | ✗ | — | List categories |
| `/rentals` | POST | ✓ | TENANT | Create rental request |
| `/rentals` | GET | ✓ | TENANT | Get own rentals |
| `/rentals/:id` | GET | ✓ | T/L | Get rental by ID |
| `/payments/create` | POST | ✓ | TENANT | Create Stripe PaymentIntent |
| `/payments/confirm` | POST | ✓ | TENANT | Confirm payment |
| `/payments/simulate-pay` | POST | ✓ | TENANT | Test payment |
| `/payments` | GET | ✓ | TENANT | Payment history |
| `/payments/:id` | GET | ✓ | TENANT | Payment detail |
| `/reviews` | POST | ✓ | TENANT | Create review |
| `/landlord/properties` | GET/POST | ✓ | LANDLORD | CRUD own properties |
| `/landlord/properties/:id` | PUT/DELETE | ✓ | LANDLORD | Update/delete own property |
| `/landlord/requests` | GET | ✓ | LANDLORD | Get requests for own properties |
| `/landlord/requests/:id` | PATCH | ✓ | LANDLORD | Approve/reject request |
| `/landlord/requests/:id/complete` | PATCH | ✓ | LANDLORD | Complete rental |
| `/admin/users` | GET | ✓ | ADMIN | List all users |
| `/admin/users/:id` | PATCH | ✓ | ADMIN | Ban/unban user |
| `/admin/properties` | GET | ✓ | ADMIN | List all properties |
| `/admin/properties/:id` | PUT/DELETE | ✓ | ADMIN | Update/delete any property |
| `/admin/rentals` | GET | ✓ | ADMIN | List all rentals |
| `/admin/categories` | POST | ✓ | ADMIN | Create category |
| `/admin/categories/:id` | PUT/DELETE | ✓ | ADMIN | Update/delete category |
