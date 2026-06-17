import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { rateLimit } from "./rate-limit";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const ip = req?.headers?.["x-forwarded-for"]?.split(",")[0] ?? "unknown";
        const { success } = await rateLimit(`rl:login:${ip}`, 10, 900);
        if (!success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          plan: user.plan,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.plan = (user as any).plan;
        token.planRefreshedAt = Date.now();
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        token.plan = session.plan;
        token.role = session.role;
        token.planRefreshedAt = Date.now();
      }
      // Refresh plan from DB every 5 minutes (not every request)
      const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
      const lastRefreshed = (token.planRefreshedAt as number) || 0;
      if (token.id && Date.now() - lastRefreshed > REFRESH_INTERVAL_MS) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, planExpiresAt: true, role: true },
        });
        if (dbUser) {
          if (dbUser.plan === "PREMIUM" && dbUser.planExpiresAt && dbUser.planExpiresAt < new Date()) {
            await prisma.user.update({
              where: { id: token.id as string },
              data: { plan: "FREE", planExpiresAt: null },
            });
            token.plan = "FREE";
          } else {
            token.plan = dbUser.plan;
            token.role = dbUser.role;
          }
        }
        token.planRefreshedAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
