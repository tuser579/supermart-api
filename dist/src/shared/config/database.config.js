"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
// Prevent multiple instances during hot reload in development
exports.prisma = globalThis.__prisma ?? new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error']
        : ['warn', 'error'],
});
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = exports.prisma;
    // Log queries in development
    exports.prisma.$on('query', (e) => {
        logger_1.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
    });
}
//# sourceMappingURL=database.config.js.map