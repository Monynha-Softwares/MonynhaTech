-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- Generic updated_at trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- AUTHORS
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  photo_url text,
  links jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.authors enable row level security;
create policy if not exists "Public can view authors"
  on public.authors for select using (true);
create or replace trigger trg_authors_updated
  before update on public.authors
  for each row execute function public.update_updated_at_column();

-- CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_pt text not null,
  title_en text,
  description_pt text,
  description_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy if not exists "Public can view categories"
  on public.categories for select using (true);
create or replace trigger trg_categories_updated
  before update on public.categories
  for each row execute function public.update_updated_at_column();

-- PROJECTS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_pt text not null,
  name_en text,
  description_pt text,
  description_en text,
  icon text,
  links jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy if not exists "Public can view projects"
  on public.projects for select using (true);
create or replace trigger trg_projects_updated
  before update on public.projects
  for each row execute function public.update_updated_at_column();

-- DOCS
create table if not exists public.docs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_pt text not null,
  title_en text,
  content_pt text,
  content_en text,
  parent_id uuid references public.docs(id) on delete set null,
  position integer default 0,
  project_id uuid references public.projects(id) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.docs enable row level security;
create policy if not exists "Public can view published docs"
  on public.docs for select using (published = true);
create or replace trigger trg_docs_updated
  before update on public.docs
  for each row execute function public.update_updated_at_column();

-- BLOG POSTS
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_pt text not null,
  title_en text,
  content_pt text,
  content_en text,
  author_id uuid references public.authors(id) on delete set null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_blog_posts_published_at
  on public.blog_posts (published, published_at desc);
alter table public.blog_posts enable row level security;
create policy if not exists "Public can view published blog posts"
  on public.blog_posts for select using (published = true);
create or replace trigger trg_blog_posts_updated
  before update on public.blog_posts
  for each row execute function public.update_updated_at_column();

-- BLOG POST CATEGORIES (M2M)
create table if not exists public.blog_posts_categories (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);
alter table public.blog_posts_categories enable row level security;
create policy if not exists "Public can view blog post categories"
  on public.blog_posts_categories for select using (true);

-- STORAGE: media bucket
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies for public read and authenticated write
create policy if not exists "Public read media"
  on storage.objects for select using (bucket_id = 'media');

create policy if not exists "Authenticated can upload media"
  on storage.objects for insert with check (
    bucket_id = 'media' and auth.role() = 'authenticated'
  );

create policy if not exists "Authenticated can update own media"
  on storage.objects for update using (
    bucket_id = 'media' and auth.role() = 'authenticated'
  ) with check (
    bucket_id = 'media' and auth.role() = 'authenticated'
  );