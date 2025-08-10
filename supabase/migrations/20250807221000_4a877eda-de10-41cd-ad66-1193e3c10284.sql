-- COMMENTS
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.blog_posts(id) on delete cascade,
  name text not null,
  email text,
  content text not null,
  approved boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.comments enable row level security;
create policy if not exists "Public can view approved comments"
  on public.comments for select using (approved = true);
create policy if not exists "Anyone can insert comment"
  on public.comments for insert with check (true);
create policy if not exists "Authenticated can update comments"
  on public.comments for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy if not exists "Authenticated can delete comments"
  on public.comments for delete using (auth.role() = 'authenticated');
create or replace trigger trg_comments_updated
  before update on public.comments
  for each row execute function public.update_updated_at_column();
