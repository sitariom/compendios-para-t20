# Spec Delta: actors-specification

## ADDED Requirements

### Requirement: Dragão Brasil #229 Canonical Threat Integration
All threats from Dragão Brasil #229 (*Defensor Rochoso Desperto ND 8*, *Revoada de Serpes ND 8*, *Presa do Grande Basilisco ND 3* e *Basilisco Ancestral ND 9*) SHALL be stored in `packs/Ameacas_T20` inside the canonical folder *Dragão Brasil* (`wfWApuyngzFm4KOP`) and mirrored in `src/packs/Ameacas_T20/`. Each threat MUST possess 34 skills calculated with the standard formula, dynamic defense base (`base + des = value`), complete movement object, complete traits and condition immunities, and exclusive top-down tokens from 2-Minute Tabletop.

#### Scenario: Defensor Rochoso Desperto ND 8 schema validation
- **GIVEN** the creature Defensor Rochoso Desperto published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `solo`, ND is `8`
- **AND** defense is 33 with base 33 and Des 0
- **AND** traits include general damage reduction 10, immunity to stunned and petrified, and abascant nature 50%
- **AND** natural attack *Duas pancadas +26 (4d8+19, x3)* has structured `rolls.parts`
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/defensor-rochoso-desperto.png`

#### Scenario: Revoada de Serpes ND 8 schema validation
- **GIVEN** the creature Revoada de Serpes published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `eno` (3x3), role is `solo`, ND is `8`
- **AND** defense is 33 with base 32 and Des 1
- **AND** immunity is set to paralysis
- **AND** natural attacks include *Mordida +26 (2d6+12)*, *Ferrão +26 (1d8+12 mais veneno)*, *Agarrar Aprimorado (+31)* e *Peçonha Concentrada*
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/revoada-de-serpes.png`

#### Scenario: Presa do Grande Basilisco ND 3 schema validation
- **GIVEN** the creature Presa do Grande Basilisco published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `padrao`, ND is `3`
- **AND** defense is 20 with base 18 and Des 2
- **AND** powers include *Ódio Sórdido*, *Vitalidade Peçonhenta* (recupera 1d12 com veneno) e *Peçonha Concentrada*
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/presa-do-grande-basilisco.png`

#### Scenario: Basilisco Ancestral ND 9 schema validation
- **GIVEN** the creature Basilisco Ancestral published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `eno` (3x3), role is `solo`, ND is `9`
- **AND** defense is 33 with base 31 and Des 2
- **AND** traits include damage reduction 10, immunity to shapechange, and poison resistance +10
- **AND** powers include *Olhar Petrificante* (CD 28), *Sopro* (cone 9m, 3d12, CD 28) e *Peçonha Potente*
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/basilisco-ancestral.png`
