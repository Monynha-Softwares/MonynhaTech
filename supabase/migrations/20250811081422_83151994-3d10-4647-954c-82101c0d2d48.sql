-- Phase 2 — DB schema improvements, FTS, triggers, RLS, storage policies

-- 0) Prereqs: Role system for admin
create type if not exists public.app_role as enum ('admin', 'moderator', 'user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 1) Ensure unique slugs where appropriate
create unique index if not exists blog_posts_slug_uidx on public.blog_posts(slug);
create unique index if not exists projects_slug_uidx on public.projects(slug);
create unique index if not exists categories_slug_uidx on public.categories(slug);
create unique index if not exists docs_slug_uidx on public.docs(slug);

-- 2) Add missing columns for UI fields in projects (stars/users)
alter table public.projects
  add column if not exists stars integer not null default 0,
  add column if not exists users integer not null default 0;

-- 3) Comments: ensure FK to blog_posts(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'comments_post_id_fkey'
  ) THEN
    ALTER TABLE public.comments
      ADD CONSTRAINT comments_post_id_fkey
      FOREIGN KEY (post_id)
      REFERENCES public.blog_posts(id)
      ON DELETE CASCADE;
  END IF;
END$$;

-- 4) Full-text search columns + triggers + indexes
-- blog_posts
alter table public.blog_posts add column if not exists search_vector tsvector;
create or replace function public.blog_posts_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    to_tsvector('simple',
      coalesce(new.title_pt,'') || ' ' ||
      coalesce(new.title_en,'') || ' ' ||
      coalesce(new.content_pt,'') || ' ' ||
      coalesce(new.content_en,'')
    );
  return new;
end;
$$;

DROP TRIGGER IF EXISTS blog_posts_search_vector_tg on public.blog_posts;
create trigger blog_posts_search_vector_tg
before insert or update on public.blog_posts
for each row execute function public.blog_posts_search_vector();

create index if not exists blog_posts_search_idx on public.blog_posts using gin (search_vector);

-- projects
alter table public.projects add column if not exists search_vector tsvector;
create or replace function public.projects_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    to_tsvector('simple',
      coalesce(new.name_pt,'') || ' ' ||
      coalesce(new.name_en,'') || ' ' ||
      coalesce(new.description_pt,'') || ' ' ||
      coalesce(new.description_en,'')
    );
  return new;
end;
$$;

DROP TRIGGER IF EXISTS projects_search_vector_tg on public.projects;
create trigger projects_search_vector_tg
before insert or update on public.projects
for each row execute function public.projects_search_vector();

create index if not exists projects_search_idx on public.projects using gin (search_vector);

-- docs
alter table public.docs add column if not exists search_vector tsvector;
create or replace function public.docs_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    to_tsvector('simple',
      coalesce(new.title_pt,'') || ' ' ||
      coalesce(new.title_en,'') || ' ' ||
      coalesce(new.content_pt,'') || ' ' ||
      coalesce(new.content_en,'')
    );
  return new;
end;
$$;

DROP TRIGGER IF EXISTS docs_search_vector_tg on public.docs;
create trigger docs_search_vector_tg
before insert or update on public.docs
for each row execute function public.docs_search_vector();

create index if not exists docs_search_idx on public.docs using gin (search_vector);

-- 5) updated_at triggers on core tables
-- Function public.update_updated_at_column() already exists per project configuration
DROP TRIGGER IF EXISTS trig_authors_updated_at on public.authors;
create trigger trig_authors_updated_at
before update on public.authors
for each row execute function public.update_updated_at_column();

DROP TRIGGER IF EXISTS trig_blog_posts_updated_at on public.blog_posts;
create trigger trig_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.update_updated_at_column();

DROP TRIGGER IF EXISTS trig_categories_updated_at on public.categories;
create trigger trig_categories_updated_at
before update on public.categories
for each row execute function public.update_updated_at_column();

DROP TRIGGER IF EXISTS trig_docs_updated_at on public.docs;
create trigger trig_docs_updated_at
before update on public.docs
for each row execute function public.update_updated_at_column();

DROP TRIGGER IF EXISTS trig_projects_updated_at on public.projects;
create trigger trig_projects_updated_at
before update on public.projects
for each row execute function public.update_updated_at_column();

DROP TRIGGER IF EXISTS trig_comments_updated_at on public.comments;
create trigger trig_comments_updated_at
before update on public.comments
for each row execute function public.update_updated_at_column();

-- 6) RLS policies for admin CRUD on content tables
-- authors
create policy if not exists "Admins can insert authors"
  on public.authors for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update authors"
  on public.authors for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete authors"
  on public.authors for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- blog_posts
create policy if not exists "Admins can insert blog posts"
  on public.blog_posts for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update blog posts"
  on public.blog_posts for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete blog posts"
  on public.blog_posts for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- categories
create policy if not exists "Admins can insert categories"
  on public.categories for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update categories"
  on public.categories for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete categories"
  on public.categories for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- docs
create policy if not exists "Admins can insert docs"
  on public.docs for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update docs"
  on public.docs for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete docs"
  on public.docs for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- projects
create policy if not exists "Admins can insert projects"
  on public.projects for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update projects"
  on public.projects for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete projects"
  on public.projects for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 7) Comments RLS refinements
-- remove overly-permissive update policy if present
DROP POLICY IF EXISTS "Authenticated can update comment" ON public.comments;

create policy if not exists "Admins can update comments"
  on public.comments for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete comments"
  on public.comments for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can view all comments"
  on public.comments for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 8) Storage policies for media bucket
create policy if not exists "Public can read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy if not exists "Authenticated can upload to media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy if not exists "Admins can update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
