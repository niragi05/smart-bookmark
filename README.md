# Smart Bookmark

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Sign in with Google, save bookmarks, and see them sync instantly across tabs.

## Features

- **Google Authentication** — Sign in with your Google account (no passwords)
- **Add & Delete Bookmarks** — Save any URL with a title, remove bookmarks you no longer need
- **Real-time Sync** — Open two tabs; add a bookmark in one and it appears instantly in the other
- **Private by Default** — Each user can only see and manage their own bookmarks (enforced by Row Level Security)
- **Responsive UI** — Works on desktop and mobile with automatic light/dark mode

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Supabase** (Auth, PostgreSQL Database, Realtime)
- **Tailwind CSS v4**
- **Vercel** (deployment)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A Google Cloud OAuth 2.0 Client ID (for Google sign-in)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/smart-bookmark.git
cd smart-bookmark
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the migration in `supabase/migrations/001_bookmarks.sql`.
3. Go to **Authentication > Providers** and enable **Google**. Enter your Google Client ID and Client Secret.
4. Go to **Authentication > URL Configuration** and add your redirect URL:
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.vercel.app/auth/callback`

### 3. Configure environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase project under **Settings > API**.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com), import the repository.
3. Add the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Vercel will build and host the app automatically.
5. After deploying, add your Vercel production URL to Supabase:
   - **Authentication > URL Configuration > Redirect URLs**: add `https://your-app.vercel.app/auth/callback`

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page (sign-in)
│   ├── globals.css             # Tailwind + CSS custom properties
│   ├── auth/callback/route.ts  # OAuth code exchange
│   └── dashboard/page.tsx      # Protected bookmark dashboard
├── components/
│   ├── auth-button.tsx         # Google sign-in/out button
│   ├── bookmark-form.tsx       # Add bookmark form
│   ├── bookmark-item.tsx       # Single bookmark with delete
│   └── bookmark-list.tsx       # Real-time bookmark list
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Middleware Supabase client
│   └── types.ts                # TypeScript types
├── middleware.ts                # Auth session refresh + route protection
└── supabase/migrations/        # SQL migration files
```

## Problems Encountered & Solutions

### 1. Session not persisting across server and client components

**Problem:** Supabase auth sessions weren't being shared properly between Server Components and Client Components in Next.js App Router.

**Solution:** Used `@supabase/ssr` with three separate client factories (browser, server, middleware) that properly handle cookie-based session management. The middleware refreshes the session on every request, ensuring both server and client components have access to the current auth state.

### 2. Real-time updates not filtering by user

**Problem:** Without filtering, the Realtime subscription would receive events for all users' bookmarks, which is both a privacy concern and a performance issue.

**Solution:** Applied a `filter` parameter on the Realtime subscription (`user_id=eq.<currentUserId>`) combined with Row Level Security policies on the database. This ensures users only receive events for their own data at both the subscription and database level.

### 3. Duplicate bookmarks appearing on insert

**Problem:** When adding a bookmark, the optimistic local insert and the Realtime event could both add the same bookmark, causing duplicates.

**Solution:** The Realtime `INSERT` handler checks if a bookmark with the same ID already exists in state before prepending it. The form itself does not optimistically add to state — it relies entirely on the Realtime channel, keeping the single source of truth clean.
