import { useDB, schema } from "~~/server/utils/db";

export default defineEventHandler(async () => {
  const db = useDB();
  return await db.select().from(schema.users);
});
