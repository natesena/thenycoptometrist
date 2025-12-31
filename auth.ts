import payloadConfig from "@payload-config";
import { getPayload } from "payload";
import { withPayload } from "payload-authjs";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const payload = await getPayload({ config: payloadConfig });

export const { handlers, signIn, signOut, auth } = NextAuth(
  withPayload(authConfig, { payload })
);
