import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  // 1. Crear roles
  const superAdminRole = await prisma.role.create({
    data: {
      name: "SUPER_ADMIN",
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: "ADMIN",
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "USER",
    },
  });

  console.log("✅ Roles creados");

  // 2. Crear sexos
  const maleSex = await prisma.sex.create({
    data: {
      name: "Male",
    },
  });

  const femaleSex = await prisma.sex.create({
    data: {
      name: "Female",
    },
  });

  console.log("✅ Sexos creados");

  // 3. Crear categorías
  const beautyCategory = await prisma.category.create({
    data: {
      name: "Belleza",
    },
  });

  const wellnessCategory = await prisma.category.create({
    data: {
      name: "Bienestar",
    },
  });

  console.log("✅ Categorias creadas");

  // 4. Crear usuarios (con contraseñas hasheadas)
  const superAdminPassword = await bcrypt.hash("SuperAdmin123!", SALT_ROUNDS);
  const superAdmin = await prisma.user.create({
    data: {
      cuid: uuidv4(),
      name: "Super Admin",
      email: "superadmin@example.com",
      password: superAdminPassword,
      role: { connect: { id: superAdminRole.id } },
      sex: { connect: { id: maleSex.id } },
      image: "https://example.com/images/superadmin.jpg",
    },
  });

  const adminPassword = await bcrypt.hash("Admin123!", SALT_ROUNDS);
  const admin = await prisma.user.create({
    data: {
      cuid: uuidv4(),
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: { connect: { id: adminRole.id } },
      sex: { connect: { id: femaleSex.id } },
      image: "https://example.com/images/admin.jpg",
    },
  });

  const userPassword = await bcrypt.hash("User123!", SALT_ROUNDS);
  const regularUser = await prisma.user.create({
    data: {
      cuid: uuidv4(),
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      role: { connect: { id: userRole.id } },
      sex: { connect: { id: femaleSex.id } },
      image: "https://example.com/images/user.jpg",
    },
  });

  console.log("✅ Usuarios creados");

  // 5. Crear horarios laborales
  await prisma.workingHours.createMany({
    data: [
      {
        id: uuidv4(),
        dayOfWeek: 1, // Lunes
        startTime: "09:00",
        endTime: "18:00",
        isActive: true,
      },
      {
        id: uuidv4(),
        dayOfWeek: 2, // Martes
        startTime: "09:00",
        endTime: "18:00",
        isActive: true,
      },
      {
        id: uuidv4(),
        dayOfWeek: 3, // Miércoles
        startTime: "09:00",
        endTime: "18:00",
        isActive: true,
      },
      {
        id: uuidv4(),
        dayOfWeek: 4, // Jueves
        startTime: "09:00",
        endTime: "18:00",
        isActive: true,
      },
      {
        id: uuidv4(),
        dayOfWeek: 5, // Viernes
        startTime: "09:00",
        endTime: "18:00",
        isActive: true,
      },
      {
        id: uuidv4(),
        dayOfWeek: 6, // Sábado
        startTime: "10:00",
        endTime: "16:00",
        isActive: true,
      },
      {
        id: uuidv4(),
        dayOfWeek: 0, // Domingo
        startTime: "00:00",
        endTime: "00:00",
        isActive: false,
      },
    ],
  });

  console.log("✅ Horarios laborales creados");

  // 6. Crear tiempos de descanso (para lunes)
  const mondayWorkingHours = await prisma.workingHours.findFirst({
    where: { dayOfWeek: 1 },
  });

  if (mondayWorkingHours) {
    await prisma.breakTime.create({
      data: {
        id: uuidv4(),
        working_hours_id: mondayWorkingHours.id,
        startTime: "13:00",
        endTime: "14:00",
        reason: "Hora de almuerzo",
      },
    });
  }

  console.log("✅ Tiempos de descanso creados");

  // 7. Crear servicios con categorías
  const haircut = await prisma.service.create({
    data: {
      cuid: uuidv4(),
      name: "Corte de Cabello",
      description: "Corte clásico con acabado profesional",
      detailedDescription:
        "Corte de cabello profesional con técnicas modernas. Incluye lavado, corte, secado y peinado final. Realizado por estilistas certificados.",
      benefits: [
        "Mejora la apariencia",
        "Estilo personalizado",
        "Productos de calidad",
        "Asesoramiento profesional",
      ],
      preparation: [
        "Lavar el cabello el día anterior",
        "Traer foto de referencia si se desea",
        "Llegar 10 minutos antes",
      ],
      price: 25.0,
      duration: 45,
      isActive: true,
      category: { connect: { id: beautyCategory.id } },
    },
  });

  const massage = await prisma.service.create({
    data: {
      cuid: uuidv4(),
      name: "Masaje Relajante",
      description: "Masaje completo de cuerpo de 60 minutos",
      detailedDescription:
        "Masaje terapéutico que combina técnicas suecas y de relajación. Alivia tensiones musculares, reduce el estrés y promueve la circulación sanguínea.",
      benefits: [
        "Reduce el estrés",
        "Alivia tensiones musculares",
        "Mejora la circulación",
        "Promueve la relajación",
      ],
      preparation: [
        "No comer 2 horas antes",
        "Usar ropa cómoda",
        "Informar sobre lesiones o condiciones médicas",
      ],
      price: 60.0,
      isActive: true,
      duration: 60,
      category: { connect: { id: wellnessCategory.id } },
    },
  });

  const facial = await prisma.service.create({
    data: {
      cuid: uuidv4(),
      name: "Tratamiento Facial",
      description: "Limpieza e hidratación facial profesional",
      detailedDescription:
        "Tratamiento facial completo que incluye análisis de piel, limpieza profunda, exfoliación, extracción suave, mascarilla y hidratación intensiva.",
      benefits: [
        "Limpieza profunda de poros",
        "Eliminación de células muertas",
        "Hidratación intensa",
        "Mejora la textura de la piel",
      ],
      preparation: [
        "No usar productos exfoliantes 24h antes",
        "Llegar sin maquillaje",
        "Informar sobre alergias o sensibilidades",
      ],
      price: 45.0,
      isActive: true,
      duration: 30,
      category: { connect: { id: beautyCategory.id } },
    },
  });

  const manicure = await prisma.service.create({
    data: {
      cuid: uuidv4(),
      name: "Manicure Básico",
      description: "Cuidado completo de uñas y manos",
      detailedDescription:
        "Servicio de manicure que incluye limado, cutículas, hidratación y esmalte. Disponible en una variedad de colores y finishes.",
      benefits: [
        "Uñas bien cuidadas",
        "Manos hidratadas",
        "Apariencia profesional",
        "Duración prolongada",
      ],
      preparation: [
        "No aplicar esmalte 24h antes",
        "Traer ideas de diseño si se desea",
      ],
      price: 20.0,
      isActive: true,
      duration: 30,
      category: { connect: { id: beautyCategory.id } },
    },
  });

  console.log("✅ Servicios creados");

  // 8. Crear archivos de servicio (imágenes)
  // await prisma.serviceFile.createMany({
  //   data: [
  //     {
  //       id: uuidv4(),
  //       serviceId: haircut.id,
  //       name: "haircut-main.jpg",
  //       path: "services/haircut/main.jpg",
  //       url: "https://supabase.com/storage/v1/object/public/service-images/haircut-main.jpg",
  //       size: 102400,
  //       type: "image/jpeg",
  //     },
  //     {
  //       id: uuidv4(),
  //       serviceId: massage.id,
  //       name: "massage-room.jpg",
  //       path: "services/massage/room.jpg",
  //       url: "https://supabase.com/storage/v1/object/public/service-images/massage-room.jpg",
  //       size: 98000,
  //       type: "image/jpeg",
  //     },
  //     {
  //       id: uuidv4(),
  //       serviceId: facial.id,
  //       name: "facial-treatment.jpg",
  //       path: "services/facial/treatment.jpg",
  //       url: "https://supabase.com/storage/v1/object/public/service-images/facial-treatment.jpg",
  //       size: 110000,
  //       type: "image/jpeg",
  //     },
  //     {
  //       id: uuidv4(),
  //       serviceId: manicure.id,
  //       name: "manicure-set.jpg",
  //       path: "services/manicure/set.jpg",
  //       url: "https://supabase.com/storage/v1/object/public/service-images/manicure-set.jpg",
  //       size: 95000,
  //       type: "image/jpeg",
  //     },
  //   ],
  // });

  // console.log("✅ Archivos de servicio creados");

  // 9. Crear citas de ejemplo
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Cita 1 con 2 servicios (PENDIENTE) - Hoy a las 10:00
  const appointment1Date = new Date(today);
  appointment1Date.setHours(10, 0, 0, 0);
  const appointment1EndDate = new Date(appointment1Date);
  appointment1EndDate.setMinutes(appointment1Date.getMinutes() + haircut.duration + facial.duration);

  await prisma.appointment.create({
    data: {
      cuid: uuidv4(),
      date: appointment1Date,
      endDate: appointment1EndDate,
      user_id: regularUser.id,
      duration: haircut.duration + facial.duration,
      total_price: haircut.price + facial.price,
      status: "PENDING",
      services: {
        create: [
          { service_id: haircut.id, quantity: 1 },
          { service_id: facial.id, quantity: 1 },
        ],
      },
    },
  });

  // Cita 2 con 1 servicio (CONFIRMADA) - Hoy a las 14:00
  const appointment2Date = new Date(today);
  appointment2Date.setHours(14, 0, 0, 0);
  const appointment2EndDate = new Date(appointment2Date);
  appointment2EndDate.setMinutes(appointment2Date.getMinutes() + massage.duration);

  await prisma.appointment.create({
    data: {
      cuid: uuidv4(),
      date: appointment2Date,
      endDate: appointment2EndDate,
      user_id: admin.id,
      duration: massage.duration,
      total_price: massage.price,
      status: "CONFIRMED",
      services: {
        create: [{ service_id: massage.id, quantity: 1 }],
      },
    },
  });

  // Cita 3 con 3 servicios (COMPLETADA) - Mañana a las 11:00
  const appointment3Date = new Date(tomorrow);
  appointment3Date.setHours(11, 0, 0, 0);
  const appointment3EndDate = new Date(appointment3Date);
  appointment3EndDate.setMinutes(appointment3Date.getMinutes() + haircut.duration + facial.duration + manicure.duration);

  await prisma.appointment.create({
    data: {
      cuid: uuidv4(),
      date: appointment3Date,
      endDate: appointment3EndDate,
      user_id: superAdmin.id,
      duration: haircut.duration + facial.duration + manicure.duration,
      total_price: haircut.price + facial.price + manicure.price,
      status: "COMPLETED",
      services: {
        create: [
          { service_id: haircut.id, quantity: 1 },
          { service_id: facial.id, quantity: 1 },
          { service_id: manicure.id, quantity: 1 },
        ],
      },
    },
  });

  // Cita 4 con 1 servicio (CANCELADA) - Mañana a las 15:00
  const appointment4Date = new Date(tomorrow);
  appointment4Date.setHours(15, 0, 0, 0);
  const appointment4EndDate = new Date(appointment4Date);
  appointment4EndDate.setMinutes(appointment4Date.getMinutes() + manicure.duration);

  await prisma.appointment.create({
    data: {
      cuid: uuidv4(),
      date: appointment4Date,
      endDate: appointment4EndDate,
      user_id: regularUser.id,
      duration: manicure.duration,
      total_price: manicure.price,
      status: "CANCELLED",
      services: {
        create: [{ service_id: manicure.id, quantity: 1 }],
      },
    },
  });

  console.log("✅ Citas con estados creadas");

  console.log("🎉 Base de datos poblada exitosamente!");
  console.log("\n📋 Datos creados:");
  console.log("- 3 Roles (SUPER_ADMIN, ADMIN, USER)");
  console.log("- 2 Sexos (Male, Female)");
  console.log("- 2 Categorías (Belleza, Bienestar)");
  console.log("- 3 Usuarios con diferentes roles");
  console.log("- 7 Horarios laborales (Lunes-Domingo)");
  console.log("- 1 Tiempo de descanso (Almuerzo Lunes)");
  console.log("- 4 Servicios activos sin imágenes");
  console.log("- 4 Citas de ejemplo con diferentes estados");
}

main()
  .catch((e) => {
    console.error("❌ Error al poblar la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });