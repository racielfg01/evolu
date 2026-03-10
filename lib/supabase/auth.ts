"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../prisma";

export async function login(formData: FormData): Promise<{ error?: string } | null> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email.trim(),
    password: data.password.trim(),
  });

  if (error) {
    console.log("SignIn error:", error.message);
    
    // Siempre retornamos un objeto con propiedad 'error'
    return { 
      error: error.message === "Email not confirmed" 
        ? "Por favor confirma tu email antes de iniciar sesión" 
        : "Credenciales incorrectas. Verifica tu email y contraseña"
    };
  }

  revalidatePath("/");
  // Retornamos null para indicar éxito
  return null;
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
      phone: data.phone as string,
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
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in resetPassword:", error);
    return {
      error: "Ocurrió un error inesperado. Por favor intenta nuevamente.",
    };
  }
}


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
