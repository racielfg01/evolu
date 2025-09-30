"use server";
// import { supabase } from "../supabase/client";
// import { createClient } from "../supabase/server";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// // Registro con email
// export async function signUpWithEmail({
//   email,
//   password,
//   name,
//   sex_id,
//   phone
// }: {
//   email: string;
//   password: string;
//   name: string;
//   sex_id: string;
//   phone: string;
// }) {
//   try {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { displayName:name,phone },
//       },
//     });

//     if (error) {
//       console.error("SignUp Error:", error);
//       throw new Error(error.message);
//     }

//     // Crear usuario en Prisma
//     if (data.user) {
//       if (!data.user.email) {
//         throw new Error("User email is missing after sign up");
//       }

//       const roleUser = await prisma.role.findUnique({
//         where: { name: "USER" },
//       });

//       await prisma.user.create({
//         data: {
//           id: data.user.id,
//           email: data.user.email,
//           name,
//           cuid: data.user.id,
//           password,
//           image: "",
//           sex_id,
//           role_id: roleUser?.id as string,
//         },
//       });
//     }

//     return data;
//   } catch (error) {
//     console.error("SignUp Failed:", error);
//     throw error;
//   }
// }

// // Inicio de sesión
// // export async function signInWithEmail({
// //   email,
// //   password,
// // }: {
// //   email: string;
// //   password: string;
// // }) {
// //   try {
// //     console.log(email, password);
// //     const { data, error } = await supabase.auth.signInWithPassword({
// //       email,
// //       password,
// //     });

// //     if (error) {
// //       console.error("SignIn Error:", error);
// //       throw new Error(error.message);
// //     }

// //     return data;
// //   } catch (error) {
// //     console.error("SignIn Failed:", error);
// //     throw error;
// //   }
// // }

// // export async function signInWithEmail({
// //   email,
// //   password,
// // }: {
// //   email: string;
// //   password: string;
// // }) {
// //   try {
// //     const user = await prisma.user.findUnique({
// //       where: { email },
// //     });

// //     if (!user) {
// //       throw new Error("Usuario no encontrado");
// //     }

// //     const isValid = await bcrypt.compare(password, user.password);
// //     if (!isValid) {
// //       throw new Error("Credenciales inválidas");
// //     }

// //     return user;
// //   } catch (error) {
// //     console.error("SignIn Failed:", error);
// //     throw error;
// //   }
// // }

// // Cerrar sesión
// export async function signOut() {
//   try {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw new Error(error.message);
//   } catch (error) {
//     console.error("SignOut Failed:", error);
//     throw error;
//   }
// }

// // Obtener usuario actual (Client Component)
// export async function getCurrentUser() {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return null;

//     return await prisma.user.findUnique({
//       where: { id: user.id },
//     });
//   } catch (error) {
//     console.error("getCurrentUser Error:", error);
//     return null;
//   }
// }

// // Obtener usuario actual (Server Component)
// export async function getCurrentUserServer() {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return null;

//     return await prisma.user.findUnique({
//       where: { id: user.id },
//     });
//   } catch (error) {
//     console.error("getCurrentUserServer Error:", error);
//     return null;
//   }
// }

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../prisma";
// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";
// import { Resend } from "resend";
// import { type NextRequest, NextResponse } from "next/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email.trim(),
    password: data.password,
  });

  if (error) {
    console.error("SignIp error:", error.message);
    if (error.message == "Email not confirmed") {
      revalidatePath("/", "layout");
      redirect("/");
    }
    // Return error message instead of redirecting
    return { error: error.message };
    // redirect('/error')
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: formData.get("phone") as string,
    sex_id: formData.get("sexo"),
    name: formData.get("name"),
  };
  console.log("data", data);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Please enter a valid email address");
  }

  const { data: newUser, error } = await supabase.auth.signUp({
    email: data.email.trim(),
    password: data.password,
    phone: data.phone,
  });

  if (error) {
    console.error("Signup error:", error?.message);

    return { error: error?.message };
  }
  const role = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  await prisma.user.create({
    data: {
      cuid: newUser.user?.id as string,
      email: data.email,
      name: data.name as string,
      sex_id: data.sex_id as string,
      role_id: role?.id as string,
      password: data.email,
      image: data.name as string,
    },
  });

  return { success: "¡Cuenta creada! Por favor verifica tu email." };
}

export async function signOut() {
  const supabase = await createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath("/");
  redirect("/login");
}

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function resetPassword(email: string) {
  const supabase = createClient();

  try {
    // 1. Enviar magic link para reset de contraseña
    const { error } = await (
      await supabase
    ).auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    });

    if (error) {
      console.error("Error resetting password:", error.message);
      return { error: error.message };
    }

    // 2. Enviar email personalizado (opcional, ya que Supabase envía uno por defecto)
    // const { data: emailData, error: emailError } = await resend.emails.send({
    //   from: "Evolu <no-reply@evolu.com>",
    //   to: email,
    //   subject: "Restablece tu contraseña en Evolu",
    //   html: `
    //   <!DOCTYPE html>
    //   <html>
    //   <head>
    //       <style>
    //           body { font-family: 'Arial', sans-serif; background-color: #f4f7f4; color: #1a211a; line-height: 1.6; margin: 0; padding: 0; }
    //           .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
    //           .header { background-color: #6B8E6B; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: white; }
    //           .content { padding: 25px; }
    //           .button { display: inline-block; padding: 12px 24px; background-color: #527152; color: white !important; text-decoration: none; border-radius: 30px; font-weight: bold; margin: 20px 0; text-align: center; }
    //           .footer { text-align: center; font-size: 12px; color: #86a986; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e6ede6; }
    //           .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 10px; }
    //       </style>
    //   </head>
    //   <body>
    //       <div class="container">
    //           <div class="header">
    //               <div class="logo">Evolu</div>
    //               <h2 style="margin:0; color:white;">Restablecer tu contraseña</h2>
    //           </div>

    //           <div class="content">
    //               <p>¡Hola!</p>

    //               <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Evolu.</p>

    //               <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>

    //               <p style="text-align: center;">
    //                   <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password#access_token=$TOKEN&refresh_token=$REFRESH_TOKEN&expires_in=3600&token_type=bearer&type=recovery" class="button">Restablecer contraseña</a>
    //               </p>

    //               <p><small>Este enlace expirará en 1 hora y solo puede usarse una vez.</small></p>

    //               <p>Si no has solicitado este cambio, por favor ignora este mensaje.</p>

    //               <p>Con cariño,<br>El equipo de Evolu</p>
    //           </div>

    //           <div class="footer">
    //               <p>© ${new Date().getFullYear()} Evolu - Depilación y Masajes Relajantes</p>
    //               <p>Diseñado para tu bienestar</p>
    //           </div>
    //       </div>
    //   </body>
    //   </html>
    //   `,
    // });

    // if (emailError) {
    //   console.error("Error sending custom email:", emailError);
    //   // No retornes error aquí porque Supabase ya envió el email básico
    // }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in resetPassword:", error);
    return {
      error: "Ocurrió un error inesperado. Por favor intenta nuevamente.",
    };
  }
}

// Función para actualizar la contraseña después del reset
// export async function updatePassword(newPassword: string) {
//   const supabase = createClient();

//   try {
//     const { data, error } = await (await supabase).auth.updateUser({
//       password: newPassword,
//     });

//     if (error) {
//       console.error("Error updating password:", error.message);
//       return { error: error.message };
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Unexpected error in updatePassword:", error);
//     return { error: "Ocurrió un error al actualizar la contraseña." };
//   }
// }
export async function updatePassword(newPassword: string, token?: string) {
  const supabase = createClient();

  try {
    // Si hay token, usamos el método de recuperación
    if (token) {
      const { error } = await (
        await supabase
      ).auth.updateUser({ password: newPassword });

      if (error) throw error;
      return { success: true };
    }

    // Si no hay token, intentamos con la sesión actual
    const { error } = await (
      await supabase
    ).auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      error: error || "Ocurrió un error al actualizar la contraseña.",
    };
  }
}

// Helper para obtener el usuario autenticado
export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const id = user?.id ? user?.id : "";

    const userdata = await prisma.user.findFirst({
      where: { cuid: id },
      include: {
        role: true,
        sex: true,
      },
    });

    return userdata;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// Helper para obtener la sesión completa
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
