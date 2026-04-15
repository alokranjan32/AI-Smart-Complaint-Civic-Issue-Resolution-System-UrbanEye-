let prisma = null;

if (process.env.DATABASE_URL) {
  try {
    const prismaPackage = await import("@prisma/client");
    const PrismaClient = prismaPackage.PrismaClient || prismaPackage.default?.PrismaClient;

    prisma = PrismaClient ? new PrismaClient() : null;
  } catch (error) {
    prisma = null;
  }
}

export default prisma;
