import { useDB, schema } from "~~/server/utils/db";
import { z } from "zod";
import bcrypt from "bcryptjs"; // 1. Import bcryptjs

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6), // Disarankan minimal 6 karakter
  role: z.enum(["admin", "user"]).default("user"), // 2. Sesuaikan dengan enum database
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = useDB();

  // 3. Hash password sebelum disimpan ke database!
  const hashedPassword = await bcrypt.hash(body.password, 10);

  // 4. Masukkan data ke database dengan password yang sudah di-hash
  const [result] = await db.insert(schema.users).values({
    name: body.name,
    email: body.email,
    password: hashedPassword,
    role: body.role,
  });

  // Jangan kembalikan password di response API demi keamanan!
  const { password, ...userWithoutPassword } = body;

  return {
    success: true,
    message: "User berhasil didaftarkan",
    id: result.insertId,
    ...userWithoutPassword
  };
});