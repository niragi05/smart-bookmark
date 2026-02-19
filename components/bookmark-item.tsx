"use client";

import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";
import { useState } from "react";

type BookmarkItemProps = {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onBroadcastDelete: (id: string) => void;
};

export function BookmarkItem({ bookmark, onDelete, onBroadcastDelete }: BookmarkItemProps) {
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmark.id);

    if (error) {
      setDeleting(false);
      return;
    }

    onDelete(bookmark.id);
    onBroadcastDelete(bookmark.id);
  }

  const displayUrl = (() => {
    try {
      return new URL(bookmark.url).hostname.replace("www.", "");
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <div
      className={`group flex items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-all hover:shadow-sm ${
        deleting ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
        >
          {bookmark.title}
        </a>
        <p className="mt-0.5 truncate text-sm text-[var(--color-text-muted)]">
          {displayUrl}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete bookmark"
        className="shrink-0 rounded-md p-2 text-[var(--color-text-muted)] transition-all hover:bg-red-50 hover:text-[var(--color-danger)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:hover:bg-red-950/30"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
