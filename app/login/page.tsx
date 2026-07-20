import LoginForm from "../components/public/auth/LoginForm";

export const metadata = {
  title: "Login | Digital Resolution Dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <LoginForm />
    </div>
  );
}
