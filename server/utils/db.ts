import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../database/schema";

let pool: mysql.Pool | undefined;

export const useDB = () => {
  if (!pool) {
    const { databaseUrl } = useRuntimeConfig();
    pool = mysql.createPool({ uri: databaseUrl, connectionLimit: 10 });
  }
  return drizzle(pool, { schema, mode: "default" });
};

export { schema };
