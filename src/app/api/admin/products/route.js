import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function verifyAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(req) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (!body.name?.trim() || !body.categoryId) {
      return NextResponse.json(
        { error: 'Product name and category are required.' },
        { status: 400 }
      );
    }

    if (!body.variants || body.variants.length === 0) {
      return NextResponse.json(
        { error: 'Please add at least one size/color variant.' },
        { status: 400 }
      );
    }

    // Deduplicate variants by size + color to satisfy @@unique([productId, size, color])
    const uniqueVariantsMap = new Map();
    for (const v of body.variants) {
      const size = v.size?.trim().toUpperCase();
      const color = v.color?.trim();
      if (!size || !color) continue;
      uniqueVariantsMap.set(`${size}-${color.toLowerCase()}`, {
        size,
        color,
        colorHex: v.colorHex || '#18181b',
        stock: parseInt(v.stock, 10) || 0,
      });
    }

    const cleanVariants = Array.from(uniqueVariantsMap.values());
    if (cleanVariants.length === 0) {
      return NextResponse.json(
        { error: 'Each variant must have both a size and a color.' },
        { status: 400 }
      );
    }

    const slug =
      body.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug,
        description: body.description?.trim() || '',
        basePrice: parseFloat(body.basePrice),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
        featured: Boolean(body.featured),
        categoryId: body.categoryId,
        variants: {
          create: cleanVariants.map((v, idx) => ({
            ...v,
            sku: `${slug.toUpperCase()}-${v.size}-${idx}`,
          })),
        },
      },
      include: { category: true, variants: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product.' },
      { status: 400 }
    );
  }
}