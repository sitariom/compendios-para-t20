# Spec Delta: tables-specification

## ADDED Requirements

### Requirement: Dragão Brasil #232 Canonical Roll Tables Integration
All roll tables associated with Dragão Brasil #232 (*Linhagens e Formas de Licantropia*, *Encontros com Licantropos em Arton*, *Encontros na Floresta em Monstros e Homens*, *Ganchos de Aventura com Licantropos*) SHALL be stored in `packs/Tabelas_T20` inside the canonical folder *Dragão Brasil* (`W9gqZ84k7Uv50KOP`) with strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`). Each table's `results` field MUST be an array of string IDs, with each result subdocument stored under `!tables.results!tableId.resultId`, containing `type: "text"`, non-empty `text`, non-empty `description`, and a valid `name` string field.

#### Scenario: Linhagens e Formas de Licantropia roll table
- **GIVEN** the five lycanthrope lineages from DB #232
- **WHEN** the table is evaluated
- **THEN** formula is `1d6`
- **AND** results cover Lobo, Onça, Rato, Selako, Texugo, and Linhagem Rara with mechanical properties

#### Scenario: Licantropos encounters and hooks roll tables
- **GIVEN** tables for lycanthrope encounters and adventure hooks
- **WHEN** the tables are evaluated
- **THEN** all results have populated ranges, text, and descriptions linked to the published setting
