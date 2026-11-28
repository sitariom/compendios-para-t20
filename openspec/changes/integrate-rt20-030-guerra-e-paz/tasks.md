# Tasks: Integração Canônica de Revista Tormenta 20 — Fúlgor dos Deuses #30 (Guerra e Paz)

## Fase 1 — Especificação e Ativos Visuais
- [x] 1.1 Extrair integralmente `RT20-30.pdf` (22 páginas) em `catalogo/materiais/RT20-030/extracao.json` e mapear NPCs, ameaças, perigos complexos, parceiros, favores, estilhas, diário, tabelas e macro.
- [x] 1.2 Baixar e validar tokens PNG RGBA transparentes de 2-Minute Tabletop (`elanor-lumen-velho.png`, `daliria-de-marah.png`, `devoto-marah-fullgori.png`, `coral-branco.png`) e selecionar ícones verificados de `valid-system-icons.json`.
- [x] 1.3 Validar `openspec validate integrate-rt20-030-guerra-e-paz` e atualizar a especificação canônica `openspec/specs/fulgor-dos-deuses-campaign/spec.md`.

## Fase 2 — Infraestrutura Hierárquica & Injeção Canônica
- [x] 2.1 Registrar `RT20-030` em `scripts/catalogo-init.js` (`EDITION_METADATA`), `scripts/create-entry.js` (`EQUIPMENT_CATALOG`: `manto eclesiastico`), `scripts/avrl-runner.js` (`MONITORED_CDS`, `MONITORED_EQUIPAMENTOS`, `STRICT_ACTOR_IDS`) e declarar os packs hierárquicos `rt20-030-*` e `packFolders` (`Edição 30 — Guerra e Paz`) em `module.json`.
- [x] 2.2 Criar `scripts/inject-fullgor30.js` gerando todos os documentos diretamente em `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-30/rt20-030-*` com subdocumentos ClassicLevel estritos e zero placeholders.

## Fase 3 — Auditoria, Fidelidade e Loop Catálogo v2
- [x] 3.1 Criar `scripts/validate-fullgor30-compliance.js`, registrar `validate:fullgor30` em `package.json` (`validate:all`), e atualizar `scripts/validate-threat-sheet-fidelity.js` com os atores de `RT20-030`.
- [x] 3.2 Executar `npm run ci:quality`, `npm run catalogo:init`, `node scripts/catalogo-extract.js --material RT20-030`, `node scripts/catalogo-runner.js --material RT20-030 --blind-audit` e `npx codegraph index` com 0 erros e rastreabilidade PDF 100%.

## Fase 4 — Validação Playwright / Consolidação
- [ ] 4.1 Validar atualização e renderização via Playwright quando aplicável e sincronizar `catalogo/CATALOGO.md`.
