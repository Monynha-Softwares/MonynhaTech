-- Add tsvector search columns for full-text search
alter table public.blog_posts
  add column if not exists search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title_pt,'') || ' ' || coalesce(title_en,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(content_pt,'') || ' ' || coalesce(content_en,'')), 'B')
  ) stored;
create index if not exists idx_blog_posts_search_vector on public.blog_posts using GIN (search_vector);

alter table public.projects
  add column if not exists search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(name_pt,'') || ' ' || coalesce(name_en,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description_pt,'') || ' ' || coalesce(description_en,'')), 'B')
  ) stored;
create index if not exists idx_projects_search_vector on public.projects using GIN (search_vector);

alter table public.docs
  add column if not exists search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title_pt,'') || ' ' || coalesce(title_en,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(content_pt,'') || ' ' || coalesce(content_en,'')), 'B')
  ) stored;
create index if not exists idx_docs_search_vector on public.docs using GIN (search_vector);
