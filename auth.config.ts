import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Restrict to specific email addresses for security
  callbacks: {
    signIn({ user }) {
      const allowedEmails = [
        "nate.sena1@gmail.com",
        "jltk3260@gmail.com", // Dr. Joanna
      ];
      return allowedEmails.includes(user.email?.toLowerCase() ?? "");
    },
  },
};
