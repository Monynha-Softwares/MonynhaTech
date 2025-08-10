# Playbook — i18n & Acessibilidade (Next/React)

## i18n
- Evite strings hardcoded. Use o helper de tradução (`t('pt','en')` ou o sistema do projeto).
- Mantenha chaves organizadas por domínio.
- Teste manual: troque idioma e percorra a UI principal.

## A11y
- `alt` descritivo em imagens informativas; `alt=""` para decorativas.
- Foco visível; navegação por teclado; `aria-label` em ícones‑botão.
- Semântica: headings H1→H2→H3, landmarks (`main`, `nav`, `footer`).
- Verificação: Lighthouse/axe-core sem erros críticos.
