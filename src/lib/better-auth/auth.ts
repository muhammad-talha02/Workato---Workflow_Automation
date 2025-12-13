import { checkout, polar, portal } from "@polar-sh/better-auth";
import prisma from "@/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polarClient } from "../polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins:[process.env.NEXT_PUBLIC_APP_URL!, process.env.NEXT_PUBLIC_NGROK_URL!],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "9ca3fba5-2ac0-48a1-976a-f93549b628cd",
              slug: "pro",
            },
          ],
          successUrl:process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly:true
        }),
        portal()
      ],
    }),
  ],
});
