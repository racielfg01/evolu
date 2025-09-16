'use server' 

// lib/actions/role.actions.ts
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export const fetchAllRoles = async (): Promise<Role[]> => {
  try {
    return await prisma.role.findMany({
      orderBy: { id: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw new Error('Failed to fetch roles');
  }
};

export const createRole = async (name: string): Promise<Role> => {

  try {
    console.log({name})
    if (!name) throw new Error('Role name is required');
    return await prisma.role.create({
      data: { name }
    });
  } catch (error) {
    console.error('Error creating role:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create role');
  }
};

export const updateRole = async (id: string, name: string): Promise<Role> => {
  try {
    if (!id || !name) throw new Error('ID and name are required');
    return await prisma.role.update({
      where: { id },
      data: { name }
    });
  } catch (error) {
    console.error(`Error updating role ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update role');
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {console.log({id})
    if (!id) throw new Error('Role ID is required');
    await prisma.role.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Error deleting role ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete role');
  }
};