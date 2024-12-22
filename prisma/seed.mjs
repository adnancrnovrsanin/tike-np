import { PrismaClient, Gender, ShoeSize } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Brisanje postojećih podataka
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.userProfile.deleteMany({});

  // 2. Kreiranje kategorije za patike
  const footwearCat = await prisma.category.create({
    data: {
      category_id: 10,
      name: "Footwear",
    },
  });

  // 3. Kreiranje proizvoda
  await prisma.product.create({
    data: {
      product_id: 1001,
      name: "ActiveCore Prime",
      brand: "Reebok",
      description:
        "Vrhunske patike za trčanje sa naprednom tehnologijom za amortizaciju i podršku stopalu.",
      basePrice: 120,
      margin: 0.35,
      imageUrl:
        "https://bsqujpxhwobcynxvgykt.supabase.co/storage/v1/object/sign/products/activecore-prime.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0cy9hY3RpdmVjb3JlLXByaW1lLmpwZyIsImlhdCI6MTczNDg3OTM5NiwiZXhwIjoxODkyNTU5Mzk2fQ.ET_2YGrZbq-aftFm0yyPfKAU9mKvE_KRXz_-DY0V6qY&t=2024-12-22T14%3A56%3A36.476Z",
      categoryId: footwearCat.id,
      gender: Gender.men,
      color: "Black",
      variants: {
        create: [
          { shoeSize: ShoeSize.EU_40, quantity: 8 },
          { shoeSize: ShoeSize.EU_41, quantity: 10 },
          { shoeSize: ShoeSize.EU_42, quantity: 12 },
          { shoeSize: ShoeSize.EU_43, quantity: 15 },
          { shoeSize: ShoeSize.EU_44, quantity: 8 },
          { shoeSize: ShoeSize.EU_45, quantity: 5 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 1002,
      name: "Aeroflex Edge",
      brand: "Adidas",
      description:
        "Lagane i fleksibilne patike za svakodnevno trčanje sa Aeroflex tehnologijom za maksimalnu udobnost.",
      basePrice: 140,
      margin: 0.3,
      imageUrl:
        "https://bsqujpxhwobcynxvgykt.supabase.co/storage/v1/object/sign/products/aeroflex-edge.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0cy9hZXJvZmxleC1lZGdlLmpwZyIsImlhdCI6MTczNDg3OTUwNywiZXhwIjoxNzM1MzExNTA3fQ.1qejNW60V5Io28hA6LO9j3PNgzO801tKEz6ZxfhT52E&t=2024-12-22T14%3A58%3A26.730Z",
      categoryId: footwearCat.id,
      gender: Gender.women,
      color: "White",
      variants: {
        create: [
          { shoeSize: ShoeSize.EU_39, quantity: 5 },
          { shoeSize: ShoeSize.EU_40, quantity: 8 },
          { shoeSize: ShoeSize.EU_41, quantity: 12 },
          { shoeSize: ShoeSize.EU_42, quantity: 15 },
          { shoeSize: ShoeSize.EU_43, quantity: 10 },
          { shoeSize: ShoeSize.EU_44, quantity: 6 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 1003,
      name: "Pro Run Velocity",
      brand: "Nike",
      description:
        "Profesionalne patike za trčanje sa naprednom Velocity tehnologijom za maksimalne performanse.",
      basePrice: 160,
      margin: 0.4,
      imageUrl:
        "https://bsqujpxhwobcynxvgykt.supabase.co/storage/v1/object/sign/products/prorun-velocity.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0cy9wcm9ydW4tdmVsb2NpdHkuanBnIiwiaWF0IjoxNzM0ODc5NTI0LCJleHAiOjE4OTI1NTk1MjR9.appuB1YhnqJDDfcazo3m9IAyY9bPq45zn5Tv08YrQn8&t=2024-12-22T14%3A58%3A43.692Z",
      categoryId: footwearCat.id,
      gender: Gender.unisex,
      color: "Red",
      variants: {
        create: [
          { shoeSize: ShoeSize.EU_40, quantity: 10 },
          { shoeSize: ShoeSize.EU_41, quantity: 15 },
          { shoeSize: ShoeSize.EU_42, quantity: 18 },
          { shoeSize: ShoeSize.EU_43, quantity: 12 },
          { shoeSize: ShoeSize.EU_44, quantity: 8 },
          { shoeSize: ShoeSize.EU_45, quantity: 5 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 1004,
      name: "SprintMax 3000",
      brand: "Adidas",
      description:
        "Vrhunske trkačke patike dizajnirane za sprint i kratke distance sa SprintMax tehnologijom.",
      basePrice: 150,
      margin: 0.35,
      imageUrl:
        "https://bsqujpxhwobcynxvgykt.supabase.co/storage/v1/object/sign/products/sprintmax-3000.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0cy9zcHJpbnRtYXgtMzAwMC5qcGciLCJpYXQiOjE3MzQ4Nzk1NDIsImV4cCI6MTg5MjU1OTU0Mn0.hdWc8EDZSQ5qOSgYjXTGjBN36bFcxBXBFs2gMRv9J-0&t=2024-12-22T14%3A59%3A02.264Z",
      categoryId: footwearCat.id,
      gender: Gender.men,
      color: "Blue",
      variants: {
        create: [
          { shoeSize: ShoeSize.EU_39, quantity: 6 },
          { shoeSize: ShoeSize.EU_40, quantity: 10 },
          { shoeSize: ShoeSize.EU_41, quantity: 14 },
          { shoeSize: ShoeSize.EU_42, quantity: 16 },
          { shoeSize: ShoeSize.EU_43, quantity: 12 },
          { shoeSize: ShoeSize.EU_44, quantity: 8 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 1005,
      name: "Strider Vortex",
      brand: "Nike",
      description:
        "Inovativne patike sa Vortex tehnologijom za stabilnost i udobnost tokom dugih trčanja.",
      basePrice: 170,
      margin: 0.38,
      imageUrl:
        "https://bsqujpxhwobcynxvgykt.supabase.co/storage/v1/object/sign/products/strider-vortex.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0cy9zdHJpZGVyLXZvcnRleC5qcGciLCJpYXQiOjE3MzQ4Nzk1NzgsImV4cCI6MTg5MjU1OTU3OH0.4IHw5-Av9dR5nc4kUlvGKOAtlIAyAtaMWglPYvRiY9Y&t=2024-12-22T14%3A59%3A38.002Z",
      categoryId: footwearCat.id,
      gender: Gender.women,
      color: "Purple",
      variants: {
        create: [
          { shoeSize: ShoeSize.EU_40, quantity: 8 },
          { shoeSize: ShoeSize.EU_41, quantity: 12 },
          { shoeSize: ShoeSize.EU_42, quantity: 15 },
          { shoeSize: ShoeSize.EU_43, quantity: 10 },
          { shoeSize: ShoeSize.EU_44, quantity: 7 },
          { shoeSize: ShoeSize.EU_45, quantity: 4 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      product_id: 1006,
      name: "Trail Blaze",
      brand: "Nike",
      description:
        "Izdržljive patike za trail running sa posebnom gripom za sve vrste terena.",
      basePrice: 145,
      margin: 0.32,
      imageUrl:
        "https://bsqujpxhwobcynxvgykt.supabase.co/storage/v1/object/sign/products/trail-blaze.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0cy90cmFpbC1ibGF6ZS5qcGciLCJpYXQiOjE3MzQ4Nzk1OTksImV4cCI6MTg5MjU1OTU5OX0.v38TYexwhipKOFmhZ3rAgz4arpaZ3eA-R_U0zdKpXD8&t=2024-12-22T14%3A59%3A59.109Z",
      categoryId: footwearCat.id,
      gender: Gender.unisex,
      color: "Green",
      variants: {
        create: [
          { shoeSize: ShoeSize.EU_40, quantity: 6 },
          { shoeSize: ShoeSize.EU_41, quantity: 10 },
          { shoeSize: ShoeSize.EU_42, quantity: 14 },
          { shoeSize: ShoeSize.EU_43, quantity: 12 },
          { shoeSize: ShoeSize.EU_44, quantity: 8 },
          { shoeSize: ShoeSize.EU_45, quantity: 5 },
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
