# Playbook — Testes

- Use `./ci_test_local.sh` para executar lint, typecheck e todos os testes localmente.

## Unit / Component
- Vitest + Testing Library.
- Cobrir lógica crítica (service, hooks) e componentes com interações.

Exemplos:
```bash
pnpm test
pnpm test:watch
```

## E2E (Playwright)
- Fluxo feliz e 1 cenário de erro por feature.
- Rodar em CI com browser headless.

Exemplos:
```bash
pnpm test:e2e
```
