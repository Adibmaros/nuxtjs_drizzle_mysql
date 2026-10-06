import { useDB, schema } from "~~/server/utils/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  userId: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, productSchema.parse);
  const db = useDB();

  const [result] = await db.insert(schema.products).values({
    name: body.name,
    userId: body.userId,
  });

  return {
    success: true,
    message: "Product berhasil ditambahkan",
    id: result.insertId,
    name: body.name,
    userId: body.userId,
  };
});
