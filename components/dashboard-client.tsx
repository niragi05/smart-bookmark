"use client";

import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";
import { BookmarkForm } from "./bookmark-form";
import { BookmarkItem } from "./bookmark-item";
import { useEffect, useState, useCallback, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

type DashboardClientProps = {
  initialBookmarks: Bookmark[];
  userId: string;
};

export function DashboardClient({ initialBookmarks, userId }: DashboardClientProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const addBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === bookmark.id)) return prev;
      return [bookmark, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const broadcastAdd = useCallback((bookmark: Bookmark) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "bookmark-added",
      payload: bookmark,
    });
  }, []);

  const broadcastDelete = useCallback((id: string) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "bookmark-deleted",
      payload: { id },
    });
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`bookmarks-sync-${userId}`, {
        config: { broadcast: { self: false } },
      })
      .on("broadcast", { event: "bookmark-added" }, ({ payload }) => {
        addBookmark(payload as Bookmark);
      })
      .on("broadcast", { event: "bookmark-deleted" }, ({ payload }) => {
        removeBookmark((payload as { id: string }).id);
      })
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [userId, addBookmark, removeBookmark]);

  return (
    <>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Add New Bookmark</h2>
        <BookmarkForm userId={userId} onAdd={addBookmark} onBroadcastAdd={broadcastAdd} />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] py-16 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3 text-[var(--color-text-muted)]"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
          <p className="text-[var(--color-text-muted)]">
            No bookmarks yet. Add one above to get started!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={removeBookmark}
              onBroadcastDelete={broadcastDelete}
            />
          ))}
        </div>
      )}
      </section>
    </>
  );
}
