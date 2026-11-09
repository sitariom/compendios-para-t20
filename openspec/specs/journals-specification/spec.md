# journals-specification Specification

## Purpose
The journals-specification capability defines the authoritative specification and quality contracts for creating and validating all Journal documents (Adventures, Supplements, Official Rules, and Campaign Guides) in `packs/Diarios_T20` for the Tormenta20 system on Foundry VTT.

## Requirements

### Requirement: JournalEntry and JournalEntryPage Architecture
Every Journal document SHALL contain one or more `pages` conforming to the Foundry VTT v10+ `JournalEntryPage` schema. Text pages MUST declare `type: "text"` and contain clean, semantic HTML content within `text.content`.

#### Scenario: Registering a multi-page adventure journal
- **GIVEN** an adventure from Dragão Brasil (e.g. Memórias das Armas in DB #227)
- **WHEN** the journal document is compiled into `Diarios_T20`
- **THEN** it contains ordered pages representing each adventure chapter
- **AND** each page has unique `_id`, valid `title`, and structured HTML text

### Requirement: Canonical Styling and Thematic Typography
Adventure and rule pages SHALL use canonical styling standards matching Tormenta20 visual aesthetics:
- Dual quote blocks: Creature speech and chronicler quotes styled in HTML `<blockquote>`.
- Information callout boxes: Sidebars and special mechanics enclosed in thematic containers.
- Tables: Responsive HTML tables with header rows (`<th>`) and alternating row styling.

#### Scenario: Formatting lore and chronicler observations
- **GIVEN** rule text or flavor text in a journal page
- **WHEN** the page content is rendered
- **THEN** quotations are wrapped in semantic `<blockquote>` tags with author attribution
- **AND** headings follow strict visual hierarchy (`<h1>` through `<h3>`)

### Requirement: Compendium Cross-Referencing via UUID Links
Journal pages referencing creatures, weapons, spells, or roll tables SHALL use Foundry's `@UUID[...]` syntax (e.g. `@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.<id>]{<Nome>}`) to provide direct interactive link access for Game Masters during sessions.

#### Scenario: Clicking an encounter link inside an adventure text
- **GIVEN** an encounter description naming a threat like Inumano or Lynel
- **WHEN** the journal page is read in Foundry VTT
- **THEN** the creature name is an active `@UUID` compendium link
- **AND** clicking the link opens the corresponding actor sheet from `Ameacas_T20`

### Requirement: Dragão Brasil #230 Journals Subdocument Architecture
All journals from Dragão Brasil #230 (*O Reino dos Pesadelos*, *Aventura: A Corrida Brutal*) SHALL be stored in `packs/Diarios_T20` inside the canonical *Dragão Brasil* folder. Conforming to Hotfix v1.6.2, `JournalEntry.pages` MUST strictly be an array of string IDs (`[pageId1, pageId2, ...]`), with the full page subdocument stored under `!journal.pages!journalId.pageId`.

#### Scenario: Journal pages resolution
- **GIVEN** a journal from DB #230
- **WHEN** inspected in the LevelDB pack
- **THEN** `pages` contains string IDs only
- **AND** all corresponding page keys exist in LevelDB with formatted HTML content

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
