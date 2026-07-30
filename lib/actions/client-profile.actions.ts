"use server"

import prisma from '@/lib/prisma';

export interface ClientAdminProfileData {
  notes: string;
  tags: string;
}

export async function getClientAdminProfile(clientId: string): Promise<ClientAdminProfileData | null> {
  try {
    const profile = await prisma.clientAdminProfile.findUnique({
      where: { clientId },
    });
    if (!profile) return null;
    return { notes: profile.notes || '', tags: profile.tags || '' };
  } catch (error) {
    console.error('Error getting client profile:', error);
    return null;
  }
}

export async function upsertClientAdminProfile(
  clientId: string,
  data: ClientAdminProfileData
): Promise<void> {
  try {
    await prisma.clientAdminProfile.upsert({
      where: { clientId },
      create: { clientId, notes: data.notes, tags: data.tags },
      update: { notes: data.notes, tags: data.tags },
    });
  } catch (error) {
    console.error('Error saving client profile:', error);
    throw new Error('Failed to save client profile');
  }
}
