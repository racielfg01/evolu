"use server";
// lib/actions/category.actions.ts
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";

// export const fetchAllCategories = async (): Promise<Category[]> => {
//   try {
//      console.log(" fetching categories:");
//     const categories= await prisma.category.findMany({
//       orderBy: { name: 'asc' }
//     });
//        console.log(" fetching categories:");
//        return categories
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw new Error('Failed to fetch categories');
//   }
// };

// Verifica tu instancia de Prisma

export const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    // console.log("🟢 Categorías obtenidas:", categories);
    return categories;
  } catch (error) {
    // console.error("🔴 Error Prisma:", error);
    throw error;
  }
};

export const createCategory = async (name: string): Promise<Category> => {
  try {
    if (!name) throw new Error("Category name is required");
    const category = await prisma.category.create({
      data: { name },
    });
    revalidatePath("/admin/settings");
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create category"
    );
  }
};

export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  try {
    if (!id || !name) throw new Error("ID and name are required");
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/admin/settings");
    return category;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update category"
    );
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    if (!id) throw new Error("Category ID is required");
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/settings");
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete category"
    );
  }
};
