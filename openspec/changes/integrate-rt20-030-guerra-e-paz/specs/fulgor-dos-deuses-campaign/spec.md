## ADDED Requirements

### Requirement: Canonical Threat Actors, NPCs, and Hazards of Fúlgor dos Deuses Edition 30
All canonical NPCs, threats, and hazards from Edition 30 (*Guerra e Paz*) SHALL be stored directly inside hierarchical pack `rt20-030-ameacas` under `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-30/rt20-030-ameacas` (`Revista Tormenta 20 -> Fúlgor dos Deuses -> Edição 30 — Guerra e Paz`). Each NPC actor MUST possess strictly 16-character alphanumeric primary IDs (`fld30*`), 34 skills under `system.pericias`, dynamic defense base (`base + des === value`), official statblock CD (`Elanor`: 28, `Dalíria`: 28, `Devoto`: 22, `Coral Branco`: 30), verbatim resistance text in `system.detalhes.resistencias`, atomic abilities, individual spell items for Dalíria, embedded physical equipment (`equipado: false`), and exclusive 2-Minute Tabletop transparent tokens (`1x1` Medium, `4x4` Colossal).

#### Scenario: Elanor Lúmen-Velho and Dalíria de Marah schema validation
- **GIVEN** the NPCs Elanor Lúmen-Velho and Dalíria de Marah published in RT20 #30 (both ND 8)
- **WHEN** the actor documents are validated
- **THEN** Elanor has defense 31 (`base 27 + Des 4`), PV 228, speed 12m, `Ataque desarmado x2 +24 (1d10+20)`, and atomic powers (`Aura de Paz`, `Integridade Corporal`, `Técnica da Mão Vazia`, `Sair do Caminho`)
- **AND** Dalíria has defense 28 (`base 25 + Des 3`), PV 214, PM 54, CD 28, atomic powers (`Aparência Inofensiva`, `Transe Dançante`), and 5 individual divine spell items (`Curar Ferimentos`, `Dissipar Magia`, `Escudo da Fé`, `Luz`, `Tranquilidade`)
- **AND** both instantiate their official physical equipment items with `equipado: false`

#### Scenario: Devoto de Marah Fullgori and Coral Branco schema validation
- **GIVEN** Devoto de Marah Fullgori (ND 6) and Coral Branco (ND 10) published in RT20 #30
- **WHEN** the actor documents are validated
- **THEN** Devoto de Marah Fullgori has defense 26 (`base 24 + Des 2`), PV 48, `Toque pacificador x2 +24` (`2d6` PM loss), and fullgori abilities (`Teofagia`, `Imunidades Fullgori`, `Aura de Desinteresse`, `Remorso Existencial`, `Toque Pacificador`)
- **AND** Coral Branco has size `col` (`4x4`), defense 33 (`base 38 + Des -5`), PV 600, speed 0m, RD 10, `maior que a morte`, fullgori immunities, `Enxame (Perda de PM)` (`2d8`), `Anular a Vontade`, `Fim da Dor`, `Paz sem Voz` (`8d6` `perda`), `Remorso Existencial`, and `Reduzir ao Nada`

#### Scenario: Edition 30 complex hazards validation
- **GIVEN** the three Edition 30 complex hazards (`Vidência de Cinzas`, `Julgamento dos Mansos`, and `O Nada em Expansão`, all ND 10)
- **WHEN** the hazard documents are inspected
- **THEN** all three use type `hazard`, ND `10`, valid 2-Minute Tabletop tokens, and verbatim success/failure rules

### Requirement: Edition 30 Partners, Sanctuary Favors, and Fullgor Spoils
Edition 30 spoils SHALL reside in `rt20-030-equipamentos` (`Estilhas Cristalinas do Fullgor (Edição 30)`), and Edition 30 partners, favors, and campaign rewards SHALL reside in `rt20-030-poderes` (`Parceiro: Elanor Lúmen-Velho`, `Parceira: Dalíria de Marah` with ActiveEffect +3 Defense/Saves, `Favor da Dama Branca`, `Favor da Donzela Deslumbrante`, and `Sentença de Valkaria`).

#### Scenario: Dalíria de Marah partner ActiveEffect schema validation
- **GIVEN** `Parceira: Dalíria de Marah (Veterana Especial)` in `rt20-030-poderes`
- **WHEN** the item document is validated
- **THEN** type is `poder`, `system.subtipo` is `parceiro`, and a `BaseEffect` ActiveEffect grants `+3` to Defense and Saving Throws (`system.attributes.defesa.bonus` and `system.modificadores.pericias.resistencia`)

### Requirement: Adventure Journal, Roll Tables, and Sanctuary Macro for Edition 30
`rt20-030-diarios` SHALL contain *Fúlgor dos Deuses — Edição 30: Guerra e Paz* (7 pages under `!journal.pages!`, `ownership.default: -1`, zero broken `@UUID` links). `rt20-030-tabelas` SHALL contain 3 tables (`Devotos Fullgori — Frases em Combate`, `Coral Branco — Frases em Combate`, and `A Presença — Eventos Espirituais de Thalgrimm`) with 10, 10, and 4 valid 16-char results under `!tables.results!`. `rt20-030-macros` SHALL contain the interactive v12–v14 macro *Rastreador: Prova das Mãos Vazias, Coral Branco & Sentença (Edição 30)*.

#### Scenario: Validating Edition 30 journal, tables, macro, and compliance
- **GIVEN** the Edition 30 documents across `rt20-030-*` hierarchical packs
- **WHEN** `npm run validate:fullgor30` executes
- **THEN** all 4 NPCs, 3 hazards, 6 items/powers, 7-page journal, 3 tables (10, 10, 4 results), and macro pass 100% of assertions with 0 errors
