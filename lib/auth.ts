import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "lib/prisma";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { NextAuthOptions, getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // nextauth middleware only support jwt: https://next-auth.js.org/configuration/nextjs#caveats
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // session.accessToken = token.accessToken;
      session.user!.id = token.id as string;

      return session;
    },
  },
  events: {
    async createUser(message) {
      // Add a default desk for new users
      await prisma.desk.create({
        data: {
          name: "{{Default}}",
          userId: message.user.id,
        },
      });
    },
  },
} satisfies NextAuthOptions;
export async function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  const res = await getServerSession(...args, authOptions);
  if (!res) {
    throw new Error("No session found");
  }
  return res;
}

export async function authenticatedUser(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  const session = await auth(...args);
  if (!session.user) {
    throw new Error("No user found");
  }
  return session.user;
}
