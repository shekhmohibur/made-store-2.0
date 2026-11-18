import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.title?.trim() || !body.image?.trim()) {
      return NextResponse.json(
        { error: 'Title and Image URL are required.' },
        { status: 400 }
      );
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
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
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json({ slide: updatedSlide });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update slide.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.heroSlide.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}