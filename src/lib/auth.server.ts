import { betterAuth } from "better-auth";
import pkg from "pg";
// import fs from "node:fs";
import { sendEmailVerification } from "./sendEmail";

const { Pool } = pkg;

export const auth = betterAuth({
  database: new Pool({
    // ssl: {
    //   ca: fs.readFileSync(process.env.DB_SSL_CA || "./db.crt").toString(),
    // },
    connectionString: process.env.DB_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        await sendEmailVerification({
          name: user.name,
          email: user.email,
          link: url,
        });
      },
    },
  },
});
