import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash("Password123!", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Alice Admin",
        email: "alice@example.com",
        passwordHash: pw,
        status: "active",
        lastLoginAt: new Date(),
      },
      {
        name: "Bob Blocked",
        email: "bob@example.com",
        passwordHash: pw,
        status: "blocked",
      },
      {
        name: "Uma Unverified",
        email: "uma@example.com",
        passwordHash: pw,
        status: "unverified",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
