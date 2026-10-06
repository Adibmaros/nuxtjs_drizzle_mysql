import { useDB, schema } from "~~/server/utils/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "ID tidak valid" });
  }

  const db = useDB();
  await db.delete(schema.products).where(eq(schema.products.id, Number(id)));

  return { success: true, message: "Product berhasil dihapus" };
});
