import 'dotenv/config';
import app from './src/app';
import { logger } from './src/shared/utils/logger';
import { prisma } from './src/shared/config/database.config';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Supermart API running on port ${PORT}`);
      logger.info(`📦 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database disconnected. Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();