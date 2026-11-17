import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, image } = await req.json();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const category = await prisma.category.create({
    data: { name, slug, image: image || null },
  });

  return NextResponse.json({ category }, { status: 201 });
}