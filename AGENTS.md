# AGENTS.md — Monynha Softwares

Guia oficial e padronizado para agentes (humanos e automáticos) trabalharem de forma consistente nos repositórios Monynha.
Público‑alvo: agentes Codex e Condex sem contexto prévio do projeto.

## 1) Escopo & Stack
- Frontend: React/Next.js 14 (App Router), Tailwind + shadcn/ui, i18n (PT/EN).
- Backend/Dados: Supabase (Postgres + RLS), Edge Functions.
- Ferramentas: pnpm, Turborepo (quando aplicável), Vitest + Testing Library, Playwright, ESLint/Prettier.
- Deploy/CI: Vercel + GitHub Actions (lint → test → build → preview).

## 2) Segredos e Variáveis
- **Nunca** commitar segredos. Use `.env.local` (gitignored) ou Secrets do CI.
- Variáveis esperadas:
  - `DATABASE_URL` (Postgres/Supabase, já existente no ambiente)
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY` (uso no cliente)
  - `SUPABASE_SERVICE_KEY` (**somente** em server/CI; já existente no ambiente)
  - Opcionais: `SITE_URL`, `SENTRY_DSN`, `VERCEL_ANALYTICS_TOKEN`
- Regra de ouro: **service key nunca no cliente**. Operações com privilégio → API server/Edge/CI.

## 3) Setup Rápido
1. `pnpm i`
2. Copie `.env.agents.example` para `.env.local` e preencha os valores locais (sem service key no browser).
3. `pnpm dev` (ou `pnpm build && pnpm start`).
4. Se houver Supabase local: `supabase start` e aplique migrations `pnpm db:migrate` (ou `supabase db reset`).

## 4) Fluxo de Trabalho (DoR → Execução → DoD)
**Definition of Ready (DoR)**
- Objetivo claro, escopo delimitado, riscos conhecidos, dados necessários definidos, estratégia de teste prevista.

**Execução**
- Branch: `feat/<slug>`, `fix/<slug>`, `chore/<slug>` (Conventional Commits).
- Commits atômicos e descritivos.
- Código acessível (WCAG AA): foco visível, semântica, `alt`/labels, contraste, navegação por teclado.
- i18n obrigatório: usar helper de tradução do projeto (ex.: `t('pt', 'en')`) e fallback.
- Dados: se criar tabela → **ativar RLS** e escrever **policies** (ver seção 6).
- Logs: mensagens úteis (sem PII).

**Definition of Done (DoD)**
- Cobertura mínima da área tocada (unit + component + E2E).
- Builds e testes verdes no CI.
- Orçamento de desempenho não violado (ex.: LCP ≤ 2.5s; bundle sem código morto).
- Documentação atualizada (README/Docs/CHANGELOG).
- Checklist de entrega (seção 9) marcado.

## 5) Testes (Obrigatório)
- **Unit**: Vitest para funções/serviços/lógica.
- **Component**: React Testing Library para UI.
- **E2E**: Playwright cobrindo o caminho feliz + 1 cenário de erro.
- Comandos sugeridos:
  - `pnpm test` (unit/component)
  - `pnpm test:e2e` (e2e)
  - `pnpm test:watch` durante o desenvolvimento

## 6) Banco de Dados (Migrations + RLS)
- Cada mudança de schema deve vir em **migration versionada**.
- RLS ativado por padrão; políticas explícitas:
  - Conteúdo público (posts/docs): `SELECT` liberado ao `anon`; `INSERT/UPDATE/DELETE` negados.
  - Conteúdo sensível (ex.: perfis): sem leitura pública.
  - Entrada pública (ex.: formulário/feedback): preferir **endpoint server-side** com `service key`.
- Exemplo (SQL):
  ```sql
  create table public.comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references public.blog_posts(id) on delete cascade,
    name text not null,
    email text,
    content text not null,
    approved boolean default false,
    created_at timestamptz default now()
  );
  alter table public.comments enable row level security;
  create policy "Read approved"
    on public.comments for select using (approved = true);
  -- inserts públicos (se necessário)
  create policy "Anon can insert comment"
    on public.comments for insert with check (true);
  ```

## 7) Frontend (i18n, A11y, Performance)
- i18n: todo texto exibido deve ter PT e EN; evitar strings hardcoded.
- A11y: usar componentes acessíveis (Radix/shadcn); `aria-*` quando fizer sentido; `alt`/`title` adequados.
- Performance: imagens otimizadas, lazy, prefetch prudente, evitar re-render desnecessário.

## 8) CI/CD
- Verificações mínimas em PR: lint → typecheck → tests → build.
- Pré-visualização automática (deploy preview).
- Não expor segredos nos logs do CI.

## 9) Checklist de Entrega (colar no PR)
- [ ] Funcionalidade concluída e manual de teste incluído
- [ ] Testes: unit + component + e2e (verde)
- [ ] Migrations aplicáveis + RLS/Policies revisadas
- [ ] i18n cobrindo PT/EN (fallback ok)
- [ ] A11y básica (sem erros axe/lighthouse críticos)
- [ ] Desempenho dentro do budget
- [ ] Docs/README/CHANGELOG atualizados
- [ ] Sem segredos vazando; service key apenas server/CI
- [ ] Capturas de tela ou vídeo curto (quando visual)

## 10) Padrões de Código
- ESLint/Prettier, imports ordenados, componentes puros quando possível.
- Nomes descritivos para arquivos, funções e migrações.
- Evitar duplicação; extrair utilitários em `src/lib`.
