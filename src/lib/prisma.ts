import { PrismaClient } from "../../prisma/generated-client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Using a custom output path for Prisma Client to ensure the IDE can find the generated types.

const prismaClientSingleton = () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
