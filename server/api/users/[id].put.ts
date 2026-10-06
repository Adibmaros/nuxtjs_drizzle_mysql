import { useDB, schema } from "~~/server/utils/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateBodySchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "ID tidak valid" });
  }

  const body = await readValidatedBody(event, updateBodySchema.parse);
  const db = useDB();

  const updateData: Record<string, any> = {};
  if (body.name) updateData.name = body.name;
  if (body.email) updateData.email = body.email;
  if (body.role) updateData.role = body.role;
  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10);
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, message: "Tidak ada data yang diubah" });
  }

  await db
    .update(schema.users)
    .set(updateData)
    .where(eq(schema.users.id, Number(id)));

  return { success: true, message: "User berhasil diperbarui" };
});
