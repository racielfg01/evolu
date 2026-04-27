// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export { prisma };

//========
// import { PrismaClient } from "@prisma/client"
 
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
// export const prisma = globalForPrisma.prisma || new PrismaClient()
 
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


//==========







// import { PrismaClient } from "@prisma/client";

// const prismaClientSingleton = () => new PrismaClient();

// declare global {
//   const prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// export const db = globalThis.prisma ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== "production") globalThis.prisma = db;


//=================================================
import { PrismaClient } from '@prisma/client'
// import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient()
// const prisma = new PrismaClient().$extends(withAccelerate())

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma


