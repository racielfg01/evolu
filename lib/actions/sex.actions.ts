'use server' 
// lib/actions/sex.actions.ts
import prisma from '@/lib/prisma';
import { Sex } from '@prisma/client';

export const fetchAllSexes = async (): Promise<Sex[]> => {
  try {
    return await prisma.sex.findMany({
      orderBy: { id: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching sexes:', error);
    throw new Error('Failed to fetch sexes');
  }
};

export const createSex = async (name: string): Promise<Sex> => {
  try {
    if (!name) throw new Error('Sex name is required');
    return await prisma.sex.create({
      data: { name }
    });
  } catch (error) {
    console.error('Error creating sex:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create sex');
  }
};

export const updateSex = async (id: string, name: string): Promise<Sex> => {
  try {
    if (!id || !name) throw new Error('ID and name are required');
    return await prisma.sex.update({
      where: { id },
      data: { name }
    });
  } catch (error) {
    console.error(`Error updating sex ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update sex');
  }
};

export const deleteSex = async (id: string): Promise<void> => {
  try {
    if (!id) throw new Error('Sex ID is required');
    await prisma.sex.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Error deleting sex ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete sex');
  }
};