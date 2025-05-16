import { PrismaClient } from '@prisma/client';

// Add prisma to the global type
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prevent multiple instances of Prisma Client in development
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 