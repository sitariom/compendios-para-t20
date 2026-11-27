# catalogo-adaptacoes Specification (Delta / New)

## Purpose
Define o contrato normativo do Catálogo Cumulativo de Adaptações T20 → Foundry VTT (`catalogo/`), sua taxonomia hierárquica de publicações, o inventário retroativo do acervo manual legado, os estados de ciclo de vida e as regras de escalonamento e reentrada.

## ADDED Requirements

### Requirement: Cumulative Adaptation Catalog and Source Tracking
O repositório SHALL manter em `catalogo/` a fonte de verdade de todas as publicações e artefatos (`catalogo.json`, `artefatos.json`, `CATALOGO.md`, `auditoria.jsonl` e `materiais/<ID>/`). Todo material descoberto nas fontes indexadas MUST ser registrado com seu identificador canônico e hash SHA-256 dos arquivos de origem.

#### Scenario: Indexing existing and newly discovered source materials
- **GIVEN** source directories containing processed and unprocessed Tormenta20 PDFs
- **WHEN** `npm run catalogo:init` (ou varredura de catálogo) executes
- **THEN** `catalogo/catalogo.json` records every processed edition with its SHA-256 hash and every unprocessed file as `REGISTRADO`
- **AND** `catalogo/CATALOGO.md` renders the up-to-date summary table per series and edition

### Requirement: Retroactive Inventory of Legacy Manual Content
Todo documento existente nos 6 packs originais (`Ameacas_T20`, `Itens_T20`, `Macros_T20`, `Tabelas_T20`, `Diarios_T20`, `Playlist_T20`) proveniente de adaptações manuais anteriores ao catálogo SHALL ser catalogado retroativamente em `catalogo/artefatos.json` agrupado por sua publicação/pasta de origem com status `LEGADO_MANUAL`, sem ser alterado, duplicado ou movido até que sua publicação seja explicitamente incluída em lote de reprocessamento.

#### Scenario: Preserving manual legacy items while cataloging them
- **GIVEN** pre-existing manual threats and items in folders such as `Ameaças de Arton`, `Coração de Rubi`, or legacy `Dragão Brasil`
- **WHEN** the retroactive catalog scan runs
- **THEN** every legacy document is inventoried in `catalogo/artefatos.json` with `origem_tipo: "LEGADO_MANUAL"` and its current pack and UUID
- **AND** its binary LevelDB record in the legacy pack remains untouched

### Requirement: Hierarchical Publication Taxonomy
Toda adaptação catalogada SHALL seguir a taxonomia: revistas com campanha (`Publicação -> Campanha -> Edição -> Compêndios`), revistas sem campanha (`Publicação -> Edição -> Compêndios`), e publicações individuais ou livros (`Publicação -> Capítulo/Sessão/Aventura -> Compêndios`). Compêndios de `Item` SHALL ser segregados por subtipo ao lado de `ameacas`, `diarios`, `tabelas`, `macros` e `playlists`, instanciando apenas packs não vazios.

#### Scenario: Mapping an edition with threats, powers, equipment, and journal
- **GIVEN** an edition such as `RT20-028` containing `npc`/`hazard`, `equipamento`, `poder`, `JournalEntry`, `RollTable`, and `Macro` documents
- **WHEN** the hierarchical pack plan is generated
- **THEN** the target path places them under `Revista Tormenta 20` / `Fúlgor dos Deuses` / `Edição 28 — Aço e Arcano`
- **AND** separates `equipamento` (`rt20-028-equipamentos`) from `poder` (`rt20-028-poderes`) without creating empty packs for absent subtypes

### Requirement: Migration Plan for Agent-Created Editions (`DB #226–#232` and `RT20 #25–#28`)
Todas as entidades criadas pelas rotinas automatizadas de `Dragão Brasil #226–#232` e `Fúlgor dos Deuses #25–#28` SHALL possuir um plano determinístico de migração (`scripts/migrate-hierarchical-packs.js`) capaz de rodar em modo `--dry-run` (gerando `catalogo/plano-migracao.json` sem mutação) e `--apply` (migrando documentos para os packs hierárquicos, atualizando `module.json`, reescrevendo 100% dos `@UUID[...]` referenciados e removendo cópias dos packs legados).

#### Scenario: Dry-run verification of migration plan
- **GIVEN** created documents for `DB #226–#232` and `Fúlgor #25–#28` currently stored in the 6 core packs
- **WHEN** `node scripts/migrate-hierarchical-packs.js --dry-run` runs
- **THEN** `catalogo/plano-migracao.json` maps every created document ID to its exact target hierarchical pack and new UUID
- **AND** verifies zero ID collisions and zero unresolved `@UUID` references before applying changes

### Requirement: Prohibition of Legacy Host Paths
Nenhum script ativo, especificação ou artefato do catálogo SHALL conter referências hardcoded a caminhos legados do ambiente anterior (`/home/orange/...`).

#### Scenario: Checking codebase for legacy paths
- **GIVEN** active automation and extraction scripts in `scripts/`
- **WHEN** the repository is scanned for `/home/orange/`
- **THEN** zero occurrences are found in active execution paths
