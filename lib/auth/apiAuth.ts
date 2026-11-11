import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/auth.config";

export type ApiSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "admin" | "staff";
};

export type ApiSession = {
  user: ApiSessionUser;
};

type AuthSuccess = { session: ApiSession; error?: undefined };
type AuthFailure = { session?: undefined; error: NextResponse };
export type AuthResult = AuthSuccess | AuthFailure;

export async function getApiSession() {
  return getServerSession(authConfig);
}

export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  return {
    session: {
      user: {
        id: (session.user as ApiSessionUser).id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as ApiSessionUser).role,
      },
    },
  };
}

export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth();
  if (result.error) return result;

  if (result.session.user.role !== "admin") {
    return {
      error: NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return result;
}
