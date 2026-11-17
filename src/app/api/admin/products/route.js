import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function verifyAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(req) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const slug =
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        basePrice: parseFloat(body.basePrice),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        images: body.images,
        featured: Boolean(body.featured),
        categoryId: body.categoryId,
        variants: {
          create: body.variants.map((v, idx) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || '#18181b',
            sku: `${slug.toUpperCase()}-${v.size}-${idx}`,
            stock: parseInt(v.stock, 10) || 0,
          })),
        },
      },
      include: { category: true, variants: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}