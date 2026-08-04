# Supermart API — Staff Panel Complete Documentation & Frontend Integration Guide

This document provides complete documentation for all Staff Panel API endpoints, data models, request/response bodies, action checking, dashboard quick options, and frontend integration code snippets.

---

## 1. Authentication Requirements

All Staff endpoints require an HTTP Authorization header containing a valid JWT access token for a user with the `STAFF` role:

```http
Authorization: Bearer <STAFF_JWT_ACCESS_TOKEN>
Content-Type: application/json
```

---

## 2. Standard API Response Structure

### Success Response Format
```json
{
  "success": true,
  "message": "Descriptive outcome message",
  "data": { ... }
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
    "total": 15,
    "totalPages": 1,
    "hasNext": false,
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

## 3. Staff Quick Options & Action Checking Dashboard

### Get Staff Quick Options
- **Endpoint**: `GET /api/v1/staff/quick-options`
- **Description**: Consolidated action checking summary for staff members including today's attendance status, assigned order workload summary, active delivery orders, availability toggle state, and permitted quick actions list.
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "message": "Staff quick options retrieved successfully",
  "data": {
    "profile": {
      "staffId": "STAFF-0001",
      "position": "DELIVERY_BOY",
      "shift": "MORNING",
      "rating": 4.8,
      "isAvailable": true,
      "totalDeliveries": 24,
      "earnings": 1200
    },
    "todayAttendance": {
      "attendanceId": "att_uuid_1",
      "status": "PRESENT",
      "checkIn": "2026-07-27T08:00:00.000Z",
      "checkOut": null,
      "canCheckIn": false,
      "canCheckOut": true
    },
    "workload": {
      "totalAssignedOrders": 5,
      "activeDeliveriesCount": 2,
      "completedDeliveriesTodayCount": 3
    },
    "cashSummary": {
      "pendingCashToCollect": 950,
      "totalCashCollected": 4200,
      "cashCollectedToday": 1350
    },
    "recentAssignedOrders": [
      {
        "id": "ord_uuid_1",
        "orderId": "SM-L1K23-A99",
        "status": "SHIPPED",
        "totalAmount": 450,
        "paymentMethod": "COD",
        "paymentStatus": "PENDING",
        "deliveryAddress": {
          "addressLine1": "House 12, Road 5",
          "city": "Dhaka",
          "area": "Dhanmondi"
        },
        "user": {
          "name": "Customer Name",
          "phone": "01800000002"
        },
        "createdAt": "2026-07-27T01:00:00.000Z",
        "updatedAt": "2026-07-27T01:15:00.000Z"
      }
    ],
    "quickActions": [
      {
        "action": "MARK_ATTENDANCE_CHECKIN",
        "method": "POST",
        "endpoint": "/api/v1/staff/attendance",
        "description": "Mark check-in for today attendance"
      },
      {
        "action": "MARK_ATTENDANCE_CHECKOUT",
        "method": "POST",
        "endpoint": "/api/v1/staff/attendance",
        "description": "Mark check-out for today attendance"
      },
      {
        "action": "TOGGLE_AVAILABILITY",
        "method": "PATCH",
        "endpoint": "/api/v1/staff/availability",
        "description": "Update staff availability status (true/false)"
      },
      {
        "action": "VIEW_ASSIGNED_ORDERS",
        "method": "GET",
        "endpoint": "/api/v1/staff/orders",
        "description": "Get all orders assigned to current staff member"
      },
      {
        "action": "UPDATE_ORDER_STATUS",
        "method": "PUT",
        "endpoint": "/api/v1/orders/:id/status",
        "description": "Update assigned order status (CONFIRMED -> PROCESSING -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED -> COMPLETED)"
      },
      {
        "action": "COLLECT_CASH_PAYMENT",
        "method": "POST",
        "endpoint": "/api/v1/orders/:id/pay",
        "description": "Record cash payment collected after order delivery"
      },
      {
        "action": "VIEW_STAFF_PROFILE",
        "method": "GET",
        "endpoint": "/api/v1/staff/profile",
        "description": "Retrieve current staff profile details"
      },
      {
        "action": "VIEW_STAFF_EARNINGS",
        "method": "GET",
        "endpoint": "/api/v1/staff/earnings",
        "description": "View delivery earnings and performance metrics"
      }
    ]
  }
}
```

---

## 4. Complete Endpoints Reference

### 4.1 Staff Profile

#### Get My Profile
- **Endpoint**: `GET /api/v1/staff/profile`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "message": "Staff profile retrieved",
  "data": {
    "id": "staff_uuid_101",
    "userId": "user_uuid_201",
    "staffId": "STAFF-0001",
    "position": "DELIVERY_BOY",
    "joiningDate": "2026-01-15T00:00:00.000Z",
    "salary": 18000,
    "shift": "MORNING",
    "assignedArea": ["Dhanmondi", "Mirpur"],
    "rating": 4.85,
    "totalDeliveries": 42,
    "earnings": 2100,
    "isAvailable": true,
    "user": {
      "id": "user_uuid_201",
      "name": "Alex Staff",
      "email": "alex.staff@supermart.com",
      "phone": "+8801700000099",
      "profileImage": "https://example.com/avatar.jpg"
    }
  }
}
```

---

### 4.2 Staff Assigned Orders & Lifecycle Progression

#### 4.2.1 Order Step Progression Flow
```
1. PENDING          -> Order placed by customer (assignedStaffId: null)
2. CONFIRMED        -> Admin/System confirms order (status: "CONFIRMED")
3. ASSIGNED STAFF   -> Admin assigns Staff (POST /api/v1/orders/:id/assign) -> Order marked CONFIRMED with assignedStaffId
4. PROCESSING       -> Staff/Admin starts warehouse processing (PUT /api/v1/orders/:id/status -> "PROCESSING")
5. SHIPPED          -> Order packaged & dispatched (status: "SHIPPED")
6. OUT_FOR_DELIVERY -> Handed over for delivery (status: "OUT_FOR_DELIVERY")
7. DELIVERED        -> Product delivered to customer (status: "DELIVERED")
8. COMPLETED        -> Staff collects cash & clicks "Record and Completed" (POST /api/v1/orders/:id/pay) -> status & paymentStatus: "COMPLETED"
```

#### 4.2.2 Get My Assigned Orders
- **Endpoint**: `GET /api/v1/staff/orders`
- **Query Params**: `page` (default 1), `limit` (default 20), `status` (optional: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "message": "Staff orders retrieved",
  "data": [
    {
      "id": "ord_uuid_101",
      "orderId": "SM-L1K23-A99",
      "userId": "user_uuid_301",
      "totalAmount": 520,
      "discount": 0,
      "deliveryCharge": 50,
      "status": "SHIPPED",
      "paymentMethod": "COD",
      "paymentStatus": "PENDING",
      "deliveryAddress": {
        "label": "Home",
        "fullName": "Jane Customer",
        "phone": "+8801800000002",
        "addressLine1": "House 45, Road 11",
        "city": "Dhaka",
        "area": "Dhanmondi"
      },
      "assignedStaffId": "staff_uuid_101",
      "createdAt": "2026-07-27T01:00:00.000Z",
      "updatedAt": "2026-07-27T01:15:00.000Z",
      "user": {
        "id": "user_uuid_301",
        "name": "Jane Customer",
        "phone": "+8801800000002"
      },
      "items": [
        {
          "id": "item_uuid_1",
          "quantity": 2,
          "price": 235,
          "product": {
            "name": "Organic Honey (500g)",
            "images": ["https://example.com/honey.jpg"]
          }
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### Get Single Order Details
- **Endpoint**: `GET /api/v1/orders/:id`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "message": "Order retrieved",
  "data": {
    "id": "ord_uuid_101",
    "orderId": "SM-L1K23-A99",
    "userId": "user_uuid_301",
    "totalAmount": 520,
    "discount": 0,
    "deliveryCharge": 50,
    "status": "SHIPPED",
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "deliveryAddress": {
      "label": "Home",
      "fullName": "Jane Customer",
      "phone": "+8801800000002",
      "addressLine1": "House 45, Road 11",
      "city": "Dhaka",
      "area": "Dhanmondi"
    },
    "items": [
      {
        "id": "item_uuid_1",
        "quantity": 2,
        "price": 235,
        "product": {
          "id": "prod_uuid_1",
          "name": "Organic Honey (500g)",
          "images": ["https://example.com/honey.jpg"],
          "price": 235,
          "description": "Pure raw organic honey"
        }
      }
    ],
    "user": {
      "id": "user_uuid_301",
      "name": "Jane Customer",
      "email": "jane@example.com",
      "phone": "+8801800000002"
    },
    "assignedStaff": {
      "user": {
        "name": "Alex Staff",
        "phone": "+8801700000099"
      }
    }
  }
}
```

---

### 4.3 Order Status Updates & Action Checking

#### 4.3.1 Update Assigned Order Status
- **Endpoint**: `PUT /api/v1/orders/:id/status`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Rules**: Staff can only update orders assigned to them.
- **Allowed State Transitions**:
  - `PENDING` -> `CONFIRMED`, `CANCELLED`
  - `CONFIRMED` -> `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`
  - `PROCESSING` -> `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`
  - `SHIPPED` -> `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`
  - `OUT_FOR_DELIVERY` -> `DELIVERED`, `CANCELLED`
  - `DELIVERED` -> `RETURN_REQUESTED`, `RETURNED`
- **Guard Rule**: Order status cannot be updated manually to `COMPLETED` via `PUT /api/v1/orders/:id/status` if `paymentMethod` is `COD` and `paymentStatus` is `PENDING`. Staff MUST record cash collection via `POST /api/v1/orders/:id/pay`.
- **Request Body**:
```json
{
  "status": "DELIVERED"
}
```
- **Response Body**:
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "id": "ord_uuid_101",
    "orderId": "SM-L1K23-A99",
    "status": "DELIVERED",
    "deliveredAt": "2026-07-27T01:40:00.000Z",
    "assignedStaffId": "staff_uuid_101",
    "updatedAt": "2026-07-27T01:40:00.000Z"
  }
}
```

#### 4.3.2 Record Cash Payment & Complete Order ("Record and Completed" Button)
- **Endpoint**: `POST /api/v1/orders/:id/pay`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Description**: Triggered when staff clicks "Record and Completed" upon collecting cash from customer. Automatically sets `paymentStatus` = `COMPLETED`, `status` = `COMPLETED`, updates staff earnings & delivery count (+1), and notifies customer.
- **Allowed States**: Order status is `OUT_FOR_DELIVERY` or `DELIVERED`, and `paymentStatus` is `PENDING`.
- **Request Body**:
```json
{
  "paymentMethod": "COD",
  "transactionId": "CASH-REC-STAFF-101"
}
```
- **Response Body**:
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "id": "ord_uuid_101",
    "orderId": "SM-L1K23-A99",
    "status": "COMPLETED",
    "paymentMethod": "COD",
    "paymentStatus": "COMPLETED",
    "transactionId": "CASH-REC-STAFF-101",
    "updatedAt": "2026-08-04T15:00:00.000Z"
  }
}
```

---

### 4.4 Attendance Management

#### Mark Check-In
- **Endpoint**: `POST /api/v1/staff/attendance`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**:
```json
{
  "checkIn": "2026-07-27T08:00:00.000Z",
  "status": "PRESENT"
}
```
- **Response Body**:
```json
{
  "success": true,
  "message": "Attendance marked",
  "data": {
    "id": "att_uuid_501",
    "staffId": "staff_uuid_101",
    "date": "2026-07-27T00:00:00.000Z",
    "checkIn": "2026-07-27T08:00:00.000Z",
    "checkOut": null,
    "status": "PRESENT",
    "createdAt": "2026-07-27T08:00:00.000Z"
  }
}
```

#### Mark Check-Out
- **Endpoint**: `POST /api/v1/staff/attendance`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**:
```json
{
  "checkOut": "2026-07-27T17:00:00.000Z"
}
```
- **Response Body**:
```json
{
  "success": true,
  "message": "Attendance marked",
  "data": {
    "id": "att_uuid_501",
    "staffId": "staff_uuid_101",
    "date": "2026-07-27T00:00:00.000Z",
    "checkIn": "2026-07-27T08:00:00.000Z",
    "checkOut": "2026-07-27T17:00:00.000Z",
    "status": "PRESENT"
  }
}
```

#### Get Attendance Logs
- **Endpoint**: `GET /api/v1/staff/attendance`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "message": "Attendance records retrieved",
  "data": [
    {
      "id": "att_uuid_501",
      "staffId": "staff_uuid_101",
      "date": "2026-07-27T00:00:00.000Z",
      "checkIn": "2026-07-27T08:00:00.000Z",
      "checkOut": "2026-07-27T17:00:00.000Z",
      "status": "PRESENT",
      "createdAt": "2026-07-27T08:00:00.000Z"
    }
  ]
}
```

---

### 4.5 Availability Status Toggle

#### Update Availability Status
- **Endpoint**: `PATCH /api/v1/staff/availability`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**:
```json
{
  "isAvailable": true
}
```
- **Response Body**:
```json
{
  "success": true,
  "message": "Availability updated",
  "data": {
    "id": "staff_uuid_101",
    "userId": "user_uuid_201",
    "staffId": "STAFF-0001",
    "isAvailable": true,
    "updatedAt": "2026-07-27T01:42:00.000Z"
  }
}
```

---

### 4.6 Staff Earnings & Performance

#### Get Staff Earnings Overview
- **Endpoint**: `GET /api/v1/staff/earnings`
- **Request Headers**: `Authorization: Bearer <STAFF_TOKEN>`
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "message": "Earnings retrieved",
  "data": {
    "earnings": 2100,
    "totalDeliveries": 42,
    "rating": 4.85,
    "salary": 18000,
    "deliveredOrders": 42
  }
}
```

---

## 5. Frontend Integration Snippet (TypeScript / Fetch)

```typescript
const BASE_URL = 'https://supermart-api.up.railway.app/api/v1';

export const staffApi = {
  // Fetch dashboard action checking & quick options summary
  getQuickOptions: async (token: string) => {
    const res = await fetch(`${BASE_URL}/staff/quick-options`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Toggle staff online availability
  updateAvailability: async (token: string, isAvailable: boolean) => {
    const res = await fetch(`${BASE_URL}/staff/availability`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isAvailable })
    });
    return res.json();
  },

  // Mark attendance (check-in / check-out)
  markAttendance: async (token: string, payload: { checkIn?: string; checkOut?: string; status?: string }) => {
    const res = await fetch(`${BASE_URL}/staff/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Update status of assigned order (e.g. CONFIRMED -> PROCESSING -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED)
  updateOrderStatus: async (token: string, orderId: string, status: string) => {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Record Cash Payment & Complete Order ("Record and Completed" Button)
  recordCashAndComplete: async (token: string, orderId: string, transactionId?: string) => {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentMethod: 'COD',
        transactionId: transactionId || `CASH-${Date.now()}`
      })
    });
    return res.json();
  }
};

// UI Condition helper to show "Record and Completed" button in Staff App
export const canShowRecordAndCompletedButton = (order: {
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}) => {
  return (
    (order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED') &&
    order.paymentMethod === 'COD' &&
    order.paymentStatus === 'PENDING'
  );
};
```
