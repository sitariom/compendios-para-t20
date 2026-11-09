# Spec Delta: actors-specification

## ADDED Requirements

### Requirement: Dragão Brasil #231 Canonical Threat Integration
All 10 threats from Dragão Brasil #231 (6 from *A Vastidão Dourada de Halak-Tûr*: *Arraia-Seca ND 3*, *Anshira ND 9*, *Caçador de Condenados ND 11*, *Constritora Arenosa ND 9*, *Ressecado Saqueador ND 4*, *Ressecado Líder ND 4*; and 4 from *Breves Jornadas: Circo Sombrio*: *Bianco ND 2*, *Rojo ND 2*, *Mantícora Zumbi ND 3*, *Morrise ND 3*) SHALL be stored in `packs/Ameacas_T20` inside the canonical folder *Dragão Brasil* (`wfWApuyngzFm4KOP`). Each threat MUST possess strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`), 34 skills under `system.pericias`, dynamic defense base (`defesa.base + des === defesa.value`), complete attributes, subdocument items under `!actors.items!actorId.itemId`, attacks modeled as weapon items with structured `rolls.parts` including damage types, biographies with canonical double blockquotes (`#800000` and `#006400`), and dedicated top-down tokens from 2-Minute Tabletop.

#### Scenario: Halak-Tûr desert threats schema validation
- **GIVEN** the 6 desert threats from Halak-Tûr (*Arraia-Seca*, *Anshira*, *Caçador de Condenados*, *Constritora Arenosa*, *Ressecado Saqueador*, *Ressecado Líder*)
- **WHEN** actor documents and subdocuments are validated
- **THEN** type is `npc`, folder is `wfWApuyngzFm4KOP`
- **AND** primary IDs have exactly 16 characters
- **AND** all special abilities (Armadilha de Ferrão, Refúgio Rochoso, Simbiose Rochosa, Sequência Mortal, Constrição, Celeridade Odiosa, Ordens Letais) have valid descriptions and formulas
- **AND** Anshira possesses 9th level spellcasting with CD 32
- **AND** tokens reference valid files under `modules/compendios-para-t20/assets/tokens/`

#### Scenario: Circo Sombrio threats schema validation
- **GIVEN** the 4 threats from Breves Jornadas: Circo Sombrio (*Bianco*, *Rojo*, *Mantícora Zumbi*, *Morrise*)
- **WHEN** actor documents and subdocuments are validated
- **THEN** roles, sizes, NDs and defenses match the magazine text
- **AND** Morrise's spells and whip attacks contain dark damage in `rolls.parts`
- **AND** Mantícora Zumbi possesses rotting quills and flight movement
- **AND** Rojo has Cascudo DR 5 and Bianco has sneak attack +2d6
