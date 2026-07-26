"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./src/app"));
const logger_1 = require("./src/shared/utils/logger");
const database_config_1 = require("./src/shared/config/database.config");
const PORT = process.env.PORT || 5000;
async function bootstrap() {
    try {
        // Test database connection
        await database_config_1.prisma.$connect();
        logger_1.logger.info('✅ Database connected successfully');
        const server = app_1.default.listen(PORT, () => {
            logger_1.logger.info(`🚀 Supermart API running on port ${PORT}`);
            logger_1.logger.info(`📦 Environment: ${process.env.NODE_ENV}`);
            logger_1.logger.info(`🔗 Health: http://localhost:${PORT}/health`);
        });
        // Graceful shutdown
        const shutdown = async (signal) => {
            logger_1.logger.info(`\n${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                await database_config_1.prisma.$disconnect();
                logger_1.logger.info('Database disconnected. Server closed.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to start server:', error);
        await database_config_1.prisma.$disconnect();
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=server.js.map