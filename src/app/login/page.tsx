import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in to Cătină</h1>
      <p className="mt-2 text-muted">
        Auth is Supabase-backed and wired up in the app shell, but the sign-in
        form lands with the database work. Until then the app routes are
        reachable only with a configured Supabase project.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg border border-border px-6 py-3 text-center transition hover:border-accent"
      >
        Back
      </Link>
    </main>
  );
}
