# fulgor-dos-deuses-campaign Specification

## Purpose
The fulgor-dos-deuses-campaign capability defines the authoritative specification and quality contracts governing all compendium documents (Actors, Items, Journals, Roll Tables, and Macros) adapted from the official Tormenta20 campaign Fúlgor dos Deuses (published in Revista Tormenta20 by Jambô Editora).

## Requirements

### Requirement: Canonical Threat Actors of Fúlgor dos Deuses Edition 26
All 6 threats from Edition 26 (Forja da Vingança) SHALL be stored in `packs/Ameacas_T20` inside the folder `Fullgor dos Deuses` (`n591wfGB7keSNe7I`). Each threat MUST possess strictly 16-character alphanumeric primary IDs, 34 skills under `system.pericias` with `.value = fichaVal` and difference in `outros`, dynamic defense base (`base + des === value`), verbatim resistance text in `system.detalhes.resistencias`, atomic abilities, individual spell items for spellcasters, and exclusive 2-Minute Tabletop transparent tokens.

#### Scenario: Asmithar Martelo-Mudo schema validation
- **GIVEN** the NPC Asmithar Martelo-Mudo published in RT20 #26 (ND 9)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `special`, ND is `9`
- **AND** defense is 32 with base 31 and Des 1
- **AND** PV is 230 and movement is walk 6m
- **AND** natural and weapon attacks contain structured `rolls.parts`
- **AND** token references a valid 2-Minute Tabletop PNG file

#### Scenario: Xellmaras, a Ladra Acorrentada schema validation
- **GIVEN** the threat Xellmaras published in RT20 #26 (ND 6)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `solo`, ND is `6`
- **AND** defense is 25 with base 19 and Des 6
- **AND** PV is 168 and movement is walk 9m
- **AND** traits include damage reduction 10, evasion, and immunities to acid and poison
- **AND** powers include Teofagia, Imunidades Fullgori, Ataque Furtivo +3d6, and Correntes Deturpadas

#### Scenario: Servos de Hyninn and Aço Selvagem schema validation
- **GIVEN** Gangue de Hyninn (ND 4), Sacerdote de Hyninn (ND 4), Tigre-de-Hyninn (ND 6) and Aço Selvagem (ND 6)
- **WHEN** actor documents are inspected
- **THEN** sizes, roles, PV, and defenses match official statblocks
- **AND** Sacerdote possesses individual spell items for Arma Espiritual, Curar Ferimentos, and Despedaçar
- **AND** all 4 threats possess Teofagia and Imunidades Fullgori
- **AND** prototype tokens utilize 2-Minute Tabletop artwork

### Requirement: Anti-Divine Sillarian Steel Items and Traits
The compendium `packs/Itens_T20` SHALL contain all special materials, qualities, and traits introduced in Edition 26 stored inside the `Fullgor dos Deuses` folder. This MUST include the special material Aço Sillariano, the 11 anti-divine qualities (Absorção, Arma, Defesa, Guarda, Impedimento, Magia, Mente, Perseguidora, Potência, Resistência, Antidevoto), the sacred artifact Alma da Bigorna, and fullgori trait powers.

#### Scenario: Sillarian steel qualities schema validation
- **GIVEN** the 11 anti-divine qualities of Aço Sillariano
- **WHEN** item documents are enumerated in `Itens_T20`
- **THEN** all 11 qualities exist as items of type `poder`
- **AND** mechanical bonuses (Defense, Saves, DR) define valid ActiveEffects
- **AND** descriptions contain the complete rules text from page 18 of RT20 #26

### Requirement: Adventure Journal Integration for Edition 26
The compendium `packs/Diarios_T20` SHALL contain the complete adventure journal *Fúlgor dos Deuses — Edição 26: Forja da Vingança* inside folder `Fullgor dos Deuses`. The journal MUST define 7 pages stored as ClassicLevel subdocuments under `!journal.pages!` with default ownership `-1`.

#### Scenario: Inspecting Edition 26 adventure journal pages
- **GIVEN** the adventure journal for Edition 26 in `Diarios_T20`
- **WHEN** subdocument pages are retrieved
- **THEN** 7 pages are present: Sinopse, Partes 1 a 4, Regras Especiais, and Bestiário
- **AND** each page is formatted with clean HTML, styled headings, and boxouts

### Requirement: Roll Tables for Edition 26 Subterranean Encounters
The compendium `packs/Tabelas_T20` SHALL contain 3 dedicated roll tables inside folder `Fullgor dos Deuses`: *Subterrâneos de Valkaria — Encontros e Boatos*, *Qualidades Antidivinas de Aço Sillariano*, and *Frases de Combate de Xellmaras*. Results MUST be stored as subdocuments under `!tables.results!` with valid weight and name fields.

#### Scenario: Rolling on Edition 26 tables
- **GIVEN** roll tables for Edition 26 in `Tabelas_T20`
- **WHEN** table documents are inspected
- **THEN** all results have numeric ranges, names, and subdocument storage
- **AND** drawing results produces appropriate encounter or rule text

### Requirement: Sillarian Steel Forging Interactive Macro
The compendium `packs/Macros_T20` SHALL include the macro *Forjar Aço Sillariano (Fúlgor dos Deuses)*. The macro MUST provide a graphical interface enabling GMs and players to select acquired anti-divine qualities based on available fullgori shards, printing a rich formatted chat card to the Tormenta20 chat log.

#### Scenario: Executing the Sillarian steel forging macro
- **GIVEN** the forging macro in `Macros_T20`
- **WHEN** the macro script is triggered
- **THEN** a Foundry dialog presents the 11 anti-divine qualities with shard costs
- **AND** confirms the selection by sending a styled summary card to the chat

### Requirement: Canonical Threat Actors of Fúlgor dos Deuses Edition 27
All 6 threats from Edition 27 (Dia e Noite) SHALL be stored in `packs/Ameacas_T20` inside folder `Fullgor dos Deuses` (`n591wfGB7keSNe7I`). Each threat MUST possess 16-character alphanumeric primary IDs, 34 skills under `system.pericias` with `.value = fichaVal` and difference in `outros`, dynamic defense base (`base + des === value`), verbatim resistance text in `system.detalhes.resistencias`, atomic abilities, individual spells for Urrash, and exclusive 2-Minute Tabletop transparent tokens.

#### Scenario: Cassiella semi-fullgori schema validation
- **GIVEN** the NPC Cassiella semi-fullgori published in RT20 #27 (ND 7)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `solo`, ND is `7`
- **AND** defense is 31 with base 30 and Des 1
- **AND** PV is 280 and movement is walk 6m
- **AND** natural and weapon attacks contain structured `rolls.parts`
- **AND** token references a valid 2-Minute Tabletop PNG file

#### Scenario: Cassiella fullgori schema validation
- **GIVEN** the threat Cassiella fullgori published in RT20 #27 (ND 8)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `solo`, ND is `8`
- **AND** defense is 33 with base 31 and Des 2
- **AND** movement includes fly 15m
- **AND** traits include damage reduction 10, immunities to fire and light, and spell resistance +5
- **AND** powers include Teofagia, Imunidades Fullgori, Asa-Escudo, and Azagaias Fullgori

#### Scenario: Trogs, Troggores and Urrash schema validation
- **GIVEN** Enxame Trog (ND 5), Troggore (ND 3), Bando Troggore (ND 5) and Urrash das Sombras Frias (ND 5)
- **WHEN** actor documents are inspected
- **THEN** sizes, roles, PV, and defenses match official statblocks
- **AND** Urrash possesses 6 individual spell items of type `magia`
- **AND** Enxame Trog size is Huge (3x3 grid) and Bando Troggore is Large (2x2 grid)
- **AND** prototype tokens utilize 2-Minute Tabletop artwork

### Requirement: Sun Relic Orbe de Azgher and Companion Traits
The compendium `packs/Itens_T20` SHALL contain all special items, companions, and relics introduced in Edition 27 stored inside folder `Fullgor dos Deuses` (`fldItensFolder26`). This MUST include the artifact Orbe de Azgher with permanent light emission and solar spellcasting, the special partner Cassiella de Baldonn, and adventure equipment.

#### Scenario: Orbe de Azgher artifact schema validation
- **GIVEN** the holy artifact Orbe de Azgher in `Itens_T20`
- **WHEN** the item document is validated
- **THEN** type is `equipamento` with artifact properties
- **AND** description defines 5th circle Light aura and solar spells
- **AND** ActiveEffect is attached to the item

#### Scenario: Cassiella de Baldonn partner schema validation
- **GIVEN** the special partner Cassiella de Baldonn in `Itens_T20`
- **WHEN** the item document is validated
- **THEN** type is `poder` with `system.subtipo: "parceiro"`
- **AND** defines an ActiveEffect granting +3 to attack rolls

### Requirement: Adventure Journal Integration for Edition 27
The compendium `packs/Diarios_T20` SHALL contain the complete adventure journal *Fúlgor dos Deuses — Edição 27: Dia e Noite* inside folder `Fullgor dos Deuses` (`fldDiariosFold26`). The journal MUST define 6 pages stored as ClassicLevel subdocuments under `!journal.pages!` with default ownership `-1`.

#### Scenario: Inspecting Edition 27 adventure journal pages
- **GIVEN** the adventure journal for Edition 27 in `Diarios_T20`
- **WHEN** subdocument pages are retrieved
- **THEN** 6 pages are present: Sinopse, Partes 1 a 4, and Bestiário
- **AND** each page is formatted with clean HTML, styled headings, and boxouts

### Requirement: Roll Tables for Edition 27 Subterranean and Azgher Dilemma
The compendium `packs/Tabelas_T20` SHALL contain 3 dedicated roll tables inside folder `Fullgor dos Deuses` (`fldTabelasFold26`): *Cavernas dos Trogs — Perigos e Ecos de Tenebra*, *Frases em Combate de Cassiella Possuída*, and *Dilema da Orbe de Azgher — Escolhas e Consequências*. Results MUST be stored as subdocuments under `!tables.results!` with valid weight and name fields.

#### Scenario: Rolling on Edition 27 tables
- **GIVEN** roll tables for Edition 27 in `Tabelas_T20`
- **WHEN** table documents are inspected
- **THEN** all results have numeric ranges, names, and subdocument storage
- **AND** drawing results produces appropriate encounter or narrative text

### Requirement: Orbe de Azgher Channeling Interactive Macro
The compendium `packs/Macros_T20` SHALL include the macro *Canalizar Orbe de Azgher (Fúlgor dos Deuses)*. The macro MUST provide an interactive interface enabling GMs and players to emanate solar light or cast granted solar spells, printing a styled summary card to the chat log.

#### Scenario: Executing the Orbe de Azgher macro
- **GIVEN** the macro in `Macros_T20`
- **WHEN** the macro script is triggered
- **THEN** a Foundry dialog presents solar spellcasting choices
- **AND** confirms the selection by sending a styled summary card to the chat

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


### Requirement: Canonical Threat Actors and Hazards of Fúlgor dos Deuses Edition 29
Threats and hazards from Edition 29 (*Dor Profunda*) SHALL reside in hierarchical pack `rt20-029-ameacas` under `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-29/rt20-029-ameacas` with 16-char `fld29*` IDs, 34 skills, dynamic defense base (`base + des === value`), atomic abilities, and exclusive 2-Minute Tabletop transparent tokens (`3x3` Enorme, `4x4` Colossal).

#### Scenario: Guardião do Lamento Abissal schema validation
- **GIVEN** the NPC Guardião do Lamento Abissal published in RT20 #29 (ND 9)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `eno` (`3x3`), role is `solo`, ND is `9`
- **AND** defense is 33 with base 30 and Des 3, PV is 560, walk speed is 6m, and swim speed is 24m
- **AND** attacks include `Mordida` (`1d8+10` perfuração + sangramento) and `Três Tentáculos` (`3x`, `1d6+10` impacto) with structured `rolls[]` and `alcance: "none"`
- **AND** atomic powers include `Agarrar Aprimorado`, `Constrição`, `Encastelar-se` (with ActiveEffect), `Fluxo Circular` (6d6 Ref CD 24), `Maior que a Morte`, and `Templo` arena elements
- **AND** token references `modules/compendios-para-t20/assets/tokens/guardiao-lamento-abissal.png`

#### Scenario: Namasqall Abandonado schema validation
- **GIVEN** the NPC Namasqall Abandonado published in RT20 #29 (ND 9)
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `col` (`4x4`), role is `solo`, ND is `9`
- **AND** defense is 37 with base 33 and Des 4, PV is 550, walk speed is 12m, and swim speed is 18m
- **AND** traits include immunity to cold, critical hits, stunned, fatigue, metabolism effects, and paralysis, plus vulnerability to fire
- **AND** attacks include `Quatro Tentáculos d’Água` (`4x`, `1d10+25` impacto) and atomic powers include `Agarrar Aprimorado`, `Constrição`, `Corpo Torrencial`, `Maremoto` (`10d6+30` Ref CD 31), and `Olho da Tempestade`
- **AND** token references `modules/compendios-para-t20/assets/tokens/namasqall-abandonado.png`

#### Scenario: Underwater travel and Temple Trials hazards
- **GIVEN** the two Edition 29 environmental hazards (`Viagem ao Fundo do Mar` ND 9 and `Portal do Templo do Oceano: Respeito das Marés` ND 9)
- **WHEN** the hazard documents are inspected
- **THEN** both use type `hazard`, ND `9`, valid 2-Minute Tabletop tokens, and verbatim rules for the 4 successes / aquatic encounters and the 3 trials eliminating `12d6` essence damage

### Requirement: Edition 29 Relics, Partners, and Spoils
Edition 29 equipment and spoils SHALL reside in `rt20-029-equipamentos` (`Búzio da Maré Furiosa` and `Estilhas Cristalinas de Mynath`), and campaign partners SHALL reside in `rt20-029-poderes` as `poder` items with `system.subtipo: "parceiro"` and `ActiveEffects`.

#### Scenario: Liriavel Cintilara and Búzio da Maré Furiosa schema validation
- **GIVEN** Liriavel Cintilara partner in `rt20-029-poderes` and Búzio da Maré Furiosa in `rt20-029-equipamentos`
- **WHEN** the item documents are validated
- **THEN** Liriavel has `type: "poder"`, `system.subtipo: "parceiro"`, and an ActiveEffect granting +2 to `conh`, `dipl`, and `mist`
- **AND** Búzio da Maré Furiosa has `type: "equipamento"` with verbatim summoning rules (Atuação CD 15 or Fortitude CD 20, 12-hour tide cooldown)

### Requirement: Adventure Journal, Roll Tables, and Narrative Combat Macro for Edition 29
Compendium `rt20-029-diarios` SHALL contain *Fúlgor dos Deuses — Edição 29: Dor Profunda* (7 pages under `!journal.pages!`, `ownership.default: -1`). `rt20-029-tabelas` SHALL contain 3 tables (10, 4, and 18 results under `!tables.results!`). `rt20-029-macros` SHALL contain the interactive v12–v14 macro *Rastreador: Combate contra Mynath & Regras Subaquáticas (Edição 29)*.

#### Scenario: Validating Edition 29 journal, tables, macro, and compliance
- **GIVEN** the Edition 29 documents across `rt20-029-*` hierarchical packs
- **WHEN** `npm run validate:fullgor29` executes
- **THEN** the journal has 7 valid 16-char pages with resolved `@UUID` links, all 3 tables have 10, 4, and 18 valid 16-char results, and the macro is a valid `script` macro
