# Supermart API — Admin Panel Complete Documentation & Frontend Integration Guide

This document provides complete documentation for all Admin Panel API endpoints, data models, request/response bodies, quick options, and frontend integration code snippets.

---

## 1. Authentication Requirements

All Admin endpoints require an HTTP Authorization header containing a valid JWT access token for a user with the `ADMIN` role:

```http
Authorization: Bearer <ADMIN_JWT_ACCESS_TOKEN>
Content-Type: application/json
```

---

## 2. Standard API Response Structure

### Success Response Format
```json
{
  "success": true,
  "message": "Descriptive message explaining outcome",
  "data": { ... } // Single object, array, or null
}
```

### Paginated Response Format
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 3. Quick Options & Dashboard Overview

### Get Admin Quick Options
- **Endpoint**: `GET /api/v1/admin/quick-options`
- **Description**: Returns quick metrics and action lists for staff assigned orders, cancellable orders, and out-of-stock inventory.
- **Request Body**: None
- **Response**:
```json
{
  "success": true,
  "message": "Admin quick options retrieved successfully",
  "data": {
    "assignedOrdersOptions": {
      "totalAssignedOrders": 12,
      "unassignedPendingOrders": 3,
      "availableDeliveryStaff": 5,
      "recentAssignedOrders": [
        {
          "id": "order_uuid_1",
          "orderId": "SM-L1K23-A99",
          "status": "CONFIRMED",
          "totalAmount": 450,
          "assignedStaff": {
            "id": "staff_uuid_1",
            "staffId": "STF-101",
            "position": "Delivery Agent",
            "user": { "name": "John Delivery", "phone": "01700000001" }
          },
          "user": { "name": "Customer Name", "phone": "01800000002" },
          "updatedAt": "2026-07-26T22:00:00.000Z"
        }
      ],
      "staffWorkloadSummary": [
        {
          "staffId": "staff_uuid_1",
          "code": "STF-101",
          "name": "John Delivery",
          "isAvailable": true,
          "activeAssignedCount": 2
        }
      ]
    },
    "orderCancelOptions": {
      "cancellableOrdersCount": 7,
      "totalCancelledCount": 4,
      "recentCancelledOrders": [
        {
          "id": "order_uuid_2",
          "orderId": "SM-L1K23-B88",
          "totalAmount": 280,
          "cancellationReason": "Out of stock items",
          "user": { "name": "Alice Customer", "email": "alice@example.com" },
          "updatedAt": "2026-07-26T21:30:00.000Z"
        }
      ],
      "quickCancelEligibleStatuses": ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"]
    },
    "outOfStockOptions": {
      "totalOutOfStock": 2,
      "totalLowStock": 4,
      "recentOutOfStockProducts": [
        {
          "id": "prod_uuid_1",
          "name": "Fresh Organic Milk (1L)",
          "price": 90,
          "category": "Dairy",
          "stock": 0,
          "images": ["https://example.com/milk.jpg"],
          "updatedAt": "2026-07-26T20:00:00.000Z"
        }
      ],
      "recentLowStockProducts": [
        {
          "id": "prod_uuid_2",
          "name": "Fresh Eggs (12 pcs)",
          "price": 140,
          "category": "Dairy",
          "stock": 3,
          "images": ["https://example.com/eggs.jpg"],
          "updatedAt": "2026-07-26T19:00:00.000Z"
        }
      ]
    },
    "cashPaymentOptions": {
      "totalCodOrders": 15,
      "pendingCodOrders": 3,
      "pendingCodAmount": 1450,
      "collectedCodAmount": 12800
    },
    "quickActions": [
      { "action": "ASSIGN_STAFF", "method": "POST", "endpoint": "/api/v1/orders/:id/assign" },
      { "action": "VIEW_ASSIGNED_ORDERS", "method": "GET", "endpoint": "/api/v1/admin/orders/assigned" },
      { "action": "CANCEL_ORDER", "method": "POST", "endpoint": "/api/v1/admin/orders/:id/cancel" },
      { "action": "RECORD_PAYMENT", "method": "POST", "endpoint": "/api/v1/orders/:id/pay" },
      { "action": "VIEW_OUT_OF_STOCK", "method": "GET", "endpoint": "/api/v1/admin/products/out-of-stock" },
      { "action": "RESTOCK_PRODUCT", "method": "PATCH", "endpoint": "/api/v1/admin/products/:id/restock" },
      { "action": "LIST_PRODUCTS", "method": "GET", "endpoint": "/api/v1/admin/products" },
      { "action": "CREATE_PRODUCT", "method": "POST", "endpoint": "/api/v1/admin/products" },
      { "action": "EDIT_PRODUCT", "method": "PUT", "endpoint": "/api/v1/admin/products/:id" },
      { "action": "DELETE_PRODUCT", "method": "DELETE", "endpoint": "/api/v1/admin/products/:id" }
    ]
  }
}
```

### Get Dashboard Statistics
- **Endpoint**: `GET /api/v1/admin/dashboard`
- **Response**:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved",
  "data": {
    "users": { "total": 150, "active": 142, "newToday": 5 },
    "orders": { "total": 450, "pending": 12, "delivered": 400, "completed": 10, "cancelled": 28, "revenue": 185000 },
    "cashPayment": { "pendingCodAmount": 1450, "collectedCodAmount": 12800, "totalCodOrders": 15 },
    "products": { "total": 85, "outOfStock": 3 },
    "staff": { "total": 10, "available": 7 }
  }
}
```

---

## 4. Staff Assigned Orders Management

### Get Staff Assigned Orders
- **Endpoint**: `GET /api/v1/admin/orders/assigned`
- **Query Params**: `staffId` (optional), `page` (default 1), `limit` (default 20)
- **Response**:
```json
{
  "success": true,
  "message": "Assigned orders retrieved successfully",
  "data": [
    {
      "id": "order_uuid_100",
      "orderId": "SM-M1K22-Z11",
      "status": "CONFIRMED",
      "totalAmount": 650,
      "assignedStaff": {
        "id": "staff_uuid_1",
        "staffId": "STF-101",
        "position": "Delivery Boy",
        "user": { "name": "John Delivery", "phone": "01700000001", "email": "staff1@supermart.com" }
      },
      "user": { "id": "user_uuid_1", "name": "Customer Name", "email": "customer@example.com", "phone": "01800000002" },
      "items": [
        {
          "id": "item_uuid_1",
          "quantity": 2,
          "price": 300,
          "product": { "id": "prod_1", "name": "Rice (5kg)", "images": ["https://example.com/rice.jpg"] }
        }
      ]
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1, "hasNext": false, "hasPrev": false }
}
```

### Assign Staff to Order
- **Endpoint**: `POST /api/v1/orders/:id/assign`
- **Request Body**:
```json
{
  "staffId": "staff_uuid_1"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Delivery assigned successfully",
  "data": {
    "id": "order_uuid_100",
    "orderId": "SM-M1K22-Z11",
    "assignedStaffId": "staff_uuid_1",
    "status": "CONFIRMED"
  }
}
```

---

## 5. Admin Order Cancellation

- **Endpoint**: `POST /api/v1/admin/orders/:id/cancel` (or `POST /api/v1/orders/:id/cancel`)
- **Description**: Cancels an active order, records reason, restores inventory stock, and notifies customer.
- **Request Body**:
```json
{
  "reason": "Out of stock item / Cancelled by Admin"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Order cancelled by admin successfully",
  "data": {
    "id": "order_uuid_100",
    "orderId": "SM-M1K22-Z11",
    "status": "CANCELLED",
    "cancellationReason": "Out of stock item / Cancelled by Admin"
  }
}
```

---

## 6. Out of Stock & Low Stock Management

### Get Out of Stock / Low Stock Products List
- **Endpoint**: `GET /api/v1/admin/products/out-of-stock`
- **Query Params**: `status` (`out_of_stock` | `low_stock` | `all`), `page` (default 1), `limit` (default 20)
- **Response**:
```json
{
  "success": true,
  "message": "Out of stock products retrieved successfully",
  "data": [
    {
      "id": "prod_uuid_1",
      "name": "Fresh Organic Milk (1L)",
      "price": 90,
      "discountPrice": 85,
      "category": "Dairy",
      "brand": "Supermart",
      "stock": 0,
      "images": ["https://example.com/milk.jpg"],
      "updatedAt": "2026-07-26T20:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1, "hasNext": false, "hasPrev": false }
}
```

### Quick Product Restock
- **Endpoint**: `PATCH /api/v1/admin/products/:id/restock`
- **Request Body** (Option A: Add relative stock):
```json
{
  "addStock": 50
}
```
- **Request Body** (Option B: Set absolute stock):
```json
{
  "stock": 100
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Product restocked successfully",
  "data": {
    "id": "prod_uuid_1",
    "name": "Fresh Organic Milk (1L)",
    "price": 90,
    "category": "Dairy",
    "stock": 50,
    "updatedAt": "2026-07-26T23:10:00.000Z"
  }
}
```

---

## 7. Admin Products Management CRUD

### Get All Products List (Active & Inactive)
- **Endpoint**: `GET /api/v1/admin/products`
- **Query Params**: `search`, `category`, `minPrice`, `maxPrice`, `inStock`, `outOfStock`, `lowStock`, `includeInactive` (default true), `page`, `limit`
- **Response**: Paginated list of products.

### Add New Product
- **Endpoint**: `POST /api/v1/admin/products`
- **Request Body**:
```json
{
  "name": "Fresh Organic Apples (1kg)",
  "description": "Crisp red apples from organic orchards.",
  "price": 180,
  "discountPrice": 160,
  "category": "Fruits",
  "brand": "Supermart Organics",
  "stock": 50,
  "images": ["https://example.com/apples.jpg"]
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Product created successfully by admin",
  "data": {
    "id": "prod_new_uuid",
    "name": "Fresh Organic Apples (1kg)",
    "price": 180,
    "discountPrice": 160,
    "category": "Fruits",
    "stock": 50,
    "isActive": true
  }
}
```

### Edit Product (Including Image Change)
- **Endpoint**: `PUT /api/v1/admin/products/:id`
- **Request Body**: Partial update object (Supports updating `images` array, single `image` URL string, `imageUrl` URL string, `price`, `stock`, `name`, etc.)
```json
{
  "price": 170,
  "stock": 60,
  "images": [
    "https://example.com/new-apple-photo-1.jpg",
    "https://example.com/new-apple-photo-2.jpg"
  ],
  "image": "https://example.com/new-apple-main.jpg"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Product updated successfully by admin",
  "data": {
    "id": "prod_new_uuid",
    "name": "Fresh Organic Apples (1kg)",
    "price": 170,
    "stock": 60,
    "images": [
      "https://example.com/new-apple-main.jpg",
      "https://example.com/new-apple-photo-1.jpg",
      "https://example.com/new-apple-photo-2.jpg"
    ]
  }
}
```

### Update Product Images (Dedicated Endpoint)
- **Endpoint**: `PATCH /api/v1/admin/products/:id/images`
- **Request Body**:
```json
{
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```
*(Or single image string: `{ "image": "https://example.com/image1.jpg" }`)*
- **Response**:
```json
{
  "success": true,
  "message": "Product images updated successfully by admin",
  "data": {
    "id": "prod_new_uuid",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
  }
}
```

### Delete / Deactivate Product
- **Endpoint**: `DELETE /api/v1/admin/products/:id`
- **Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully by admin",
  "data": null
}
```

---

## 8. Reports & User/Staff Management

### Get Sales Report
- **Endpoint**: `GET /api/v1/admin/reports/sales?period=daily&days=30`
- **Response**: Array of dates with order counts and revenues.

### Get Top Products Report
- **Endpoint**: `GET /api/v1/admin/reports/products?limit=10`
- **Response**: Array of top selling products.

### Get Staff Performance
- **Endpoint**: `GET /api/v1/admin/staff/performance`
- **Response**: List of staff members with ratings, total deliveries, and earnings.

### Get Users List
- **Endpoint**: `GET /api/v1/admin/users?role=USER&search=John&page=1&limit=20`
- **Response**: Paginated list of users.

### Toggle User Status (Activate / Deactivate)
- **Endpoint**: `PATCH /api/v1/admin/users/:userId/status`
- **Response**:
```json
{
  "success": true,
  "message": "User activated",
  "data": { "id": "user_uuid", "name": "John Doe", "isActive": true }
}
```

---

## 9. Frontend Integration Service Code (`adminApi.ts`)

Copy and paste this clean TypeScript service into your React / React Native / Next.js / Vue app:

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://your-supermart-api.up.railway.app/api/v1';

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT Token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Quick Options
export const fetchQuickOptions = async () => (await adminApi.get('/admin/quick-options')).data;

// Orders
export const fetchAssignedOrders = async (staffId?: string, page = 1) =>
  (await adminApi.get('/admin/orders/assigned', { params: { staffId, page } })).data;

export const assignStaff = async (orderId: string, staffId: string) =>
  (await adminApi.post(`/orders/${orderId}/assign`, { staffId })).data;

export const cancelOrder = async (orderId: string, reason?: string) =>
  (await adminApi.post(`/admin/orders/${orderId}/cancel`, { reason })).data;

// Inventory & Out of Stock
export const fetchOutOfStockProducts = async (status = 'all', page = 1) =>
  (await adminApi.get('/admin/products/out-of-stock', { params: { status, page } })).data;

export const restockProduct = async (productId: string, addStock?: number, stock?: number) =>
  (await adminApi.patch(`/admin/products/${productId}/restock`, { addStock, stock })).data;

// Products CRUD
export const fetchAdminProducts = async (params: any = {}) =>
  (await adminApi.get('/admin/products', { params })).data;

export const createProduct = async (productData: any) =>
  (await adminApi.post('/admin/products', productData)).data;

export const updateProduct = async (productId: string, productData: any) =>
  (await adminApi.put(`/admin/products/${productId}`, productData)).data;

export const deleteProduct = async (productId: string) =>
  (await adminApi.delete(`/admin/products/${productId}`)).data;
```
