import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

jest.setTimeout(30000);

describe('Notifications & Products API Specification', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;
  let testNotificationId: string;
  let testProductId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Spec Test User',
        email: `spec.user.${Date.now()}@test.com`,
        phone: `+8801700${Math.floor(100000 + Math.random() * 900000)}`,
        passwordHash: 'hashedpassword',
        role: 'USER',
      },
    });
    userId = user.id;

    // Create test admin
    const admin = await prisma.user.create({
      data: {
        name: 'Spec Test Admin',
        email: `spec.admin.${Date.now()}@test.com`,
        phone: `+8801800${Math.floor(100000 + Math.random() * 900000)}`,
        passwordHash: 'hashedpassword',
        role: 'ADMIN',
      },
    });
    adminId = admin.id;

    const JWT_SECRET = process.env.JWT_SECRET || 'supermart_jwt_secret_key_2026';
    userToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    adminToken = jwt.sign({ userId: admin.id, role: admin.role }, JWT_SECRET);

    // Create test notification
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Test Notification',
        message: 'This is a test notification message.',
        type: 'ORDER_STATUS',
      },
    });
    testNotificationId = notification.id;

    // Create test product
    const product = await prisma.product.create({
      data: {
        name: 'Fresh Organic Red Apples (1kg)',
        description: 'Crisp and sweet farm fresh red apples.',
        price: 280,
        discountPrice: 250,
        category: 'Fruits',
        brand: 'GreenValley Organic',
        stock: 45,
        images: ['https://example.com/images/apple_1.jpg'],
        createdBy: admin.id,
      },
    });
    testProductId = product.id;
  });

  afterAll(async () => {
    if (testNotificationId) {
      await prisma.notification.deleteMany({ where: { userId } });
    }
    if (testProductId) {
      await prisma.cartItem.deleteMany({ where: { productId: testProductId } });
      await prisma.wishlist.deleteMany({ where: { productId: testProductId } });
      await prisma.review.deleteMany({ where: { productId: testProductId } });
      await prisma.product.deleteMany({ where: { id: testProductId } });
    }
    await prisma.user.deleteMany({ where: { id: { in: [userId, adminId] } } });
    await prisma.$disconnect();
  });

  describe('1. Notifications Module', () => {
    it('1.1 GET /notifications - Fetch all notifications', async () => {
      const res = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Notifications fetched successfully');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('userId');
      expect(res.body.data[0]).toHaveProperty('title');
      expect(res.body.data[0]).toHaveProperty('message');
      expect(res.body.data[0]).toHaveProperty('type');
      expect(res.body.data[0]).toHaveProperty('isRead');
      expect(res.body.data[0]).toHaveProperty('createdAt');
    });

    it('1.3 PUT /notifications/:id/read - Mark single notification as read', async () => {
      const res = await request(app)
        .put(`/api/v1/notifications/${testNotificationId}/read`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Notification marked as read');
      expect(res.body.data).toEqual({ message: 'Notification marked as read' });
    });

    it('1.2 PUT /notifications/read-all - Mark all notifications as read', async () => {
      const res = await request(app)
        .put('/api/v1/notifications/read-all')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('All notifications marked as read');
      expect(res.body.data).toEqual({ message: 'All notifications marked as read' });
    });

    it('1.4 DELETE /notifications/:id - Delete single notification', async () => {
      const notif = await prisma.notification.create({
        data: {
          userId,
          title: 'To Delete',
          message: 'To delete message',
          type: 'TEST',
        },
      });

      const res = await request(app)
        .delete(`/api/v1/notifications/${notif.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Notification deleted successfully');
      expect(res.body.data).toEqual({ message: 'Notification deleted' });
    });

    it('1.5 DELETE /notifications - Clear all notifications', async () => {
      const res = await request(app)
        .delete('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('All notifications cleared from database');
      expect(res.body.data).toEqual({ message: 'Cleared' });
    });
  });

  describe('2. Products Module', () => {
    it('2.1 GET /products - Fetch product list with filters', async () => {
      const res = await request(app)
        .get('/api/v1/products')
        .query({ category: 'Fruits', page: 1, limit: 10 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Products retrieved successfully');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('page');
      expect(res.body.meta).toHaveProperty('limit');
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('totalPages');
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty('numReviews');
      }
    });

    it('2.2 GET /products/:id - Fetch detailed product information', async () => {
      const res = await request(app).get(`/api/v1/products/${testProductId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Product details fetched successfully');
      expect(res.body.data).toHaveProperty('id', testProductId);
      expect(res.body.data).toHaveProperty('numReviews');
      expect(res.body.data).toHaveProperty('reviews');
      expect(Array.isArray(res.body.data.reviews)).toBe(true);
    });

    let createdProdId: string;

    it('2.3 POST /admin/products - Create a new product (Admin)', async () => {
      const newProductPayload = {
        name: 'Fresh Organic Farm Eggs (12 pcs)',
        description: '100% organic brown eggs from free-range chickens.',
        price: 160,
        discountPrice: 150,
        category: 'Dairy & Eggs',
        brand: 'FarmFresh',
        stock: 100,
        images: ['https://example.com/images/eggs_1.jpg'],
      };

      const res = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProductPayload);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Product created successfully in database');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toEqual(newProductPayload.name);
      expect(res.body.data.numReviews).toEqual(0);
      createdProdId = res.body.data.id;
    });

    it('2.4 PUT /admin/products/:id - Update product by ID (Admin)', async () => {
      const updatePayload = {
        name: 'Fresh Organic Farm Eggs (12 pcs - Jumbo Size)',
        price: 170,
        discountPrice: 155,
        stock: 120,
      };

      const res = await request(app)
        .put(`/api/v1/admin/products/${createdProdId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatePayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Product updated successfully in database');
      expect(res.body.data.name).toEqual(updatePayload.name);
      expect(res.body.data.price).toEqual(updatePayload.price);
    });

    it('2.5 DELETE /admin/products/:id - Delete product permanently (Admin) & clear wishlist', async () => {
      // Add product to user wishlist first
      await prisma.wishlist.create({
        data: {
          userId,
          productId: createdProdId,
        },
      });

      const wishlistBefore = await prisma.wishlist.count({ where: { productId: createdProdId } });
      expect(wishlistBefore).toEqual(1);

      const res = await request(app)
        .delete(`/api/v1/admin/products/${createdProdId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Product deleted successfully from database');
      expect(res.body.data).toEqual({ success: true, message: 'Product deleted' });

      // Verify product is removed from wishlist
      const wishlistAfter = await prisma.wishlist.count({ where: { productId: createdProdId } });
      expect(wishlistAfter).toEqual(0);
    });
  });
});
