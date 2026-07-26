import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { hashPassword } from '../../shared/utils/hashPassword';
import { ICreateStaffDTO, IMarkAttendanceDTO } from './staff.interface';
import { Role } from '@prisma/client';

let staffCounter = 1;
const generateStaffId = (): string => {
  return `STAFF-${String(staffCounter++).padStart(4, '0')}`;
};

export const staffService = {
  createStaff: async (dto: ICreateStaffDTO) => {
    const existingEmail = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw ApiError.conflict('Email already registered');

    const existingPhone = await prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existingPhone) throw ApiError.conflict('Phone number already registered');

    const passwordHash = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: Role.STAFF,
        isVerified: true,
        staffProfile: {
          create: {
            staffId: generateStaffId(),
            position: dto.position,
            shift: dto.shift,
            salary: dto.salary,
            assignedArea: dto.assignedArea || [],
          },
        },
      },
      include: {
        staffProfile: true,
      },
    });

    return user;
  },

  getAllStaff: async (params: any) => {
    const { page = 1, limit = 20, position, isAvailable } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (position) where.position = position;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;

    const [staff, total] = await prisma.$transaction([
      prisma.staff.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, profileImage: true, isActive: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.staff.count({ where }),
    ]);

    return { staff, total, page, limit };
  },

  getStaffProfile: async (userId: string) => {
    const staff = await prisma.staff.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, profileImage: true },
        },
      },
    });
    if (!staff) throw ApiError.notFound('Staff profile not found');
    return staff;
  },

  getStaffOrders: async (userId: string, params: any) => {
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw ApiError.notFound('Staff profile not found');

    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;

    const where: any = { assignedStaffId: staff.id };
    if (status) where.status = status;

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, phone: true } },
          items: {
            include: { product: { select: { name: true, images: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  },

  markAttendance: async (userId: string, dto: IMarkAttendanceDTO) => {
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw ApiError.notFound('Staff profile not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check existing attendance for today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        staffId: staff.id,
        date: { gte: today, lt: tomorrow },
      },
    });

    if (existingAttendance) {
      // Update check-out
      if (dto.checkOut) {
        return prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: { checkOut: new Date(dto.checkOut) },
        });
      }
      throw ApiError.conflict('Attendance already marked for today. Use checkout.');
    }

    // Mark check-in
    return prisma.attendance.create({
      data: {
        staffId: staff.id,
        checkIn: dto.checkIn ? new Date(dto.checkIn) : new Date(),
        checkOut: dto.checkOut ? new Date(dto.checkOut) : undefined,
        status: dto.status || 'PRESENT',
      },
    });
  },

  getAttendance: async (userId: string, role: string, targetStaffId?: string) => {
    let staffId: string;

    if (role === 'ADMIN' && targetStaffId) {
      staffId = targetStaffId;
    } else {
      const staff = await prisma.staff.findUnique({ where: { userId } });
      if (!staff) throw ApiError.notFound('Staff profile not found');
      staffId = staff.id;
    }

    return prisma.attendance.findMany({
      where: { staffId },
      orderBy: { date: 'desc' },
      take: 30,
    });
  },

  getEarnings: async (userId: string) => {
    const staff = await prisma.staff.findUnique({
      where: { userId },
      select: { earnings: true, totalDeliveries: true, rating: true, salary: true },
    });
    if (!staff) throw ApiError.notFound('Staff profile not found');

    const deliveredOrders = await prisma.order.count({
      where: {
        assignedStaff: { userId },
        status: 'DELIVERED',
      },
    });

    return { ...staff, deliveredOrders };
  },

  updateAvailability: async (userId: string, isAvailable: boolean) => {
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw ApiError.notFound('Staff profile not found');

    return prisma.staff.update({
      where: { userId },
      data: { isAvailable },
    });
  },

  getStaffQuickOptions: async (userId: string) => {
    const staff = await prisma.staff.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
    if (!staff) throw ApiError.notFound('Staff profile not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendanceRecord = await prisma.attendance.findFirst({
      where: {
        staffId: staff.id,
        date: { gte: today, lt: tomorrow },
      },
    });

    const todayAttendance = {
      attendanceId: todayAttendanceRecord?.id || undefined,
      status: todayAttendanceRecord?.status || null,
      checkIn: todayAttendanceRecord?.checkIn || null,
      checkOut: todayAttendanceRecord?.checkOut || null,
      canCheckIn: !todayAttendanceRecord,
      canCheckOut: !!todayAttendanceRecord && !todayAttendanceRecord.checkOut,
    };

    const [totalAssignedOrders, activeDeliveriesCount, completedDeliveriesTodayCount] =
      await Promise.all([
        prisma.order.count({ where: { assignedStaffId: staff.id } }),
        prisma.order.count({
          where: {
            assignedStaffId: staff.id,
            status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] },
          },
        }),
        prisma.order.count({
          where: {
            assignedStaffId: staff.id,
            status: 'DELIVERED',
            deliveredAt: { gte: today },
          },
        }),
      ]);

    const recentAssignedOrders = await prisma.order.findMany({
      where: { assignedStaffId: staff.id },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        orderId: true,
        status: true,
        totalAmount: true,
        paymentStatus: true,
        deliveryAddress: true,
        user: { select: { name: true, phone: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    const quickActions = [
      {
        action: 'MARK_ATTENDANCE_CHECKIN',
        method: 'POST',
        endpoint: '/api/v1/staff/attendance',
        description: 'Mark check-in for today attendance',
      },
      {
        action: 'MARK_ATTENDANCE_CHECKOUT',
        method: 'POST',
        endpoint: '/api/v1/staff/attendance',
        description: 'Mark check-out for today attendance',
      },
      {
        action: 'TOGGLE_AVAILABILITY',
        method: 'PATCH',
        endpoint: '/api/v1/staff/availability',
        description: 'Update staff availability status (true/false)',
      },
      {
        action: 'VIEW_ASSIGNED_ORDERS',
        method: 'GET',
        endpoint: '/api/v1/staff/orders',
        description: 'Get all orders assigned to current staff member',
      },
      {
        action: 'UPDATE_ORDER_STATUS',
        method: 'PUT',
        endpoint: '/api/v1/orders/:id/status',
        description: 'Update assigned order status (CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED)',
      },
      {
        action: 'VIEW_STAFF_PROFILE',
        method: 'GET',
        endpoint: '/api/v1/staff/profile',
        description: 'Retrieve current staff profile details',
      },
      {
        action: 'VIEW_STAFF_EARNINGS',
        method: 'GET',
        endpoint: '/api/v1/staff/earnings',
        description: 'View delivery earnings and performance metrics',
      },
    ];

    return {
      profile: {
        staffId: staff.staffId,
        position: staff.position,
        shift: staff.shift,
        rating: staff.rating,
        isAvailable: staff.isAvailable,
        totalDeliveries: staff.totalDeliveries,
        earnings: staff.earnings,
      },
      todayAttendance,
      workload: {
        totalAssignedOrders,
        activeDeliveriesCount,
        completedDeliveriesTodayCount,
      },
      recentAssignedOrders,
      quickActions,
    };
  },
};

