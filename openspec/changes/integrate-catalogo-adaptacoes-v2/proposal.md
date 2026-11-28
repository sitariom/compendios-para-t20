# Proposal: Catálogo de Adaptações T20, Organização Hierárquica de Compêndios e Validação Dual (DataModel + Playwright)

## Contexto e Motivação
O projeto `compendios-para-t20` possui hoje **6.055+ documentos** distribuídos em 6 packs monolíticos (`Ameacas_T20`, `Itens_T20`, `Macros_T20`, `Tabelas_T20`, `Diarios_T20`, `Playlist_T20`), sendo a grande maioria oriunda de publicações processadas manualmente no passado (acervo legado) e um conjunto crescente de edições automatizadas pelo agente (`Dragão Brasil #226–#232` e `Revista Tormenta 20 / Fúlgor dos Deuses #25–#28`), além de dezenas de edições futuras aguardando processamento (`RT20-29..32`, `RT20-21..24`, `DB_Acervo_Completo`, livros e suplementos).

Para escalar sem perder rastreabilidade, fidelidade ao PDF ou compatibilidade real no Foundry VTT v13/v14, é necessário integrar formalmente o **Prompt Mestre — Catálogo de Adaptações T20 → Foundry VTT (v2)** às diretrizes permanentes do projeto e evoluir a arquitetura em três pilares:
1. **Catálogo Cumulativo & Rastreabilidade Total (`catalogo/`)**: manifesto central (`catalogo.json`, `artefatos.json`, `CATALOGO.md`, `auditoria.jsonl`) e pastas por material (`materiais/<ID>/` com `extracao.json`, `mapa_pdf_artefatos.json`, `validacao.md`, `pendencias.md`), cobrindo **retroativamente** todo o acervo legado manual existente hoje e todas as edições processadas/a processar.
2. **Organização Hierárquica no Foundry VTT (`packFolders` + Compêndios por Subtipo)**:
   - Revistas com campanha: `Publicação -> Campanha -> Edição -> Compêndios` (ex.: `Revista Tormenta 20 -> Fúlgor dos Deuses -> Edição 28: Aço e Arcano -> Ameaças / Equipamentos / Poderes / ... / Diários / Tabelas / Macros`).
   - Revistas sem campanha: `Publicação -> Edição -> Compêndios` (ex.: `Dragão Brasil -> Edição 231 -> ...`).
   - Livros / Publicações individuais: `Publicação -> Capítulo / Sessão / Aventura -> Compêndios`.
   - **Preservação do Legado Manual**: todo conteúdo pré-existente criado manualmente permanece intacto nos packs legados sob a pasta `Acervo Geral / Legado (Pré-Catálogo)`, sendo catalogado retroativamente e migrado apenas conforme cada publicação for formalmente incluída/reprocessada.
   - **Migração Estruturada do Conteúdo Gerado pelo Agente**: as edições já processadas (`DB #226–#232` e `Fúlgor #25–#28`) recebem plano e script determinístico de migração para a nova hierarquia com reescrita automática de `@UUID[...]`.
3. **Validação Dual Obrigatória**:
   - **Por Artefato (Loop Micro 1-por-1)**: validação estrutural + completude campo-a-campo contra PDF + DataModels reais do `Tormenta20` (`v1.5.015` v13 e `v1.6.7` v14) + auditoria cega de 2ª passagem + escalonamento na 3ª reincidência.
   - **Por Publicação (Gate Playwright Live)**: validação em mundo real do Foundry VTT via Playwright abrindo atores e cada subtipo de item criado, verificando renderização de telas, ausência de erros de console/UI, execução de rolagens e alternância de efeitos ativos.

## Escopo e Limites
- **Inclui**:
  - Remoção de todos os caminhos legados `/home/orange/...` em scripts e configurações.
  - Integração do Prompt Mestre v2 como skill e prompt template do projeto (`.pi/skills/catalogo-t20/SKILL.md`, `.pi/prompts/catalogo.md`).
  - Criação da estrutura `catalogo/` e catalogação retroativa completa dos 6 packs atuais (separando acervo legado manual vs edições automatizadas `DB-0226..0232` e `RT20-025..028`) mais descoberta automática das fontes a processar.
  - Evolução de `scripts/audit.js` e `scripts/avrl-runner.js` para ler dinamicamente os packs declarados em `module.json`.
  - Criação do motor de catálogo 1-por-1 (`scripts/catalogo-runner.js`), do migrador hierárquico (`scripts/migrate-hierarchical-packs.js` com `--dry-run` e `--apply`) e do validador Playwright (`scripts/validate-foundry-playwright.js`).
  - Exclusão de `catalogo/`, `.pi/`, `openspec/`, `src/` e `referencias_criacao_itens_atores_t20/` do `module.zip` de release.
- **Não Inclui**:
  - Reprocessamento cego de todo o acervo legado manual (~6.000 documentos pré-existentes) sem solicitação explícita por publicação.
  - Uso de placeholders visuais genéricos (`mystery-man.svg` proibido; tokens exclusivamente 2-Minute Tabletop em `assets/tokens/*.png`).

## Critérios de Sucesso
1. `openspec validate integrate-catalogo-adaptacoes-v2` passa com 0 falhas.
2. Zero referências a `/home/orange/` permanecem nos scripts ativos.
3. `catalogo/catalogo.json`, `catalogo/artefatos.json` e `catalogo/CATALOGO.md` refletem 100% dos documentos existentes hoje nos 6 packs + arquivos descobertos em `Fullgor_dos_Deuses` e `DB_Acervo_Completo`.
4. `scripts/migrate-hierarchical-packs.js --dry-run` produz mapa determinístico sem colisões nem `@UUID` órfãos para todas as edições `DB-0226..0232` e `RT20-025..028`.
5. `npm run ci:quality` e `npx codegraph index` concluem com 0 erros.
