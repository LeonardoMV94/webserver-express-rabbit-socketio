import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';

class PrismaInstance {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaInstance.instance) {
      PrismaInstance.instance = new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'info' },
          { emit: 'event', level: 'warn' },
        ],
      });

      PrismaInstance.instance.$on('query', (e) => {
        logger.debug('Consulta Prisma:', e);
      });

      PrismaInstance.instance.$on('error', (e) => {
        logger.error('Error Prisma:', e);
      });

      PrismaInstance.instance.$on('info', (e) => {
        logger.info('Info Prisma:', e);
      });

      PrismaInstance.instance.$on('warn', (e) => {
        logger.warn('Advertencia Prisma:', e);
      });
    }

    return PrismaInstance.instance;
  }
}

export const db = PrismaInstance.getInstance();
