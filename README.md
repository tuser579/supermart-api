# Supermart API

A complete e-commerce backend built with Node.js, Express, TypeScript, and Prisma.

**Status:** Updated & Synchronized (July 26, 2026)

## Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Validation:** Zod
- **Authentication:** JWT

## Features
- 👥 Role-based Access Control (USER, STAFF, ADMIN)
- 🛍️ Product Catalog with Search, Filter & Pagination
- 🛒 Shopping Cart & Checkout
- 📦 Order Management & Status Tracking
- 🛵 Delivery Staff Assignment & Attendance
- 📊 Admin Dashboard & Sales Reports
- ⭐ Product Reviews & Ratings
- 🔔 In-App Notifications

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud like NeonDB)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

3. **Database Setup:**
   Run migrations and seed the database:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```
   *Note: Seeding creates an Admin, a Staff member, a User, and 10 sample products.*

4. **Run the Server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000/api/v1`

### Docker Setup
You can run the entire stack (API + PostgreSQL) using Docker Compose:
```bash
docker-compose up -d
```

## Default Seeded Accounts
- **Admin:** `admin@supermart.com` / `Admin@123`
- **Staff:** `delivery@supermart.com` / `Staff@123`
- **User:** `user@supermart.com` / `User@123`

## API Endpoints Overview

| Module | Route Prefix | Key Endpoints |
|--------|--------------|---------------|
| **Auth** | `/auth` | Register, Login, Verify OTP, Refresh Token |
| **User** | `/users` | Get/Update Profile, Change Password |
| **Product** | `/products` | List, Search, Filter, Get by ID. (Admin: Create, Update, Delete) |
| **Cart** | `/cart` | Get Cart, Add Item, Update Item, Remove Item |
| **Order** | `/orders` | Checkout, List, Track. (Admin/Staff: Update Status, Assign) |
| **Staff** | `/staff` | Orders, Attendance, Earnings. (Admin: Create, View All) |
| **Admin** | `/admin` | Dashboard Stats, Sales Reports, Top Products, User Management |
| **Review** | `/reviews` | Get Product Reviews, Add Review (Verified Purchasers only) |
| **Notice** | `/notifications`| Get Notifications, Mark as Read |

## Architecture
- `src/modules/` - Feature modules (auth, user, product, etc.)
- `src/shared/` - Shared utilities, middleware, config, constants
- `src/prisma/` - Database schema and migrations
  
