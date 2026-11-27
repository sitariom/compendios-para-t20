# Delta for fulgor-dos-deuses-campaign

## ADDED Requirements

### Requirement: Canonical Threat Actors of Fúlgor dos Deuses Edition 28
All threats from Edition 28 (Aço e Arcano) SHALL be stored in `packs/Ameacas_T20` inside folder `Fullgor dos Deuses` (`n591wfGB7keSNe7I`). Each threat MUST possess strictly 16-character alphanumeric primary IDs, 34 skills under `system.pericias` with `.value = fichaVal` and difference in `outros`, dynamic defense base (`base + des === value`), official statblock CD (`Liriavel`: 26, `Rashid`: 30), verbatim resistance text in `system.detalhes.resistencias`, atomic abilities, 4 individual spell items for Rashid with valid `rolls[]`, and exclusive 2-Minute Tabletop transparent tokens sized to grid (`2x2` for Large creatures).

#### Scenario: Liriavel, Forma de Quimera schema validation
- **GIVEN** the NPC Liriavel, Forma de Quimera published in RT20 #28 (ND 8)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `gra` (`2x2`), role is `solo`, ND is `8`
- **AND** defense is 33 with base 30 and Des 3
- **AND** PV is 333, movement includes walk 9m and fly 12m, and official CD is 26
- **AND** natural attacks (Duas Mordidas, Marrada, Duas Garras) and dragon breath (`Cabeça de Dragão` 10d6+20 fogo) contain structured `rolls[]`
- **AND** token references `modules/compendios-para-t20/assets/tokens/liriavel-forma-de-quimera.png`

#### Scenario: Rashid, Fullgori schema validation
- **GIVEN** the NPC Rashid, Fullgori published in RT20 #28 (ND 7)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `gra` (`2x2`), role is `solo`, ND is `7`
- **AND** defense is 34 with base 33 and Des 1
- **AND** PV is 280, PM is 57, movement includes walk 9m, burrow 9m, and fly 12m, and official CD is 30
- **AND** traits include damage reduction 10, immunity to acid and enchantment, and fullgori immunities
- **AND** powers include Teofagia, Imunidades Fullgori, Criatura do Fullgor, Contramágica Aprimorada, Magia Acelerada, and Zelador da Academia Arcana
- **AND** Rashid possesses 4 individual spell items of type `magia` (*Amarras Etéreas*, *Controlar Terra*, *Dissipar Magia*, *Jato Corrosivo*) with canonical enums and `rolls[]`
- **AND** token references `modules/compendios-para-t20/assets/tokens/rashid-fullgori.png`

### Requirement: Edition 28 Partners, Artifacts, and Quest Items
The compendium `packs/Itens_T20` SHALL contain all companions, quest items, and divine rewards introduced in Edition 28 inside folder `Fullgor dos Deuses` (`fldItensFolder26`): `Parceiro: Liriavel Cintilara` (Ajudante Mestre with `BaseEffect` granting +4 to Conhecimento, Diplomacia, and Misticismo), `Parceiro: Suporte Arcano da Academia (Vladislav Tpish)`, `Chave Antiga do Portal da Academia Arcana`, `Matrícula Forjada da Academia Arcana`, `Gema do Renascimento de Rashid (Bênção de Wynna)`, and `Desejo de Wynna`.

#### Scenario: Liriavel Cintilara partner schema validation
- **GIVEN** the special partner Liriavel Cintilara in `Itens_T20`
- **WHEN** the item document is validated
- **THEN** type is `poder`, `system.tipo` is `geral`, and `system.subtipo` is `parceiro`
- **AND** an ActiveEffect following `BaseEffect` grants +4 to `conh`, `dipl`, and `mist`

### Requirement: Adventure Journal, Roll Tables, and Urgency Macro for Edition 28
The compendium `packs/Diarios_T20` SHALL contain *Fúlgor dos Deuses — Edição 28: Aço e Arcano* (7 pages under `!journal.pages!`, `ownership.default: -1`). `packs/Tabelas_T20` SHALL contain 3 tables (*Ruas que Respiram — Eventos Aleatórios*, *Frases de Combate de Rashid Fullgori*, *Frases de Combate no Templo do Saber*) with 16-char result IDs under `!tables.results!`. `packs/Macros_T20` SHALL contain *Rastreador de Urgência & Eventos do Campus (Edição 28)*.

#### Scenario: Validating Edition 28 journal, tables, and macro
- **GIVEN** the Edition 28 narrative and utility documents across `Diarios_T20`, `Tabelas_T20`, and `Macros_T20`
- **WHEN** `npm run validate:fullgor28` executes
- **THEN** the journal has 7 valid 16-char pages, all 3 tables have 6, 10, and 8 valid 16-char results respectively, and the macro is a valid `script` macro
