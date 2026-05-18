import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ambassadors = [
  { name: "Zarina", email: "zarina@edumind.kz", refCode: "ZARINA15" },
  { name: "Aibek", email: "aibek@edumind.kz", refCode: "AIBEK15" },
  { name: "Dana", email: "dana@edumind.kz", refCode: "DANA15" },
  { name: "Nurlan", email: "nurlan@edumind.kz", refCode: "NURLAN15" },
  { name: "Alibek", email: "alibek@edumind.kz", refCode: "ALIBEK15" },
  { name: "Madina", email: "madina@edumind.kz", refCode: "MADINA15" },
  { name: "Dias", email: "dias@edumind.kz", refCode: "DIAS15" },
  { name: "Ainur", email: "ainur@edumind.kz", refCode: "AINUR15" },
  { name: "Sultan", email: "sultan@edumind.kz", refCode: "SULTAN15" },
  { name: "Kamila", email: "kamila@edumind.kz", refCode: "KAMILA15" },
];

async function main() {
  console.log("Seeding ambassadors...");
  for (const amb of ambassadors) {
    await prisma.ambassador.upsert({
      where: { email: amb.email },
      update: {},
      create: {
        name: amb.name,
        email: amb.email,
        refCode: amb.refCode,
        commission: 15,
        isActive: true,
      },
    });
    console.log(`  ✓ Ambassador ${amb.name} (${amb.refCode})`);
  }

  console.log("\nSeeding Pro promo codes...");
  for (let i = 1; i <= 20; i++) {
    const code = `EDUPRO-${String(i).padStart(3, "0")}`;
    await prisma.promoCode.upsert({
      where: { code },
      update: {},
      create: { code, plan: "pro", months: 1 },
    });
    console.log(`  ✓ ${code}`);
  }

  console.log("\nSeeding Academic promo codes...");
  for (let i = 1; i <= 20; i++) {
    const code = `ACADKZ-${String(i).padStart(3, "0")}`;
    await prisma.promoCode.upsert({
      where: { code },
      update: {},
      create: { code, plan: "academic", months: 1 },
    });
    console.log(`  ✓ ${code}`);
  }

  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
