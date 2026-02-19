import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthButton } from "@/components/auth-button";
import { DashboardClient } from "@/components/dashboard-client";
import { Logo } from "@/components/logo";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-8">
      <header className="flex items-center justify-between gap-4 pb-8">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <h1 className="text-xl font-bold">Smart Bookmark</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-[var(--color-text-muted)] sm:inline">
            {user.email}
          </span>
          <AuthButton mode="sign-out" />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6">
        <DashboardClient
          initialBookmarks={bookmarks ?? []}
          userId={user.id}
        />
      </main>

      <footer className="pt-8 pb-4 text-center text-xs text-[var(--color-text-muted)]">
        <p>Smart Bookmark &mdash; Your bookmarks, synced in real-time.</p>
        <p className="mt-1">
          Developed by{" "}
          <a
            href="https://niragi-masalia.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline"
          >
            Niragi
          </a>
        </p>
      </footer>
    </div>
  );
}
