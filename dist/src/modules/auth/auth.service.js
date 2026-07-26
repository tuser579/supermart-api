"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const jwt_config_1 = require("../../shared/config/jwt.config");
const hashPassword_1 = require("../../shared/utils/hashPassword");
const generateToken_1 = require("../../shared/utils/generateToken");
const ApiError_1 = require("../../shared/utils/ApiError");
const logger_1 = require("../../shared/utils/logger");
// In-memory OTP store (use Redis in production)
const otpStore = {};
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
exports.authService = {
    /**
     * Register a new user
     */
    register: async (dto) => {
        // Check for existing email
        const existingEmail = await database_config_1.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingEmail) {
            throw ApiError_1.ApiError.conflict('Email address is already registered');
        }
        // Check for existing phone
        const existingPhone = await database_config_1.prisma.user.findUnique({ where: { phone: dto.phone } });
        if (existingPhone) {
            throw ApiError_1.ApiError.conflict('Phone number is already registered');
        }
        // Hash password
        const passwordHash = await (0, hashPassword_1.hashPassword)(dto.password);
        // Create user
        const user = await database_config_1.prisma.user.create({
            data: {
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
        logger_1.logger.info(`📧 OTP for ${dto.email}: ${otp} (expires in ${OTP_EXPIRY_MINUTES} mins)`);
        // Generate tokens
        const tokens = (0, generateToken_1.generateTokens)({
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
    login: async (dto) => {
        const user = await database_config_1.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw ApiError_1.ApiError.unauthorized('Invalid email or password');
        }
        if (!user.isActive) {
            throw ApiError_1.ApiError.unauthorized('Your account has been deactivated. Please contact support.');
        }
        const isPasswordValid = await (0, hashPassword_1.comparePassword)(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw ApiError_1.ApiError.unauthorized('Invalid email or password');
        }
        // Update last login
        await database_config_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const tokens = (0, generateToken_1.generateTokens)({
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
    verifyOTP: async (dto) => {
        const storedOTP = otpStore[dto.email];
        if (!storedOTP) {
            throw ApiError_1.ApiError.badRequest('No OTP found for this email. Please request a new one.');
        }
        if (new Date() > storedOTP.expiresAt) {
            delete otpStore[dto.email];
            throw ApiError_1.ApiError.badRequest('OTP has expired. Please request a new one.');
        }
        if (storedOTP.otp !== dto.otp) {
            throw ApiError_1.ApiError.badRequest('Invalid OTP');
        }
        // Mark user as verified
        await database_config_1.prisma.user.update({
            where: { email: dto.email },
            data: { isVerified: true },
        });
        delete otpStore[dto.email];
        return { message: 'Email verified successfully' };
    },
    /**
     * Resend OTP
     */
    resendOTP: async (email) => {
        const user = await database_config_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw ApiError_1.ApiError.notFound('User not found');
        }
        if (user.isVerified) {
            throw ApiError_1.ApiError.badRequest('Email is already verified');
        }
        const otp = generateOTP();
        otpStore[email] = {
            otp,
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        };
        logger_1.logger.info(`📧 Resend OTP for ${email}: ${otp}`);
        return { message: 'OTP sent successfully. Check your email.' };
    },
    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken) => {
        const decoded = jwt_config_1.jwtConfig.verifyRefreshToken(refreshToken);
        const user = await database_config_1.prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || !user.isActive) {
            throw ApiError_1.ApiError.unauthorized('Invalid refresh token');
        }
        const accessToken = jwt_config_1.jwtConfig.signAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return { accessToken };
    },
};
//# sourceMappingURL=auth.service.js.map