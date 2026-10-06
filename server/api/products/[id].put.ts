import { useDB, schema } from "~~/server/utils/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  userId: z.number().int().positive().optional(),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "ID tidak valid" });
  }

  const body = await readValidatedBody(event, updateProductSchema.parse);
  const db = useDB();

  const updateData: Record<string, any> = {};
  if (body.name) updateData.name = body.name;
  if (body.userId) updateData.userId = body.userId;

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, message: "Tidak ada data yang diubah" });
  }

  await db
    .update(schema.products)
    .set(updateData)
    .where(eq(schema.products.id, Number(id)));

  return { success: true, message: "Product berhasil diperbarui" };
});
