---
description: Executa ou retoma o Catálogo de Adaptações T20 → Foundry VTT (v2) com loop 1-por-1, DataModels reais e gate Playwright
---

Ative a skill `.pi/skills/catalogo-t20/SKILL.md` e execute o fluxo completo do **Catálogo de Adaptações T20 → Foundry VTT (v2)**:

1. Ler `catalogo/catalogo.json`, `openspec/specs/catalogo-adaptacoes/spec.md` (ou change ativa) e consultar Engram/Hindsight/Mnemosyne.
2. Varrer fontes configuradas (`Fullgor_dos_Deuses`, `DB_Acervo_Completo`, `dragao_brasil/Edicoes_Completas` e entradas do lote) via `npm run catalogo:init`.
3. Auditar pendências e processar **1 artefato por vez** via `scripts/catalogo-runner.js`, aplicando validação nos DataModels reais do `Tormenta20` (`v1.5.015` v13 e `v1.6.7` v14), auditoria cega de 2ª passagem e log append-only em `catalogo/auditoria.jsonl`.
4. Ao fechar a publicação, rodar `npm run ci:quality` e a validação visual/funcional em mundo real do Foundry via `scripts/validate-foundry-playwright.js`.
5. Atualizar `catalogo/CATALOGO.md`, sincronizar `codegraph index` e emitir o relatório da §13 com métricas do loop e auditoria cega.

Lote / Comando fornecido: $@
