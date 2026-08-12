// lib/prisma.ts
// Single shared Prisma client. In dev, Next.js hot-reloads modules, which
// would normally create a new client (and a new DB connection pool) on
// every file save — stashing it on `global` avoids that.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
