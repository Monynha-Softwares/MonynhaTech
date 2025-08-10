# SECURITY_FOR_AGENTS.md

## Princípios
- Menor privilégio sempre.
- Service keys **nunca** expostas ao cliente.
- Sem PII em logs/telemetria; sanitize mensagens de erro.

## Segredos
- Use `.env.local` (gitignored) em dev; Secrets no CI.
- Rotacione chaves comprometidas; não recicle tokens.
- Valide origem de dados de entrada (rate limit/captcha quando público).

## Banco de Dados
- RLS obrigatório em tabelas novas.
- Policies explícitas de `SELECT/INSERT/UPDATE/DELETE`.
- Operações privilegiadas apenas via server/Edge/CI.

## Code Review
- Conferir que nenhum segredo foi incluído.
- Checar logs/telemetria e mensagens de erro.
- Aprovar somente com testes e migrações verdes.
