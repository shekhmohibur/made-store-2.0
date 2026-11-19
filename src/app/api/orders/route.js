import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Please sign in to place an order.' }, { status: 401 });
  }

  try {
    const {
      items,
      shipping,
      paymentMethod = 'COD',
      deliveryZone = 'inside',
      senderPhone = '',
      paymentTrxId = '',
    } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    if (['BKASH', 'NAGAD', 'ROCKET'].includes(paymentMethod)) {
      if (!senderPhone?.trim() || !paymentTrxId?.trim()) {
        return NextResponse.json(
          { error: `Please enter your ${paymentMethod} sender number and Transaction ID.` },
          { status: 400 }
        );
      }
    }

    const settings = await getStoreSettings();
    const deliveryFee =
      deliveryZone === 'outside'
        ? settings.deliveryChargeOutside
        : settings.deliveryChargeInside;

    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
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
        subtotal += unitPrice * item.quantity;

        verifiedItems.push({
          variantId: variant.id,
          quantity: item.quantity,
          price: unitPrice,
          name: variant.product.name,
          size: variant.size,
          color: variant.color,
        });

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const totalAmount = subtotal + deliveryFee;

      const address = await tx.address.create({
        data: {
          userId: session.user.id,
          fullName: shipping.fullName,
          phone: shipping.phone,
          street: shipping.street,
          city: shipping.city,
          postalCode: shipping.postalCode || '',
          country: shipping.country || 'Bangladesh',
        },
      });

      const orderNumber = `ATL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId: address.id,
          totalAmount,
          paymentMethod,
          senderPhone: senderPhone?.trim() || null,
          paymentTrxId: paymentTrxId?.trim() || null,
          items: {
            create: verifiedItems.map(({ variantId, quantity, price }) => ({
              variantId,
              quantity,
              price,
            })),
          },
        },
      });

      return { createdOrder, verifiedItems, subtotal, deliveryFee, totalAmount };
    });

    // Build formatted WhatsApp message URL if WhatsApp order was chosen
    let whatsappUrl = null;
    if (paymentMethod === 'WHATSAPP' && settings.whatsappNumber) {
      const currency = settings.currencySymbol || '৳';
      const itemLines = order.verifiedItems
        .map(
          (i, idx) =>
            `${idx + 1}. *${i.name}* (${i.color} / ${i.size}) x${i.quantity} = ${currency}${(
              i.price * i.quantity
            ).toFixed(2)}`
        )
        .join('\n');

      const message = [
        `*New Order — ${settings.storeName}*`,
        `Order ID: *${order.createdOrder.orderNumber}*`,
        ``,
        `*Items:*`,
        itemLines,
        ``,
        `Subtotal: ${currency}${order.subtotal.toFixed(2)}`,
        `Delivery (${deliveryZone === 'outside' ? 'Outside Dhaka' : 'Inside Dhaka'}): ${currency}${order.deliveryFee.toFixed(2)}`,
        `*Grand Total: ${currency}${order.totalAmount.toFixed(2)}*`,
        ``,
        `*Customer Details:*`,
        `Name: ${shipping.fullName}`,
        `Phone: ${shipping.phone}`,
        `Address: ${shipping.street}, ${shipping.city}`,
      ].join('\n');

      whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    return NextResponse.json(
      {
        order: order.createdOrder,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to place order.' },
      { status: 400 }
    );
  }
}