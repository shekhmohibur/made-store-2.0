import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Please sign in to place an order.' }, { status: 401 });
  }

  try {
    const { items, shipping, paymentMethod = 'COD' } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    const order = await prisma.\$transaction(async (tx) => {
      let totalAmount = 0;
      const verifiedItems = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name} (${item.size}).`);
        }

        const unitPrice = Number(variant.product.salePrice || variant.product.basePrice);
        totalAmount += unitPrice * item.quantity;

        verifiedItems.push({
          variantId: variant.id,
          quantity: item.quantity,
          price: unitPrice,
        });

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const address = await tx.address.create({
        data: {
          userId: session.user.id,
          fullName: shipping.fullName,
          phone: shipping.phone,
          street: shipping.street,
          city: shipping.city,
          postalCode: shipping.postalCode,
          country: shipping.country || 'Bangladesh',
        },
      });

      const orderNumber = `ATL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      return tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId: address.id,
          totalAmount,
          paymentMethod,
          items: { create: verifiedItems },
        },
      });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to place order.' },
      { status: 400 }
    );
  }
}