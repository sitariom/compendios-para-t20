# Tasks: Integração Canônica de Revista Tormenta 20 — Fúlgor dos Deuses #31 (Pecados do Pai)

## Fase 1 — Especificação e Ativos Visuais
- [x] 1.1 Extrair integralmente `RT20-31.pdf` (22 páginas) em `catalogo/materiais/RT20-031/extracao.json`.
- [x] 1.2 Baixar tokens PNG RGBA transparentes de 2-Minute Tabletop (`isco-do-fullgor.png`, `jardineiro-dourado.png`, `lisandra-deturpada.png`, `enxame-fullgori.png`) e selecionar ícones verificados.
- [x] 1.3 Validar `openspec validate integrate-rt20-031-pecados-do-pai` e atualizar `openspec/specs/fulgor-dos-deuses-campaign/spec.md`.

## Fase 2 — Infraestrutura Hierárquica & Injeção Canônica
- [x] 2.1 Registrar `RT20-031` em `scripts/catalogo-init.js`, `scripts/avrl-runner.js`, `module.json`, `package.json` e `scripts/validate-threat-sheet-fidelity.js`.
- [x] 2.2 Criar `scripts/inject-fullgor31.js` e `scripts/validate-fullgor31-compliance.js`.

## Fase 3 — Auditoria, Fidelidade e Loop Catálogo v2
- [x] 3.1 Executar `npm run ci:quality`, `npm run catalogo:init`, `node scripts/catalogo-extract.js --material RT20-031` e `node scripts/catalogo-runner.js --material RT20-031 --blind-audit` com 0 erros e rastreabilidade PDF 100%.
