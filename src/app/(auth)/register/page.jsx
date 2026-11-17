import { AuthForm } from "@/components/ui/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-4 py-12">
      <AuthForm mode="register" />
    </main>
  );
}