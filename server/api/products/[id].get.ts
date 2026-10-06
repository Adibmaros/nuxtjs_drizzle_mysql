import { useDB, schema } from "~~/server/utils/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "ID tidak valid" });
  }

  const db = useDB();
  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, Number(id)),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!product) {
    throw createError({ statusCode: 404, message: "Product tidak ditemukan" });
  }

  return product;
});
