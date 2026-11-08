# Spec Delta: actors-specification

## ADDED Requirements

### Requirement: Dragão Brasil #230 Canonical Threat Integration
All 14 threats from Dragão Brasil #230 (*Zangão do Pesadelo ND 5*, *Coletor do Pesadelo ND 6*, *Ceifador do Pesadelo ND 8*, *Pesadelo Polivalente ND 10*, *Mestre do Pesadelo ND 15*, *Lanceiro Onírico ND 2*, *Ginete Onírico ND 3*, *Sargento Onírico ND 4*, *Tenente Onírico ND 6*, *Nócnam Mur ND 18*, *Sacerdote Caído ND 5*, *Três Goblins em um Gorlogg ND 7*, *Arzak ND 8*, *Gaardak ND 8*) SHALL be stored in `packs/Ameacas_T20` inside the canonical folder *Dragão Brasil* (`wfWApuyngzFm4KOP`) and mirrored in `src/packs/Ameacas_T20/`. Each threat MUST possess 34 skills calculated with the standard formula, dynamic defense base (`base + des = value`), complete movement object, complete traits and condition immunities, and exclusive top-down tokens from 2-Minute Tabletop.

#### Scenario: Criaturas do Pesadelo schema validation
- **GIVEN** the 10 nightmare creatures and dream mercenaries from DB #230
- **WHEN** the actor documents are validated
- **THEN** type is `npc`, folder is `wfWApuyngzFm4KOP`
- **AND** all creatures possess Mente Alienígena, Fome de Sonhos, or unique nightmare abilities with functional DCs
- **AND** tokens use 2-Minute Tabletop artwork under `modules/compendios-para-t20/assets/tokens/`
- **AND** biographies include descriptive introductory lore with double quotes in italics

#### Scenario: Corrida Brutal threats schema validation
- **GIVEN** the 4 threats from Breves Jornadas: Corrida Brutal (*Sacerdote Caído*, *Três Goblins em um Gorlogg*, *Arzak*, *Gaardak*)
- **WHEN** the actor documents are validated
- **THEN** types, sizes, roles, and NDs match the published stat blocks
- **AND** natural and weapon attacks contain structured `rolls.parts`
- **AND** tokens use 2-Minute Tabletop artwork
