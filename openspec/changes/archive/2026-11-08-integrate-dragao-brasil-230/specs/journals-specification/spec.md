# Spec Delta: journals-specification

## ADDED Requirements

### Requirement: Dragão Brasil #230 Journals Subdocument Architecture
All journals from Dragão Brasil #230 (*O Reino dos Pesadelos*, *Aventura: A Corrida Brutal*) SHALL be stored in `packs/Diarios_T20` inside the canonical *Dragão Brasil* folder. Conforming to Hotfix v1.6.2, `JournalEntry.pages` MUST strictly be an array of string IDs (`[pageId1, pageId2, ...]`), with the full page subdocument stored under `!journal.pages!journalId.pageId`.

#### Scenario: Journal pages resolution
- **GIVEN** a journal from DB #230
- **WHEN** inspected in the LevelDB pack
- **THEN** `pages` contains string IDs only
- **AND** all corresponding page keys exist in LevelDB with formatted HTML content
