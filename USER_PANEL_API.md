# Supermart API - User Panel Endpoints

This document provides a comprehensive list of all endpoints relevant to the "User Panel" (frontend application), including their response structures based on the `ApiResponse` format used throughout the backend.

All successful responses follow this base format:
```json
{
  "success": true,
  "message": "String describing the outcome",
  "data": { ... } // Or an array, or null
}
```

Error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 1. Authentication (`/api/v1/auth`)

### Register
- **Endpoint**: `POST /api/v1/auth/register`
- **Request Body**: `{ "email": "user@example.com", "password": "...", "firstName": "...", "lastName": "...", "phone": "..." }`
- **Response**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent.",
  "data": {
    "userId": "uuid"
  }
}
```

### Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**: `{ "email": "user@example.com", "password": "..." }`
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_string",
    "refreshToken": "jwt_string",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    }
  }
}
```

---

## 2. User Profile (`/api/v1/users`)
*Requires Authentication Header: `Bearer <token>`*

### Get Profile
- **Endpoint**: `GET /api/v1/users/profile`
- **Response**:
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "avatar": "url_string",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Profile
- **Endpoint**: `PUT /api/v1/users/profile`
- **Request Body**: `{ "firstName": "Jane", "lastName": "Doe", "phone": "0987654321" }`
- **Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Doe",
    // ...other updated fields
  }
}
```

### Change Password
- **Endpoint**: `PUT /api/v1/users/change-password`
- **Request Body**: `{ "currentPassword": "...", "newPassword": "..." }`
- **Response**:
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### Delete Account
- **Endpoint**: `DELETE /api/v1/users/account`
- **Response**:
```json
{
  "success": true,
  "message": "Account deactivated successfully",
  "data": null
}
```

### Save Push Token
- **Endpoint**: `POST /api/v1/users/push-token`
- **Request Body**: `{ "token": "ExponentPushToken[...]" }`
- **Response**:
```json
{
  "success": true,
  "message": "Push token saved successfully",
  "data": null
}
```

---

## 3. Wishlist (`/api/v1/wishlists`)
*Requires Authentication Header: `Bearer <token>`*

### Get Wishlist
- **Endpoint**: `GET /api/v1/wishlists`
- **Response**:
```json
{
  "success": true,
  "message": "Wishlist retrieved",
  "data": [
    {
      "userId": "uuid",
      "productId": "uuid",
      "createdAt": "date",
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "price": 99.99,
        "images": ["url1", "url2"]
      }
    }
  ]
}
```

### Add to Wishlist
- **Endpoint**: `POST /api/v1/wishlists`
- **Request Body**: `{ "productId": "uuid" }`
- **Response**:
```json
{
  "success": true,
  "message": "Added to wishlist",
  "data": {
    "userId": "uuid",
    "productId": "uuid"
    // ...
  }
}
```

### Remove from Wishlist
- **Endpoint**: `DELETE /api/v1/wishlists/:productId`
- **Response**:
```json
{
  "success": true,
  "message": "Removed from wishlist"
}
```

---

## 4. Cart (`/api/v1/cart`)
*Requires Authentication Header: `Bearer <token>`*

### Get Cart
- **Endpoint**: `GET /api/v1/cart`
- **Response**:
```json
{
  "success": true,
  "message": "Cart retrieved",
  "data": {
    "id": "uuid",
    "totalAmount": 150.50,
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "quantity": 2,
        "price": 75.25,
        "product": {
           "name": "Product Name",
           "images": ["url"]
        }
      }
    ]
  }
}
```

### Add Item to Cart
- **Endpoint**: `POST /api/v1/cart/items`
- **Request Body**: `{ "productId": "uuid", "quantity": 1 }`
- **Response**:
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { ...cart object updated... }
}
```

---

## 5. Orders (`/api/v1/orders`)
*Requires Authentication Header: `Bearer <token>`*

### Get User Orders
- **Endpoint**: `GET /api/v1/orders/my-orders`
- **Response**:
```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": [
    {
      "id": "uuid",
      "status": "PENDING",
      "totalAmount": 150.50,
      "paymentStatus": "PENDING",
      "createdAt": "date",
      "items": [ ... ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Place Order
- **Endpoint**: `POST /api/v1/orders`
- **Request Body**: `{ "shippingAddressId": "uuid", "paymentMethod": "CARD" }`
- **Response**:
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": "uuid",
    "status": "PENDING",
    "totalAmount": 150.50
    // ...
  }
}
```

---

## 6. Addresses (`/api/v1/addresses`)
*Requires Authentication Header: `Bearer <token>`*

### Get User Addresses
- **Endpoint**: `GET /api/v1/addresses`
- **Response**:
```json
{
  "success": true,
  "message": "Addresses retrieved",
  "data": [
    {
      "id": "uuid",
      "street": "123 Main St",
      "city": "Metropolis",
      "state": "NY",
      "zipCode": "10001",
      "isDefault": true
    }
  ]
}
```
