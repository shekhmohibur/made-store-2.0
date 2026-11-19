import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';

export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();

    const updated = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        storeName: body.storeName?.trim() || 'ATELIER.',
        tagline: body.tagline?.trim() || '',
        currencySymbol: body.currencySymbol?.trim() || '৳',
        deliveryChargeInside: parseInt(body.deliveryChargeInside, 10) || 0,
        deliveryChargeOutside: parseInt(body.deliveryChargeOutside, 10) || 0,
        whatsappEnabled: Boolean(body.whatsappEnabled),
        whatsappNumber: body.whatsappNumber?.replace(/[^0-9]/g, '') || '',
        codEnabled: Boolean(body.codEnabled),
        bkashEnabled: Boolean(body.bkashEnabled),
        bkashNumber: body.bkashNumber?.trim() || '',
        nagadEnabled: Boolean(body.nagadEnabled),
        nagadNumber: body.nagadNumber?.trim() || '',
        rocketEnabled: Boolean(body.rocketEnabled),
        rocketNumber: body.rocketNumber?.trim() || '',
        sslcommerzEnabled: Boolean(body.sslcommerzEnabled),
      },
      create: { id: 'default' },
    });

    return NextResponse.json({ settings: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}