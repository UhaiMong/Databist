import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db/connectDB";
import { User } from "@/lib/models";
import { verifyPassword } from "@/lib/auth/password";
import { isRateLimited, rateLimit } from "@/lib/security/rateLimit";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours/1day
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const loginKey = `login-fail:${email}`;
        const loginWindow = { limit: 5, windowMs: 15 * 60 * 1000 };
        const locked = isRateLimited(loginKey, loginWindow);
        if (locked.limited) return null;

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
          rateLimit(loginKey, loginWindow);
          return null;
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.passwordHash,
        );
        if (!isValid) {
          rateLimit(loginKey, loginWindow);
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
