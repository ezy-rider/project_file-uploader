import { PrismaClient } from "../generated/prisma/index.js";
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
