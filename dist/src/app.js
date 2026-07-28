"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const rateLimiter_middleware_1 = require("./shared/middleware/rateLimiter.middleware");
const error_middleware_1 = require("./shared/middleware/error.middleware");
// Route imports
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const cart_routes_1 = __importDefault(require("./modules/cart/cart.routes"));
const order_routes_1 = __importDefault(require("./modules/order/order.routes"));
const staff_routes_1 = __importDefault(require("./modules/staff/staff.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const review_routes_1 = __importDefault(require("./modules/review/review.routes"));
const notification_routes_1 = __importDefault(require("./modules/notification/notification.routes"));
const payment_routes_1 = require("./modules/payment/payment.routes");
const address_routes_1 = __importDefault(require("./modules/address/address.routes"));
const wishlist_routes_1 = __importDefault(require("./modules/wishlist/wishlist.routes"));
const app = (0, express_1.default)();
// ─── Security Middleware ───────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8081,http://10.0.2.2:8081').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(rateLimiter_middleware_1.globalRateLimiter);
// ─── Parsing Middleware ────────────────────────────────────────────
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// ─── Health Check & Debug ──────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Supermart API is running',
        environment: process.env.NODE_ENV,
        version: require('../package.json').version,
        timestamp: new Date().toISOString(),
    });
});
app.get('/debug-routes', (_req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push({ path: middleware.route.path, methods: middleware.route.methods });
        }
        else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push({
                        prefix: middleware.regexp.toString(),
                        path: handler.route.path,
                        methods: handler.route.methods,
                    });
                }
            });
        }
    });
    res.status(200).json({ success: true, count: routes.length, routes });
});
// ─── API Routes ────────────────────────────────────────────────────
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, auth_routes_1.default);
app.use(`${API_PREFIX}/users`, user_routes_1.default);
app.use(`${API_PREFIX}/products`, product_routes_1.default);
app.use(`${API_PREFIX}/cart`, cart_routes_1.default);
app.use(`${API_PREFIX}/orders`, order_routes_1.default);
app.use(`${API_PREFIX}/staff`, staff_routes_1.default);
app.use(`${API_PREFIX}/admin`, admin_routes_1.default);
app.use(`${API_PREFIX}/reviews`, review_routes_1.default);
app.use(`${API_PREFIX}/notifications`, notification_routes_1.default);
app.use(`${API_PREFIX}/payments`, payment_routes_1.paymentRoutes);
app.use(`${API_PREFIX}/addresses`, address_routes_1.default);
app.use(`${API_PREFIX}/wishlists`, wishlist_routes_1.default);
// ─── 404 Handler ──────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found`,
    });
});
// ─── Global Error Handler ──────────────────────────────────────────
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map