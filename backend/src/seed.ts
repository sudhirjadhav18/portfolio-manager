import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = "admin@test.com";
  const name = "Admin";
  const rawPassword = "test";

  // Ensure default roles exist (ids '1' = Admin, '2' = Client)
  await prisma.role.upsert({
    where: { id: "1" },
    update: {},
    create: { id: "1", rolename: "Admin" },
  });
  await prisma.role.upsert({
    where: { id: "2" },
    update: {},
    create: { id: "2", rolename: "Client" },
  });

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Upsert user and set role to Admin ('1')
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashedPassword, roleId: "1", isActive: true },
    create: { email, name, password: hashedPassword, roleId: "1", isActive: true },
  });

  console.log("Seed complete. User:", { id: user.id, email: user.email, roleId: user.roleId });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


