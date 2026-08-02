import request from 'supertest';
import app from '../src/app';
import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/shared/utils/hashPassword';

const prisma = new PrismaClient();

jest.setTimeout(60000);

describe('Staff Panel Action Checking & Dashboard Endpoints', () => {
  const staffEmail = 'staff.action.test@supermart.com';
  const staffPhone = '+8801700000099';
  const staffPassword = 'Password@123';
  let staffToken: string;
  let staffUserId: string;
  let staffRecordId: string;

  beforeAll(async () => {
    // Clean existing test records
    await prisma.user.deleteMany({ where: { email: staffEmail } });

    const passwordHash = await hashPassword(staffPassword);
    const user = await prisma.user.create({
      data: {
        name: 'Staff Test User',
        email: staffEmail,
        phone: staffPhone,
        passwordHash,
        role: Role.STAFF,
        isVerified: true,
        staffProfile: {
          create: {
            staffId: 'STAFF-TEST-001',
            position: 'DELIVERY_BOY',
            shift: 'MORNING',
            salary: 15000,
            assignedArea: ['Dhaka'],
          },
        },
      },
      include: { staffProfile: true },
    });

    staffUserId = user.id;
    staffRecordId = user.staffProfile!.id;

    // Login as staff to obtain token
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: staffEmail,
      password: staffPassword,
    });

    staffToken = loginRes.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await prisma.attendance.deleteMany({ where: { staffId: staffRecordId } });
    await prisma.user.deleteMany({ where: { email: staffEmail } });
    await prisma.$disconnect();
  });

  it('GET /api/v1/staff/profile — should retrieve staff profile', async () => {
    const res = await request(app)
      .get('/api/v1/staff/profile')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.staffId).toBe('STAFF-TEST-001');
  });

  it('GET /api/v1/staff/quick-options — should retrieve quick options & action checking summary', async () => {
    const res = await request(app)
      .get('/api/v1/staff/quick-options')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('profile');
    expect(res.body.data).toHaveProperty('todayAttendance');
    expect(res.body.data).toHaveProperty('workload');
    expect(res.body.data).toHaveProperty('cashSummary');
    expect(res.body.data).toHaveProperty('quickActions');
    expect(res.body.data.todayAttendance.canCheckIn).toBe(true);
  });

  it('POST /api/v1/staff/attendance — should mark check-in for staff today', async () => {
    const res = await request(app)
      .post('/api/v1/staff/attendance')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'PRESENT' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PRESENT');
  });

  it('GET /api/v1/staff/quick-options — should show canCheckOut=true after check-in', async () => {
    const res = await request(app)
      .get('/api/v1/staff/quick-options')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.todayAttendance.canCheckIn).toBe(false);
    expect(res.body.data.todayAttendance.canCheckOut).toBe(true);
  });

  it('POST /api/v1/staff/attendance — should mark check-out for staff today', async () => {
    const res = await request(app)
      .post('/api/v1/staff/attendance')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ checkOut: new Date().toISOString() });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.checkOut).not.toBeNull();
  });

  it('PATCH /api/v1/staff/availability — should update staff availability flag', async () => {
    const res = await request(app)
      .patch('/api/v1/staff/availability')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isAvailable: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isAvailable).toBe(false);
  });

  it('GET /api/v1/staff/earnings — should return staff earnings summary', async () => {
    const res = await request(app)
      .get('/api/v1/staff/earnings')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('deliveredOrders');
  });
});
