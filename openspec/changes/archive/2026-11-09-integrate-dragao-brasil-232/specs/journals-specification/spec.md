# Spec Delta: journals-specification

## ADDED Requirements

### Requirement: Dragão Brasil #232 Canonical Journal Integration
All journals from Dragão Brasil #232 (*Cenário: Licantropos Artonianos*, *Aventura: Monstros e Homens*, *Gazeta do Reinado — Edição 164*) SHALL be stored in `packs/Diarios_T20` inside the canonical folder *Dragão Brasil* (`Wk4e0z6eXGf3uY6c`) with strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`). Each journal's `pages` field MUST be an array of string IDs, with each page stored under `!journal.pages!journalId.pageId`, having `type: "text"` and `ownership: { default: -1 }`.

#### Scenario: Licantropos Artonianos setting journal
- **GIVEN** the lore and rules of lycanthropy in Arton
- **WHEN** the journal entry is validated
- **THEN** it contains at least 6 detailed pages covering the curse, current lore, hybrid and beast forms, the five lineages, and controlling the transformation

#### Scenario: Monstros e Homens adventure journal
- **GIVEN** the Breves Jornadas: Monstros e Homens adventure
- **WHEN** the journal entry is validated
- **THEN** it contains at least 8 structured pages covering summary, Cenas 1 to 7, and epilogue
