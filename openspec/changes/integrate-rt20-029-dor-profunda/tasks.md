# Tasks: Integração Canônica de Revista Tormenta 20 — Fúlgor dos Deuses #29 (Dor Profunda)

## Fase 1 — Especificação e Ativos Visuais
- [x] 1.1 Extrair integralmente `RT20-29.pdf` (22 páginas) e mapear ameaças, perigos, parceiros, relíquia, diário, tabelas e macro.
- [x] 1.2 Baixar e validar tokens PNG RGBA transparentes de 2-Minute Tabletop (`guardiao-lamento-abissal.png`, `namasqall-abandonado.png`) e selecionar ícones verificados de `valid-system-icons.json`.
- [x] 1.3 Validar `openspec validate integrate-rt20-029-dor-profunda` e atualizar a especificação canônica `openspec/specs/fulgor-dos-deuses-campaign/spec.md`.

## Fase 2 — Infraestrutura Hierárquica & Injeção Canônica
- [x] 2.1 Registrar `RT20-029` em `scripts/catalogo-init.js` (`EDITION_METADATA`) e declarar os packs hierárquicos `rt20-029-*` e `packFolders` (`Edição 29 — Dor Profunda`) em `module.json`.
- [x] 2.2 Criar `scripts/inject-fullgor29.js` gerando todos os documentos diretamente em `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-29/rt20-029-*` com subdocumentos ClassicLevel estritos e zero placeholders.

## Fase 3 — Auditoria, Fidelidade e Loop Catálogo v2
- [x] 3.1 Criar `scripts/validate-fullgor29-compliance.js`, registrar `validate:fullgor29` em `package.json` (`validate:all`), e atualizar `scripts/validate-threat-sheet-fidelity.js` com os atores de `RT20-029`.
- [x] 3.2 Executar `npm run ci:quality`, `npm run catalogo:init`, `node scripts/catalogo-extract.js --material RT20-029`, `node scripts/catalogo-runner.js --material RT20-029 --blind-audit` e `npx codegraph index` com 0 erros e rastreabilidade PDF 100%.

## Fase 4 — Release & Validação Playwright Live
- [x] 4.1 Abrir e mergear PR na `main`, publicar nova tag de release no GitHub Actions e validar atualização + renderização completa de `RT20-029` no Foundry ao vivo via `npm run validate:playwright -- --material RT20-029`.
- [x] 4.2 Sincronizar evidências Playwright + `CATALOGO.md` + Engram/Mnemosyne via PR na `main`.
