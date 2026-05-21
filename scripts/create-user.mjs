/**
 * Tạo user trong database (chạy sau khi migrate).
 *
 * Ví dụ:
 *   node scripts/create-user.mjs admin "Quản trị" admin123 ADMIN
 *   node scripts/create-user.mjs nv01 "Nguyễn Văn A" matkhau EMPLOYEE
 *
 * Role: ADMIN | SUPERVISOR | EMPLOYEE
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const [username, name, password, roleArg] = process.argv.slice(2);

if (!username || !name || !password || !roleArg) {
  console.error(
    "Usage: node scripts/create-user.mjs <username> <name> <password> <ADMIN|SUPERVISOR|EMPLOYEE>"
  );
  process.exit(1);
}

const role = roleArg.toUpperCase();
if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(role)) {
  console.error("Role must be ADMIN, SUPERVISOR, or EMPLOYEE");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username: username.trim().toLowerCase(),
      name,
      password: hash,
      role,
    },
  });
  console.log("Created user:", user.username, user.role, user.id);
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
