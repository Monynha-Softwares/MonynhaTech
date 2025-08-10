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

create or replace trigger trg_comments_updated
  before update on public.comments
  for each row execute function public.update_updated_at_column();

create policy "Read approved comments"
  on public.comments for select
  using (approved = true);

create policy "Anon can insert comment"
  on public.comments for insert
  to anon
  with check (true);

create policy "Authenticated can update comment"
  on public.comments for update
  to authenticated
  using (true)
  with check (true);
