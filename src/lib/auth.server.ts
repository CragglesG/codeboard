import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import pkg from "pg";
// import fs from "node:fs";
import {
  sendChangeEmailVerification,
  sendEmailVerification,
  sendResetPassword,
} from "./sendEmail";

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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendResetPassword({
        name: user.name,
        email: user.email,
        link: url,
      });
    },
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
        await sendChangeEmailVerification({
          name: user.name,
          email: user.email,
          link: url,
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmailVerification({
        name: user.name,
        email: user.email,
        link: url,
      });
    },
    sendOnSignUp: true,
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "slack",
          clientId: process.env.SLACK_CLIENT_ID as string,
          clientSecret: process.env.SLACK_CLIENT_SECRET as string,
          authorizationUrl: "https://slack.com/oauth/v2/authorize",
          tokenUrl: "https://slack.com/api/oauth.v2.access",
          scopes: ["users:read", "users:read.email"],
        },
      ],
    }),
  ],
});
