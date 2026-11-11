import type { Metadata } from "next";
import LoginForm from "../components/public/auth/LoginForm";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Login",
    description: "Databist admin dashboard login.",
    path: "/login",
    noIndex: true,
  }),
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <LoginForm />
    </div>
  );
}
