# Spec Delta: journals-specification

## ADDED Requirements

### Requirement: Dragão Brasil #231 Canonical Journal Integration
All journals from Dragão Brasil #231 (*A Vastidão Dourada de Halak-Tûr*, *Aventura: Circo Sombrio*, *Gazeta do Reinado — Edição 163*) SHALL be stored in `packs/Diarios_T20` inside the canonical folder *Dragão Brasil* (`Wk4e0z6eXGf3uY6c`) with strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`). Each journal's `pages` field MUST be an array of string IDs, with each page stored under `!journal.pages!journalId.pageId`, having `type: "text"`, `ownership: { default: -1 }`, and rich semantic HTML formatting.

#### Scenario: Halak-Tûr comprehensive setting journal
- **GIVEN** the lore and geography of Halak-Tûr
- **WHEN** the journal entry is validated
- **THEN** it contains at least 7 detailed pages covering introduction, peoples (Ferani, Dai-Kerat, Kuans), religion (Azgher, Sszzaas, Tanna-Toh), interest points (Solário de Cette, Gruta da Perdição), and desert threats

#### Scenario: Circo Sombrio adventure journal
- **GIVEN** the Breves Jornadas: Circo Sombrio adventure
- **WHEN** the journal entry is validated
- **THEN** it contains at least 6 structured pages covering summary, Cenas 1 to 4, attractions, and epilogue

#### Scenario: Gazeta do Reinado Edição 163 journal
- **GIVEN** the chronicles in Gazeta do Reinado #163
- **WHEN** the journal entry is validated
- **THEN** it contains at least 2 pages detailing the fall of Keenn and the Tarvica senatorial contests
