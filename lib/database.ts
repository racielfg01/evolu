// import prisma  from "./prisma"
// import type { Service, Category, BusinessConfig, User, Booking } from "@prisma/client"

// // Service operations
// export const serviceOperations = {
//   async getAll() {
//     return await prisma.service.findMany({
//       include: {
//         category: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })
//   },

//   async getById(id: string) {
//     return await prisma.service.findUnique({
//       where: { id },
//       include: {
//         category: true,
//       },
//     })
//   },

//   async create(data: Omit<Service, "id" | "createdAt" | "updatedAt">) {
//     return await prisma.service.create({
//       data,
//       include: {
//         category: true,
//       },
//     })
//   },

//   async update(id: string, data: Partial<Service>) {
//     return await prisma.service.update({
//       where: { id },
//       data,
//       include: {
//         category: true,
//       },
//     })
//   },

//   async delete(id: string) {
//     return await prisma.service.update({
//       where: { id },
//       data: { isActive: false },
//     })
//   },
// }

// // Category operations
// export const categoryOperations = {
//   async getAll() {
//     return await prisma.category.findMany({
//       // orderBy: {
//       //   order: "asc",
//       // },
//     })
//   },

//   async create(data: Omit<Category, "id" | "createdAt" | "updatedAt">) {
//     return await prisma.category.create({
//       data,
//     })
//   },

//   async update(id: string, data: Partial<Category>) {
//     return await prisma.category.update({
//       where: { id },
//       data,
//     })
//   },

//   async delete(id: string) {
//     //soft delete
//   //   return await prisma.category.update({
//   //     where: { id },
//   //     data: { isActive: false },
//   //   })
//   // },  
//     return await prisma.category.delete({
//       where: { id },
//     })
//   },
// }

// // Business configuration operations
// export const businessConfigOperations = {
//   async get() {
//     return await prisma.businessConfig.findFirst()
//   },

//   async update(data: Partial<BusinessConfig>) {
//     const existing = await prisma.businessConfig.findFirst()

//     if (existing) {
//       return await prisma.businessConfig.update({
//         where: { id: existing.id },
//         data,
//       })
//     } else {
//       return await prisma.businessConfig.create({
//         data: data as BusinessConfig,
//       })
//     }
//   },
// }

// // Booking operations
// export const bookingOperations = {
//   async getAll() {
//     return await prisma.booking.findMany({
//       include: {
//         user: true,
//         bookingServices: {
//           include: {
//             service: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "desc",
//       },
//     })
//   },

//   async getByUserId(userId: string) {
//     return await prisma.booking.findMany({
//       where: { userId },
//       include: {
//         bookingServices: {
//           include: {
//             service: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "desc",
//       },
//     })
//   },

//   async create(data: {
//     userId: string
//     date: Date
//     time: string
//     serviceIds: string[]
//     totalPrice: number
//     totalDuration: number
//     notes?: string
//   }) {
//     return await prisma.booking.create({
//       data: {
//         userId: data.userId,
//         date: data.date,
//         time: data.time,
//         totalPrice: data.totalPrice,
//         totalDuration: data.totalDuration,
//         notes: data.notes,
//         bookingServices: {
//           create: data.serviceIds.map((serviceId) => ({
//             serviceId,
//           })),
//         },
//       },
//       include: {
//         user: true,
//         bookingServices: {
//           include: {
//             service: true,
//           },
//         },
//       },
//     })
//   },

//   async update(id: string, data: Partial<Booking>) {
//     return await prisma.booking.update({
//       where: { id },
//       data,
//       include: {
//         user: true,
//         bookingServices: {
//           include: {
//             service: true,
//           },
//         },
//       },
//     })
//   },
// }

// // User operations
// export const userOperations = {
//   async getAll() {
//     return await prisma.user.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//     })
//   },

//   async getById(id: string) {
//     return await prisma.user.findUnique({
//       where: { id },
//     })
//   },

//   async getByEmail(email: string) {
//     return await prisma.user.findUnique({
//       where: { email },
//     })
//   },

//   async create(data: Omit<User, "id" | "createdAt" | "updatedAt">) {
//     return await prisma.user.create({
//       data,
//     })
//   },

//   async update(id: string, data: Partial<User>) {
//     return await prisma.user.update({
//       where: { id },
//       data,
//     })
//   },
// }

// // Time slot operations
// export const timeSlotOperations = {
//   async getAvailableSlots(date: Date) {
//     const dayOfWeek = date.getDay()

//     return await prisma.timeSlot.findMany({
//       where: {
//         dayOfWeek,
//         isActive: true,
//       },
//       orderBy: {
//         startTime: "asc",
//       },
//     })
//   },

//   async getAll() {
//     return await prisma.timeSlot.findMany({
//       orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
//     })
//   },
// }
