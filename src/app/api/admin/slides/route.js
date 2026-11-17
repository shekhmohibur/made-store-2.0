import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.title?.trim() || !body.image?.trim()) {
      return NextResponse.json(
        { error: 'Title and Image URL are required.' },
        { status: 400 }
      );
    }

    const slide = await prisma.heroSlide.create({
      data: {
        badge: body.badge?.trim() || null,
        title: body.title.trim(),
        subtitle: body.subtitle?.trim() || null,
        image: body.image.trim(),
        ctaLabel: body.ctaLabel?.trim() || 'Shop Collection',
        ctaLink: body.ctaLink?.trim() || '/shop',
        secCtaLabel: body.secCtaLabel?.trim() || null,
        secCtaLink: body.secCtaLink?.trim() || null,
        sortOrder: parseInt(body.sortOrder, 10) || 0,
      },
    });

    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create slide.' }, { status: 500 });
  }
}