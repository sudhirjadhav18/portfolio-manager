import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const username = "admin";
  const email = "admin@test.com";
  const name = "Admin";
  const rawPassword = "test";

  // Ensure default roles exist (ids will autoincrement)
  let adminRole = await prisma.role.findUnique({ where: { rolename: "Admin" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { rolename: "Admin" } as any });
  }
  let clientRole = await prisma.role.findUnique({ where: { rolename: "Client" } });
  if (!clientRole) {
    clientRole = await prisma.role.create({ data: { rolename: "Client" } as any });
  }
  if (!adminRole) throw new Error("Admin role missing after upsert");

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Upsert user and set role to Admin ('1')
  const user = await prisma.user.upsert({
    where: { username },
    update: { name, password: hashedPassword, roleId: adminRole.id as any, isActive: true, email },
    create: { username, email, name, password: hashedPassword, roleId: adminRole.id as any, isActive: true },
  });

  console.log("Seed complete. User:", { id: user.id, username: user.username, roleId: user.roleId });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


