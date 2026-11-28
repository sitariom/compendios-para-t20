## ADDED Requirements

### Requirement: Canonical Threat Actors and Hazards of Fúlgor dos Deuses Edition 31
All canonical threats and complex hazards from Edition 31 (*Pecados do Pai*) SHALL reside in `rt20-031-ameacas` under `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-31/rt20-031-ameacas` with 16-char `fld31*` IDs, 34 skills, dynamic defense base, atomic abilities, individual spells, and 2-Minute Tabletop transparent tokens (`1x1` Medium, `2x2` Large).

#### Scenario: Isco do Fullgor, Jardineiro Dourado, and Lisandra Deturpada schema validation
- **GIVEN** the three Edition 31 threats (`Isco do Fullgor` ND 11, `Jardineiro Dourado` ND 11, `Lisandra Deturpada` ND 13)
- **WHEN** the actor documents are validated
- **THEN** Isco has size `gra` (`2x2`), defense 41 (`base 39 + Des 2`), PV 400, vulnerability to fire, and 4x `Pancada +27 (2d8+15)`
- **AND** Jardineiro Dourado has defense 35 (`base 33 + Des 2`), PV 385, PM 49, RD 10, vulnerability to fire, 4x `Cipós +30 (2d6+20)`, and 6 simulated spell items
- **AND** Lisandra Deturpada has defense 45 (`base 42 + Des 3`), PV 455, PM 62, CD 35, RD 15, `Espada Bastarda` + `Gavinhas x2`, 5 spell items, and embedded `Símbolo sagrado de Allihanna` (`equipado: false`)

### Requirement: Edition 31 Rewards, Journal, Roll Tables, and Corruption Tracker Macro
`rt20-031-equipamentos` SHALL contain `Estilhas Cristalinas do Fullgor (Edição 31)`, `rt20-031-poderes` SHALL contain `Parceira: Lisandra de Allihanna` and `Vínculo de Greenleaf: Bênção de Lisandra`, `rt20-031-diarios` SHALL contain the 7-page adventure journal, `rt20-031-tabelas` SHALL contain 3 roll tables (10, 4, 4 results), and `rt20-031-macros` SHALL contain the Edition 31 tracker macro.

#### Scenario: Validating Edition 31 compliance suite
- **GIVEN** the Edition 31 documents across `rt20-031-*`
- **WHEN** `npm run validate:fullgor31` executes
- **THEN** all actors, hazards, items, 7-page journal, 3 tables, and macro pass with 0 errors
