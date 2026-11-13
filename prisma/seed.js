// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "ATELIER THREADS",
      announcementBar: "Complimentary Express Shipping on Orders Over $120",
      heroTitle: "ESSENTIAL FORM. TIMELESS WEAR.",
      heroSubtitle: "Architectural outerwear, heavyweight tees, and tailored trousers.",
      heroImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
      heroCtaText: "Explore Collection",
      primaryColor: "#111827",
      contactEmail: "support@atelierthreads.com",
    },
  });

  const tops = await prisma.category.upsert({
    where: { slug: "tops" },
    update: {},
    create: { name: "Tops & Tees", slug: "tops" },
  });

  const outerwear = await prisma.category.upsert({
    where: { slug: "outerwear" },
    update: {},
    create: { name: "Outerwear", slug: "outerwear" },
  });

  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Boxy Heavyweight Tee",
        slug: "boxy-heavyweight-tee",
        description: "300 GSM combed organic cotton t-shirt with dropped shoulders.",
        price: 48.0,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Washed Black", "Off-White", "Slate"],
        stock: 45,
        featured: true,
        categoryId: tops.id,
      },
      {
        name: "Wool Blend Overcoat",
        slug: "wool-blend-overcoat",
        description: "Double-breasted tailored coat in recycled Italian wool.",
        price: 240.0,
        imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
        sizes: ["S", "M", "L"],
        colors: ["Camel", "Charcoal"],
        stock: 12,
        featured: true,
        categoryId: outerwear.id,
      },
    ],
  });

  console.log("Seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());