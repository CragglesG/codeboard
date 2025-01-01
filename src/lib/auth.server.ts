import { betterAuth } from "better-auth";
import pkg from "pg";
import fs from "node:fs";

const { Pool } = pkg;

export const auth = betterAuth({
  database: new Pool({
    ssl: {
      ca: fs.readFileSync(process.env.DB_SSL_CA || "./db.crt").toString(),
    },
    connectionString: process.env.DB_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
