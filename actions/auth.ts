// "use server";
// import  prisma  from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// // import { generateVerificationToken } from "@/lib/tokens";

// export async function register(data: { email: string; password: string }) {
//   const hashedPassword = await bcrypt.hash(data.password, 10);
  
//   const existingUser = await prisma.user.findUnique({
//     where: { email: data.email }
//   });

//   if (existingUser) {
//     return { error: "El usuario ya existe" };
//   }

//   await prisma.user.create({
//     data: {
//       email: data.email,
//       password: hashedPassword,
//       image:"",
      
//     }
//   });

// //   const verificationToken = await generateVerificationToken(data.email);
// // //   Enviar email de verificación
// //   console.log(`Verification token: ${verificationToken.token}`);
//   console.log(`Verification token:`);

//   return { success: "¡Cuenta creada! Por favor verifica tu email." };
// }