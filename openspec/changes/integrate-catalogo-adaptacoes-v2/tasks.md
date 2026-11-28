# Tasks: Integração do Catálogo v2, Hierarquia de Compêndios e Validação Playwright

## Fase 1 — Governança, Limpeza e Empacotamento
- [x] 1.1 Remover todas as ocorrências residuais de `/home/orange/...` em `scripts/extract-db.py` e `scripts/icon-resolver.js` (substituir por env/caminhos Windows/relativos).
- [x] 1.2 Criar `.pi/skills/catalogo-t20/SKILL.md` e `.pi/prompts/catalogo.md` incorporando integralmente o Prompt Mestre v2, a hierarquia de compêndios e o gate Playwright.
- [x] 1.3 Atualizar `package.json` (`zip` + scripts `catalogo:*` e `validate:playwright`) e `.github/workflows/main.yml` para excluir `catalogo/*`, `.pi/*`, `openspec/*`, `src/*` e `referencias_criacao_itens_atores_t20/*` do `module.zip`.

## Fase 2 — Infraestrutura `catalogo/` e Catalogação Retroativa
- [x] 2.1 Criar `scripts/catalogo-init.js` para varrer os 6 packs atuais, os diretórios de fontes (`Fullgor_dos_Deuses`, `DB_Acervo_Completo`, `dragao_brasil/Edicoes_Completas`) e os scripts `inject-*`/`rebuild-*`.
- [x] 2.2 Gerar `catalogo/catalogo.json`, `catalogo/artefatos.json`, `catalogo/CATALOGO.md`, `catalogo/auditoria.jsonl` e `catalogo/materiais/<ID>/` catalogando retroativamente todo o acervo legado manual (`LEGADO_MANUAL`), as edições já criadas (`DB-0226..0232`, `RT20-025..028` como `PROCESSADO_VALIDACAO_PENDENTE`) e os PDFs pendentes (`REGISTRADO`).

## Fase 3 — Motor AVRL 1-por-1, DataModels Dinâmicos e Validador Playwright
- [x] 3.1 Atualizar `scripts/audit.js` e `scripts/avrl-runner.js` para descobrir packs dinamicamente a partir de `module.json` (além dos 6 packs base) e continuar validando 100% da integridade LevelDB v13+v14.
- [x] 3.2 Criar `scripts/catalogo-runner.js` implementando loop micro 1-por-1, validação contra DataModels reais de `Tormenta20` (`v1.5.015` e `v1.6.7`), auditoria cega, escalonamento 3x e gatilhos de reentrada.
- [x] 3.3 Criar `scripts/validate-foundry-playwright.js` para validação visual e funcional em mundo real do Foundry VTT (telas, rolagens, ActiveEffects, tabelas e macros) com captura de evidências.

## Fase 4 — Estruturação e Execução da Migração Hierárquica
- [x] 4.1 Criar `scripts/migrate-hierarchical-packs.js` com suporte a `--dry-run` (gera `catalogo/plano-migracao.json` + mapa de reescrita `@UUID`) e `--apply` (cria packs hierárquicos `Publicação -> [Campanha ->] Edição -> Compêndios por subtipo`, atualiza `module.json` `packFolders` e `packs`, reescreve `@UUID` e remove duplicatas dos packs legados).
- [x] 4.2 Executar `npm run catalogo:migrate:dry` e validar 0 colisões, 0 `@UUID` quebrados e 100% de preservação do acervo legado manual.

## Fase 5 — Verificação Final e Sincronização
- [x] 5.1 Executar `openspec validate integrate-catalogo-adaptacoes-v2`, `npm run catalogo:init`, `npm run catalogo:migrate:dry`, `npm run ci:quality` e `npx codegraph index`.
- [ ] 5.2 Registrar decisões e estado no Engram e Mnemosyne; após aprovação/conexão ao mundo Foundry, executar `--apply` da migração, auditoria cega do baseline e validação Playwright por publicação.
