export default {
  outputPath: "./services",
  prismaClientPath: "@prisma/client",
  typesPath: "./types", // Opcional, si tus tipos están en otra ubicación
  validation: "none", // o 'zod' si quieres validación
  generateTests: false,
};