# Playbook — Supabase: Migrations & RLS

## Passo a passo
1) Criar migration:
```bash
supabase migration new add_comments_table
```

2) Definir schema (exemplo):
```sql
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.blog_posts(id) on delete cascade,
  name text not null,
  email text,
  content text not null,
  approved boolean default false,
  created_at timestamptz default now()
);
alter table public.comments enable row level security;
create policy if not exists "Read approved"
  on public.comments for select using (approved = true);
create policy if not exists "Anon can insert"
  on public.comments for insert with check (true);
```

3) Aplicar migrations:
```bash
supabase db push   # ou pnpm db:migrate
```

4) Testar políticas (SQL rápido):
```sql
-- como anon: apenas SELECT em approved = true deve retornar dados
```
