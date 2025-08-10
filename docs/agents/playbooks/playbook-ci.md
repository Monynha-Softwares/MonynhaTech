# Playbook — CI/CD

## Pipeline padrão
- Lint → Typecheck → Tests (unit/component/e2e) → Build → Preview.
- Bloquear merge se qualquer etapa falhar.

## Boas práticas
- Secrets no GitHub Actions, nunca no workflow em claro.
- Artefatos: relatórios de testes e cobertura.
- Comentários automáticos no PR com status/resumo.
