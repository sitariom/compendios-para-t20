# tables-specification Specification

## Purpose
The tables-specification capability defines the authoritative specification and quality contracts for creating and validating all RollTable documents (Treasure by ND, Random Encounters, Critical Fumbles, Weather, and Quest Generators) in the Tormenta20 system for Foundry VTT within the compendios-para-t20 repository.

## Requirements

### Requirement: RollTable Data Schema and Formula Execution
Every RollTable document in `packs/Tabelas_T20` SHALL declare a valid roll formula (`formula`, such as `1d100` or `1d20`), replacement mode (`replacement: true`), display in chat setting (`displayRoll: true`), and a non-empty array of structured results covering the full numerical range of the formula.

#### Scenario: Rolling on a d100 treasure table
- **GIVEN** a treasure table for a specific ND range in `Tabelas_T20`
- **WHEN** the table is evaluated with `formula: "1d100"`
- **THEN** every integer from 1 to 100 falls within exactly one result entry's `range`
- **AND** there are no gaps or overlapping intervals in result ranges

### Requirement: Text and Compendium Document Results
Table results SHALL support both plain text descriptions (`type: 0`) and direct document references (`type: 1` or `type: 2`) linking to items, spells, or threats in compendiums via `documentCollection` and `documentId`.

#### Scenario: Table result providing a specific magical weapon
- **GIVEN** a magical reward table entry
- **WHEN** the roll lands on that entry
- **THEN** `documentCollection` references `compendios-para-t20.Itens_T20`
- **AND** the linked document ID is verified to exist in the target compendium

### Requirement: ClassicLevel Packaging and Subdocument Results
RollTable results SHALL be stored in LevelDB either within the root document `results` array or as embedded subdocuments under `!tables.results!${tableId}.${resultId}` to preserve compatibility across Foundry VTT versions.

#### Scenario: Compiling RollTable to LevelDB
- **GIVEN** a set of table JSON files in `src/packs/Tabelas_T20`
- **WHEN** `packDirectory` runs
- **THEN** table keys are written under `!tables!${tableId}`
- **AND** all results are indexed with valid `_id` fields without JSON serialization errors

### Requirement: Dragão Brasil #230 Roll Tables Subdocument Architecture
All roll tables from Dragão Brasil #230 (*Natureza do Pesadelo*, *Ganchos do Pesadelo em Aslothia*, *Encontros da Corrida Brutal*, *Sonhos Roubados pelo Coletor*) SHALL be stored in `packs/Tabelas_T20`. Conforming to Hotfix v1.6.2, `RollTable.results` MUST strictly be an array of string IDs (`[resultId1, resultId2, ...]`), with the full result subdocument stored under `!tables.results!tableId.resultId` with `type: "text"` and `description`.

#### Scenario: RollTable results resolution
- **GIVEN** a roll table from DB #230
- **WHEN** inspected in the LevelDB pack
- **THEN** `results` contains string IDs only
- **AND** all corresponding result keys exist in LevelDB with formatted outcome text

### Requirement: Dragão Brasil #231 Canonical Roll Tables Integration
All roll tables associated with Dragão Brasil #231 (*Previsões de Selina*, *Encontros Diurnos em Halak-Tûr*, *Encontros Noturnos em Halak-Tûr*, *Ganchos de Aventura em Halak-Tûr*) SHALL be stored in `packs/Tabelas_T20` inside the canonical folder *Dragão Brasil* (`W9gqZ84k7Uv50KOP`) with strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`). Each table's `results` field MUST be an array of string IDs, with each result subdocument stored under `!tables.results!tableId.resultId`, containing `type: "text"`, non-empty `text`, non-empty `description`, and a valid `name` string field.

#### Scenario: Previsões de Selina roll table
- **GIVEN** Selina's fortune reading from Circo Sombrio
- **WHEN** the table is evaluated
- **THEN** formula is `1d6`
- **AND** results cover 1 (Nada), 2-4 (Miséria), and 5-6 (Felicidade) with mechanical consequences

#### Scenario: Halak-Tûr encounter and hook tables
- **GIVEN** tables for Halak-Tûr encounters (day/night) and adventure hooks
- **WHEN** the tables are evaluated
- **THEN** all results have populated ranges, text, and descriptions linked to the published setting
