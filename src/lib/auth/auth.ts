import { serverOnly } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, magicLink, mcp, openAPI, organization } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins/email-otp";
import { passkey } from "better-auth/plugins/passkey";
import { twoFactor } from "better-auth/plugins/two-factor";
import { reactStartCookies } from "better-auth/react-start";
import ResetPasswordEmail from "@/components/emails/reset-password-email";
import SendMagicLinkEmail from "@/components/emails/send-magic-link-email";
import SendVerificationOTP from "@/components/emails/send-verification-otp";
import VerifyEmail from "@/components/emails/verify-email";
import WelcomeEmail from "@/components/emails/welcome-email";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema/auth";
import { sendEmail } from "@/lib/resend";
import { env } from "../env.server";
import { ac, admin as adminRole, superadmin as superAdminRole, user as userRole } from "./permissions";

export const auth = serverOnly(() =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    basePath: "/api/auth",
    baseURL: env.SERVER_URL,
    trustedOrigins: [env.SERVER_URL],
    onAPIError: {
      throw: true,
      onError: (error) => {
        console.error("auth onAPIError", error);
      },
      errorURL: "/login",
    },
    rateLimit: {
      enabled: true,
      max: 100,
      window: 10,
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    logger: {
      enabled: true,
      level: "info",
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await sendEmail({
              subject: "Welcome to MyApp",
              template: WelcomeEmail({
                username: user.name || user.email,
              }),
              to: user.email,
            });
          },
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      async sendResetPassword({ url, user }) {
        await sendEmail({
          subject: "Reset your password",
          template: ResetPasswordEmail({
            resetLink: url,
            username: user.email,
          }),
          to: user.email,
        });
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ url, user }) => {
        await sendEmail({
          subject: "Verify your email",
          template: VerifyEmail({
            url,
            username: user.email,
          }),
          to: user.email,
        });
      },
    },

    plugins: [
      openAPI(),
      twoFactor(),
      passkey(),
      admin({
        defaultRole: "user",
        adminRoles: ["admin", "superadmin"],
        ac,
        roles: {
          user: userRole,
          admin: adminRole,
          superadmin: superAdminRole,
        },
      }),
      organization(),
      mcp({
        loginPage: "/login",
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          await sendEmail({
            subject: "Verify your email",
            template: SendVerificationOTP({
              username: email,
              otp,
            }),
            to: email,
          });
        },
      }),
      magicLink({
        sendMagicLink: async ({ email, token, url }) => {
          await sendEmail({
            subject: "Magic Link",
            template: SendMagicLinkEmail({
              username: email,
              url,
              token,
            }),
            to: email,
          });
        },
      }),
      reactStartCookies(), // make sure this is the last plugin in the array
    ],
  })
)();
