# Spec Delta: tables-specification

## ADDED Requirements

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
