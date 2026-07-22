import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalRateLimiter } from './shared/middleware/rateLimiter.middleware';
import { errorMiddleware } from './shared/middleware/error.middleware';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import productRoutes from './modules/product/product.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/order/order.routes';
import staffRoutes from './modules/staff/staff.routes';
import adminRoutes from './modules/admin/admin.routes';
import reviewRoutes from './modules/review/review.routes';
import notificationRoutes from './modules/notification/notification.routes';
import { paymentRoutes } from './modules/payment/payment.routes';
import addressRoutes from './modules/address/address.routes';

const app: Application = express();

// ─── Security Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8081,http://10.0.2.2:8081').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(globalRateLimiter);

// ─── Parsing Middleware ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Health Check ──────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Supermart API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/staff`, staffRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/addresses`, addressRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────────
app.use(errorMiddleware);

export default app;
