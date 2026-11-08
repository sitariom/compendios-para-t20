# Spec Delta: tables-specification

## ADDED Requirements

### Requirement: Dragão Brasil #230 Roll Tables Subdocument Architecture
All roll tables from Dragão Brasil #230 (*Natureza do Pesadelo*, *Ganchos do Pesadelo em Aslothia*, *Encontros da Corrida Brutal*, *Sonhos Roubados pelo Coletor*) SHALL be stored in `packs/Tabelas_T20`. Conforming to Hotfix v1.6.2, `RollTable.results` MUST strictly be an array of string IDs (`[resultId1, resultId2, ...]`), with the full result subdocument stored under `!tables.results!tableId.resultId` with `type: "text"` and `description`.

#### Scenario: RollTable results resolution
- **GIVEN** a roll table from DB #230
- **WHEN** inspected in the LevelDB pack
- **THEN** `results` contains string IDs only
- **AND** all corresponding result keys exist in LevelDB with formatted outcome text
