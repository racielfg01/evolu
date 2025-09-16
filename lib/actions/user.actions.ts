'use server' 

// lib/actions/role.actions.ts
import prisma from '@/lib/prisma';
import {  User } from '@prisma/client';

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching Users:', error);
    throw new Error('Failed to fetch Users');
  }
};



export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      
    });

    if (!user) {
      throw new Error("user not found");
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user"
    );
  }
};


export const createUser = async (data:Omit<User,"id">): Promise<User> => {

  try {
    if (!data) throw new Error('User is required');
    return await prisma.user.create({
      data
    });
  } catch (error) {
    console.error('Error creating User:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create User');
  }
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  try {
    if (!id || !data) throw new Error('ID and name are required');
    return await prisma.user.update({
      where: { id },
      data 
    });
  } catch (error) {
    console.error(`Error updating User ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update User');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {console.log({id})
    if (!id) throw new Error('User ID is required');
    await prisma.user.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Error deleting User ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete User');
  }
};