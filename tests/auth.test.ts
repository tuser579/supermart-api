import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test.user.jest@supermart.com',
    phone: '+8801900000001',
    password: 'Password@123',
  };

  beforeAll(async () => {
    // Clean up if the user already exists from a previous failed run
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    // Clean up after tests
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user.email).toEqual(testUser.email);
    });

    it('should fail to register with an existing email', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);
      expect(res.statusCode).toEqual(400); // or whatever error code you use for duplicates
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail to login with wrong password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword1!',
      });
      expect(res.statusCode).toEqual(401); // Unauthorized
      expect(res.body.success).toBe(false);
    });
  });
});
