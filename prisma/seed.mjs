import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Obrisi sve
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.userProfile.deleteMany({});

  // 2. Kreiramo dve kategorije
  const footwearCat = await prisma.category.create({
    data: {
      category_id: 10,
      name: "Footwear",
    },
  });

  const clothingCat = await prisma.category.create({
    data: {
      category_id: 20,
      name: "Clothing",
    },
  });

  // 3. Kreiramo proizvode (par patika, par odeće)
  await prisma.product.create({
    data: {
      product_id: 1001,
      name: "Nike Air Max 90",
      brand: "Nike",
      description: "Legendarne patike za trčanje i lifestyle.",
      basePrice: 150,
      margin: 0.3,
      categoryId: footwearCat.id,
      variants: {
        create: [
          { size: "36", quantity: 10 },
          { size: "37", quantity: 8 },
          { size: "38", quantity: 5 },
          { size: "39", quantity: 2 },
          { size: "40", quantity: 6 },
          { size: "45", quantity: 1 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 1002,
      name: "Adidas Ultraboost",
      brand: "Adidas",
      description: "Udobne patike sa Boost đonom.",
      basePrice: 180,
      margin: 0.25,
      categoryId: footwearCat.id,
      variants: {
        create: [
          { size: "36", quantity: 3 },
          { size: "37", quantity: 4 },
          { size: "39", quantity: 6 },
          { size: "40", quantity: 10 },
          { size: "41", quantity: 5 },
          { size: "44", quantity: 2 },
          { size: "45", quantity: 1 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 2001,
      name: "Nike Hoodie",
      brand: "Nike",
      description: "Udobna dukserica sa kapuljačom.",
      basePrice: 60,
      margin: 0.4,
      categoryId: clothingCat.id,
      variants: {
        create: [
          { size: "S", quantity: 5 },
          { size: "M", quantity: 10 },
          { size: "L", quantity: 8 },
          { size: "XL", quantity: 4 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 2002,
      name: "Adidas T-Shirt",
      brand: "Adidas",
      description: "Basic majica za trening ili svakodnevno nošenje.",
      basePrice: 25,
      margin: 0.3,
      categoryId: clothingCat.id,
      variants: {
        create: [
          { size: "S", quantity: 3 },
          { size: "M", quantity: 3 },
          { size: "XL", quantity: 2 },
          { size: "XXL", quantity: 1 },
        ],
      },
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
