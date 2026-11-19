import { AuthForm } from "@/components/ui/auth/AuthForm";


export default function LoginPage() {
  const { data: session, status } = useSession();
const router = useRouter();

useEffect(() => {
  if (status === 'authenticated') {
    router.replace(session?.user?.role === 'ADMIN' ? '/admin' : '/profile');
  }
}, [status, session, router]);
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-4 py-12">
      <AuthForm mode="login" />
    </main>
  );
}