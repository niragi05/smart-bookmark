-- Create the bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- RLS policies: each user can only access their own bookmarks
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Send full row data on delete (required for Realtime DELETE filtering)
alter table public.bookmarks replica identity full;

-- Enable Realtime for the bookmarks table
alter publication supabase_realtime add table public.bookmarks;
