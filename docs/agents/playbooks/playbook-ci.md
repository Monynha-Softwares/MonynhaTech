# Playbook — CI/CD

## Pipeline padrão
- Node 20 + pnpm.
- Lint → Typecheck → Tests (unit/component/e2e) → Build → Preview.
- Bloquear merge se qualquer etapa falhar.

## Boas práticas
- Rode `./ci_test_local.sh` antes de commitar para reproduzir o pipeline localmente.
- Secrets no GitHub Actions, nunca no workflow em claro.
- Artefatos: relatórios de testes e cobertura.
- Comentários automáticos no PR com status/resumo.
