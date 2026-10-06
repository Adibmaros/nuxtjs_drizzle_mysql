import { useDB } from "~~/server/utils/db";

export default defineEventHandler(async () => {
  const db = useDB();
  return await db.query.products.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
});
