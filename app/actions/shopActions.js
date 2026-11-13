"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- SITE SETTINGS (CMS) ---
export async function updateSiteSettings(formData) {
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {
      storeName: formData.get("storeName"),
      announcementBar: formData.get("announcementBar"),
      heroTitle: formData.get("heroTitle"),
      heroSubtitle: formData.get("heroSubtitle"),
      heroImageUrl: formData.get("heroImageUrl"),
      heroCtaText: formData.get("heroCtaText"),
      primaryColor: formData.get("primaryColor"),
      contactEmail: formData.get("contactEmail"),
    },
    create: {
      id: "default",
      storeName: formData.get("storeName"),
      announcementBar: formData.get("announcementBar"),
      heroTitle: formData.get("heroTitle"),
      heroSubtitle: formData.get("heroSubtitle"),
      heroImageUrl: formData.get("heroImageUrl"),
      heroCtaText: formData.get("heroCtaText"),
      primaryColor: formData.get("primaryColor"),
      contactEmail: formData.get("contactEmail"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

// --- CATEGORIES ---
export async function createCategory(formData) {
  const name = formData.get("name").trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  await prisma.category.create({
    data: { name, slug },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCategory(id) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- PRODUCTS ---
export async function createProduct(formData) {
  const name = formData.get("name").trim();
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
  const sizes = formData.get("sizes").split(",").map((s) => s.trim()).filter(Boolean);
  const colors = formData.get("colors").split(",").map((c) => c.trim()).filter(Boolean);

  await prisma.product.create({
    data: {
      name,
      slug,
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      imageUrl: formData.get("imageUrl"),
      sizes,
      colors,
      stock: parseInt(formData.get("stock"), 10),
      featured: formData.get("featured") === "on",
      categoryId: formData.get("categoryId"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProduct(id, formData) {
  const sizes = formData.get("sizes").split(",").map((s) => s.trim()).filter(Boolean);
  const colors = formData.get("colors").split(",").map((c) => c.trim()).filter(Boolean);

  await prisma.product.update({
    where: { id },
    data: {
      name: formData.get("name").trim(),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      imageUrl: formData.get("imageUrl"),
      sizes,
      colors,
      stock: parseInt(formData.get("stock"), 10),
      featured: formData.get("featured") === "on",
      categoryId: formData.get("categoryId"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProduct(id) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- ORDERS & CHECKOUT ---
export async function placeOrder({ customerName, customerEmail, address, cart }) {
  const session = await getSession();
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        userId: session?.id || null,
        customerName,
        customerEmail,
        address,
        totalAmount,
        items: {
          create: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.price,
          })),
        },
      },
    });

    for (const item of cart) {
      await tx.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/account");
}

export async function updateOrderStatus(orderId, status) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/admin");
  revalidatePath("/account");
}