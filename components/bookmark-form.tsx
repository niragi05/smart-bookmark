"use client";

import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";
import { useState, type FormEvent } from "react";

type BookmarkFormProps = {
  userId: string;
  onAdd: (bookmark: Bookmark) => void;
  onBroadcastAdd: (bookmark: Bookmark) => void;
};

export function BookmarkForm({ userId, onAdd, onBroadcastAdd }: BookmarkFormProps) {
  const supabase = createClient();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    if (!trimmedUrl || !trimmedTitle) {
      setError("Both URL and title are required.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com).");
      return;
    }

    setLoading(true);
    const { data, error: insertError } = await supabase
      .from("bookmarks")
      .insert({ url: trimmedUrl, title: trimmedTitle, user_id: userId })
      .select()
      .single();

    setLoading(false);

    if (insertError || !data) {
      console.error("Supabase insert error:", insertError);
      setError(`Failed to save bookmark: ${insertError?.message ?? "Unknown error"}`);
      return;
    }

    const bookmark = data as Bookmark;
    onAdd(bookmark);
    onBroadcastAdd(bookmark);
    setUrl("");
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)]"
        />
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-[2] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-[var(--color-danger)]">{error}</p>
      )}
    </form>
  );
}
