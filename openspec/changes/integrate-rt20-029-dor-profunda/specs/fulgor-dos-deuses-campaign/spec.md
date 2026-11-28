## ADDED Requirements

### Requirement: Canonical Threat Actors and Hazards of Fúlgor dos Deuses Edition 29
All canonical threats and hazards from Edition 29 (*Dor Profunda*) SHALL be stored directly inside hierarchical pack `rt20-029-ameacas` under `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-29/rt20-029-ameacas` (`Revista Tormenta 20 -> Fúlgor dos Deuses -> Edição 29 — Dor Profunda`). Each NPC threat MUST possess strictly 16-character alphanumeric primary IDs (`fld29*`), 34 skills under `system.pericias` with `.value = fichaVal` and residual difference in `outros`, dynamic defense base (`base + des === value`), official statblock CD (`Guardião`: 24, `Namasqall`: 31), verbatim resistance text in `system.detalhes.resistencias`, atomic abilities, and exclusive 2-Minute Tabletop transparent tokens sized to grid (`3x3` for Enorme, `4x4` for Colossal).

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
Edition 29 equipment and spoils SHALL be stored in `rt20-029-equipamentos` (`Búzio da Maré Furiosa` and `Estilhas Cristalinas de Mynath`), and campaign partners SHALL be stored in `rt20-029-poderes` as items of type `poder` with `system.subtipo: "parceiro"` and structured `ActiveEffects` (`Parceira: Liriavel Cintilara (Campanha Dor Profunda)` and `Parceiro: "Thalgrimm" Sangue de Ferro (Médico Veterano)`).

#### Scenario: Liriavel Cintilara and Búzio da Maré Furiosa schema validation
- **GIVEN** Liriavel Cintilara partner in `rt20-029-poderes` and Búzio da Maré Furiosa in `rt20-029-equipamentos`
- **WHEN** the item documents are validated
- **THEN** Liriavel has `type: "poder"`, `system.subtipo: "parceiro"`, and an ActiveEffect granting +2 to `conh`, `dipl`, and `mist`
- **AND** Búzio da Maré Furiosa has `type: "equipamento"` with verbatim summoning rules (Atuação CD 15 or Fortitude CD 20, 12-hour tide cooldown)

### Requirement: Adventure Journal, Roll Tables, and Narrative Combat Macro for Edition 29
The compendium `rt20-029-diarios` SHALL contain *Fúlgor dos Deuses — Edição 29: Dor Profunda* (7 pages under `!journal.pages!`, `ownership.default: -1`, zero broken `@UUID` references). `rt20-029-tabelas` SHALL contain 3 tables (`Guardião do Lamento Abissal — Frases de Combate`, `Templo do Oceano — Ações de Arena do Guardião`, and `Mynath, o Eco Dourado — Provocações por Estágio`) with 10, 4, and 18 valid 16-char results respectively under `!tables.results!`. `rt20-029-macros` SHALL contain the interactive macro *Rastreador: Combate contra Mynath & Regras Subaquáticas (Edição 29)* compatible with Foundry v12–v14 (`DialogV2` with `Dialog` fallback).

#### Scenario: Validating Edition 29 journal, tables, macro, and compliance
- **GIVEN** the Edition 29 documents across `rt20-029-*` hierarchical packs
- **WHEN** `npm run validate:fullgor29` executes
- **THEN** the journal has 7 valid 16-char pages with resolved `@UUID` links, all 3 tables have 10, 4, and 18 valid 16-char results, and the macro is a valid `script` macro
