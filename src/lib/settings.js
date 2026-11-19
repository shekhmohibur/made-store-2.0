import { prisma } from './prisma';

export async function getStoreSettings() {
  return prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });
}