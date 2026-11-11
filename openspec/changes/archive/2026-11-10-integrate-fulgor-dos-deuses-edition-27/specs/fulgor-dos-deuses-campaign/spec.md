# fulgor-dos-deuses-campaign Specification

## ADDED Requirements

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
