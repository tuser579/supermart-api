import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances during hot reload in development
export const prisma = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error']
    : ['warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;

  // Log queries in development
  (prisma as any).$on('query', (e: any) => {
    logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
  });
}
