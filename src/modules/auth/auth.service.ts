import crypto from 'crypto';
import { prisma } from '../../shared/config/database.config';
import { jwtConfig } from '../../shared/config/jwt.config';
import { hashPassword, comparePassword } from '../../shared/utils/hashPassword';
import { generateTokens } from '../../shared/utils/generateToken';
import { ApiError } from '../../shared/utils/ApiError';
import { logger } from '../../shared/utils/logger';
import {
  IRegisterDTO,
  ILoginDTO,
  IVerifyOTPDTO,
  IAuthResponse,
  IOTPStore,
} from './auth.interface';

// In-memory OTP store (use Redis in production)
const otpStore: IOTPStore = {};

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');

export const authService = {
  /**
   * Register a new user
   */
  register: async (dto: IRegisterDTO): Promise<IAuthResponse> => {
    // Check for existing email
    const existingEmail = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      throw ApiError.conflict('Email address is already registered');
    }

    // Check for existing phone
    const existingPhone = await prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existingPhone) {
      throw ApiError.conflict('Phone number is already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(dto.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
      },
    });

    // Generate OTP and store it
    const otp = generateOTP();
    otpStore[dto.email] = {
      otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    };

    // In production, send OTP via email/SMS here
    logger.info(`📧 OTP for ${dto.email}: ${otp} (expires in ${OTP_EXPIRY_MINUTES} mins)`);

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    };
  },

  /**
   * Login an existing user
   */
  login: async (dto: ILoginDTO): Promise<IAuthResponse> => {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('Your account has been deactivated. Please contact support.');
    }

    const isPasswordValid = await comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    };
  },

  /**
   * Verify OTP and mark user as verified
   */
  verifyOTP: async (dto: IVerifyOTPDTO): Promise<{ message: string }> => {
    const storedOTP = otpStore[dto.email];

    if (!storedOTP) {
      throw ApiError.badRequest('No OTP found for this email. Please request a new one.');
    }

    if (new Date() > storedOTP.expiresAt) {
      delete otpStore[dto.email];
      throw ApiError.badRequest('OTP has expired. Please request a new one.');
    }

    if (storedOTP.otp !== dto.otp) {
      throw ApiError.badRequest('Invalid OTP');
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email: dto.email },
      data: { isVerified: true },
    });

    delete otpStore[dto.email];

    return { message: 'Email verified successfully' };
  },

  /**
   * Resend OTP
   */
  resendOTP: async (email: string): Promise<{ message: string }> => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (user.isVerified) {
      throw ApiError.badRequest('Email is already verified');
    }

    const otp = generateOTP();
    otpStore[email] = {
      otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    };

    logger.info(`📧 Resend OTP for ${email}: ${otp}`);

    return { message: 'OTP sent successfully. Check your email.' };
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const decoded = jwtConfig.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const accessToken = jwtConfig.signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  },
};
