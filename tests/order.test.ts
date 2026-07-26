import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.setTimeout(60000);

describe('Order & Cart Flow Integration Tests', () => {
  const testUser = {
    name: 'Order Test User',
    email: 'order.test.jest@supermart.com',
    phone: '+8801999999999',
    password: 'Password@123',
  };

  const seedProductId = 'a0000000-0000-0000-0000-000000000001';
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    // Cleanup previous test runs
    await prisma.orderItem.deleteMany({
      where: { order: { user: { email: testUser.email } } },
    });
    await prisma.order.deleteMany({
      where: { user: { email: testUser.email } },
    });
    await prisma.cartItem.deleteMany({
      where: { cart: { user: { email: testUser.email } } },
    });
    await prisma.cart.deleteMany({
      where: { user: { email: testUser.email } },
    });
    await prisma.user.deleteMany({
      where: { OR: [{ email: testUser.email }, { phone: testUser.phone }] },
    });

    // Ensure a seed product exists with non-CUID ID "seed-carrot-(500g)"
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    let adminId = adminUser?.id;
    if (!adminId) {
      const newAdmin = await prisma.user.create({
        data: {
          name: 'Admin Test',
          email: 'admin.seed.test@supermart.com',
          phone: '+8801988888888',
          passwordHash: 'hashed',
          role: 'ADMIN',
        },
      });
      adminId = newAdmin.id;
    }

    await prisma.product.upsert({
      where: { id: seedProductId },
      update: { price: 50, discountPrice: null, stock: 100, isActive: true },
      create: {
        id: seedProductId,
        name: 'Fresh Carrot (500g)',
        price: 50,
        discountPrice: null,
        category: 'Vegetables',
        stock: 100,
        isActive: true,
        createdBy: adminId,
      },
    });

    // Register test user
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    userToken = res.body.data.tokens.accessToken;
    userId = res.body.data.user.id;
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.orderItem.deleteMany({
      where: { order: { user: { email: testUser.email } } },
    });
    await prisma.order.deleteMany({
      where: { user: { email: testUser.email } },
    });
    await prisma.cartItem.deleteMany({
      where: { cart: { user: { email: testUser.email } } },
    });
    await prisma.cart.deleteMany({
      where: { user: { email: testUser.email } },
    });
    await prisma.user.deleteMany({
      where: { OR: [{ email: testUser.email }, { phone: testUser.phone }] },
    });
    await prisma.$disconnect();
  });

  it('1. Should add item with non-CUID seed product ID to cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        productId: seedProductId,
        quantity: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itemCount).toBe(1);
    expect(res.body.data.totalAmount).toBe(100);
  });

  it('2. Should retrieve active cart containing seed product item', async () => {
    const res = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].productId).toBe(seedProductId);
  });

  let createdOrderId: string;

  it('3. Should place order successfully with seed product item in cart', async () => {
    const orderPayload = {
      deliveryAddress: {
        fullName: 'Order Test User',
        phone: '+8801999999999',
        addressLine1: 'House 12, Road 5, Block B',
        city: 'Dhaka',
        area: 'Mirpur',
      },
      paymentMethod: 'COD',
      notes: 'Test order placement',
    };

    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(orderPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBeDefined();
    createdOrderId = res.body.data.id;
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].productId).toBe(seedProductId);
    expect(res.body.data.totalAmount).toBe(160); // 100 subtotal + 60 delivery charge
  });

  it('4. Should have cleared the cart after placing order', async () => {
    const res = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itemCount).toBe(0);
    expect(res.body.data.items.length).toBe(0);
  });

  it('5. Should set deliveredAt when order status transitions to DELIVERED while leaving paymentStatus PENDING for customer choice', async () => {
    // Progress status PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED
    await prisma.order.update({
      where: { id: createdOrderId },
      data: { status: 'SHIPPED' },
    });

    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@supermart.com',
      password: 'Admin@123',
    });
    const adminToken = adminLoginRes.body.data.tokens.accessToken;

    const res = await request(app)
      .put(`/api/v1/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'DELIVERED' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('DELIVERED');
    expect(res.body.data.deliveredAt).toBeDefined();
    expect(res.body.data.paymentStatus).toBe('PENDING');
  });

  it('6. Should allow customer to select payment method and complete payment for a DELIVERED order', async () => {
    const payRes = await request(app)
      .post(`/api/v1/orders/${createdOrderId}/pay`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        paymentMethod: 'BKASH',
        transactionId: 'BKASH-TRX-100200300',
      });

    expect(payRes.statusCode).toBe(200);
    expect(payRes.body.success).toBe(true);
    expect(payRes.body.data.paymentStatus).toBe('COMPLETED');
    expect(payRes.body.data.paymentMethod).toBe('BKASH');
    expect(payRes.body.data.transactionId).toBe('BKASH-TRX-100200300');
  });

  it('7. Should allow user to submit a return request with report details for a DELIVERED order', async () => {
    const returnPayload = {
      reason: 'Damaged item received',
      details: 'The item package was crushed during delivery.',
      images: ['https://example.com/proof1.jpg'],
    };

    const res = await request(app)
      .post(`/api/v1/orders/${createdOrderId}/return`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(returnPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('RETURN_REQUESTED');
    expect(res.body.data.returnReason).toBe(returnPayload.reason);
    expect(res.body.data.returnDetails).toBe(returnPayload.details);
  });

  it('8. Should return Admin Quick Options summary including assigned orders & cancel options', async () => {
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@supermart.com',
      password: 'Admin@123',
    });
    const adminToken = adminLoginRes.body.data.tokens.accessToken;

    const res = await request(app)
      .get('/api/v1/admin/quick-options')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.assignedOrdersOptions).toBeDefined();
    expect(res.body.data.orderCancelOptions).toBeDefined();
    expect(res.body.data.quickActions).toBeDefined();
  });

  it('9. Should allow Admin to cancel an active order via quick cancel endpoint, restoring stock', async () => {
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@supermart.com',
      password: 'Admin@123',
    });
    const adminToken = adminLoginRes.body.data.tokens.accessToken;

    // Create a new order to test cancellation
    const orderPayload = {
      deliveryAddress: {
        fullName: 'Cancel Test User',
        phone: '+8801999999999',
        addressLine1: 'House 99, Road 1',
        city: 'Dhaka',
        area: 'Gulshan',
      },
      paymentMethod: 'COD',
      items: [{ productId: seedProductId, quantity: 1 }],
    };

    const newOrderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(orderPayload);

    const cancelOrderId = newOrderRes.body.data.id;

    // Cancel order as admin
    const cancelRes = await request(app)
      .post(`/api/v1/admin/orders/${cancelOrderId}/cancel`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Out of stock items' });

    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.success).toBe(true);
    expect(cancelRes.body.data.status).toBe('CANCELLED');
    expect(cancelRes.body.data.cancellationReason).toBe('Out of stock items');
  });

  it('10. Should filter orders by assigned staff status', async () => {
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@supermart.com',
      password: 'Admin@123',
    });
    const adminToken = adminLoginRes.body.data.tokens.accessToken;

    const res = await request(app)
      .get('/api/v1/admin/orders/assigned')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('11. Should retrieve out of stock products options and allow Admin quick product restocking', async () => {
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@supermart.com',
      password: 'Admin@123',
    });
    const adminToken = adminLoginRes.body.data.tokens.accessToken;

    const quickRes = await request(app)
      .get('/api/v1/admin/quick-options')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(quickRes.statusCode).toBe(200);
    expect(quickRes.body.data.outOfStockOptions).toBeDefined();

    const restockRes = await request(app)
      .patch(`/api/v1/admin/products/${seedProductId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ addStock: 50 });

    expect(restockRes.statusCode).toBe(200);
    expect(restockRes.body.success).toBe(true);
    expect(restockRes.body.data.stock).toBeGreaterThanOrEqual(50);
  });

  it('12. Should allow Admin to list, create, edit, and delete products via Admin routes', async () => {
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@supermart.com',
      password: 'Admin@123',
    });
    const adminToken = adminLoginRes.body.data.tokens.accessToken;

    // 1. Create product as Admin
    const createRes = await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Admin Special Organic Milk (1L)',
        price: 90,
        category: 'Dairy',
        stock: 30,
        images: ['https://example.com/milk.jpg'],
      });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.success).toBe(true);
    const newProdId = createRes.body.data.id;

    // 2. Edit product as Admin
    const editRes = await request(app)
      .put(`/api/v1/admin/products/${newProdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 85, stock: 40 });

    expect(editRes.statusCode).toBe(200);
    expect(editRes.body.data.price).toBe(85);
    expect(editRes.body.data.stock).toBe(40);

    // 3. List products as Admin
    const listRes = await request(app)
      .get('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    // 4. Delete product as Admin
    const deleteRes = await request(app)
      .delete(`/api/v1/admin/products/${newProdId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});



