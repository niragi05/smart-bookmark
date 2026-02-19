import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthButton } from "@/components/auth-button";
import { Logo } from "@/components/logo";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <Logo size={64} />
          <h1 className="text-4xl font-bold tracking-tight">
            Smart Bookmark
          </h1>
          <p className="max-w-md text-lg text-[var(--color-text-muted)]">
            Save, organize, and access your bookmarks from anywhere.
            Real-time sync across all your devices.
          </p>
        </div>
        <AuthButton mode="sign-in" />
      </div>
    </main>
  );
}
